import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

// Intercept every request BEFORE it leaves the frontend
api.interceptors.request.use(
    (config) => {
        const authData = JSON.parse(localStorage.getItem('authTokens') || 'null');
        if (authData?.access) {
            config.headers.Authorization = `Bearer ${authData.access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;