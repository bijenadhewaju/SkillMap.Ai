import { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        return storedTokens ? JSON.parse(storedTokens) : null;
    });

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('authUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const hydrateUser = async (tokens) => {
        if (!tokens?.access) {
            setUser(null);
            return null;
        }

        try {
            const response = await api.get('/api/accounts/profile/', {
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
            });

            localStorage.setItem('authUser', JSON.stringify(response.data));
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to hydrate authenticated user', error);
            setUser(null);
            localStorage.removeItem('authUser');
            return null;
        }
    };

    const loginUser = async (email, password) => {
        try {
            const response = await api.post('/api/accounts/login/', {
                username: email,
                password: password
            });

            if (response.status === 200) {
                const tokens = {
                    access: response.data.access,
                    refresh: response.data.refresh
                };

                localStorage.setItem('authTokens', JSON.stringify(tokens));
                setAuthTokens(tokens);
                await hydrateUser(tokens);
                return { success: true };
            }

            return { success: false, message: 'Invalid credentials.' };
        } catch (err) {
            const message = err?.response?.data?.detail || 'Invalid credentials.';
            return { success: false, message };
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('authUser');
    };

    // Auto-logout timer
    useEffect(() => {
        if (authTokens?.access) {
            try {
                const payload = JSON.parse(atob(authTokens.access.split('.')[1]));
                const expirationTime = payload.exp * 1000;
                const timeRemaining = expirationTime - Date.now();

                if (timeRemaining > 0) {
                    const logoutTimer = setTimeout(() => {
                        logoutUser();
                    }, timeRemaining);
                    return () => clearTimeout(logoutTimer);
                } else {
                    logoutUser();
                }
            } catch (error) {
                console.error("Failed to decode token", error);
                logoutUser();
            }
        }
    }, [authTokens]);

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};