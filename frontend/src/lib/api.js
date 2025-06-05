// frontend/src/lib/api.js
import axios from 'axios';

// Backend API base URL is loaded from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Create an Axios instance with base URL and default headers
const api = axios.create({
    baseURL: API_BASE_URL + '/api', // All backend API routes start with /api
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios Interceptor: This will run before every request made using 'api' instance
api.interceptors.request.use(
    (config) => {
        // Get JWT token from localStorage
        const token = localStorage.getItem('token');
        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Return the modified config
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

export default api;