import { createContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext();

export default AuthContext;

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

    // Hits the Django backend and saves the tokens
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

    // Logout Function: Clears state and local storage
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('authUser');
    };

    // Make these variables and functions available to the whole app
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