// frontend/src/contexts/AuthContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(undefined); // Create a context without an initial value

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true, // Indicates if authentication state is being loaded
        error: null, // Stores any authentication errors
    });
    const router = useRouter(); // Next.js router for navigation

    // Effect to load authentication state from localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        if (token && userString) {
            try {
                const user = JSON.parse(userString); // Parse user data
                setAuthState({
                    user,
                    token,
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                });
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                // Clear invalid data and reset auth state
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setAuthState(prev => ({ ...prev, loading: false, isAuthenticated: false, user: null, token: null }));
            }
        } else {
            setAuthState(prev => ({ ...prev, loading: false })); // No token/user found, not authenticated
        }
    }, []); // Runs only once on mount

    // Function to handle user login (sends email for OTP)
    const login = async (email, password) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await api.post('/auth/login', { email, password });
            setAuthState(prev => ({ ...prev, loading: false }));
            // After successful login request, redirect to OTP verification page
            router.push(`/verify-otp?email=${email}`);
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
            throw new Error(errorMessage); // Re-throw to be caught by component
        }
    };

    // Function to verify OTP and complete login
    const verifyOtp = async (email, otp) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await api.post('/auth/verify-otp', { email, otp });
            const { token, user } = res.data;
            // Store token and user data in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setAuthState({ user, token, isAuthenticated: true, loading: false, error: null });
            router.push('/dashboard'); // Redirect to dashboard on successful verification
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'OTP verification failed. Please try again.';
            setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
            throw new Error(errorMessage);
        }
    };

    // Function to handle user registration
    const register = async (formData) => { // formData is a FormData object for file uploads
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await api.post('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Important for file uploads
                }
            });
            setAuthState(prev => ({ ...prev, loading: false }));
            router.push('/login'); // Redirect to login page after successful registration
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
            throw new Error(errorMessage);
        }
    };

    // Function to log out the user
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({ user: null, token: null, isAuthenticated: false, loading: false, error: null });
        router.push('/login'); // Redirect to login page on logout
    };

    // Function to delete user account
    const deleteAccount = async () => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            await api.delete('/auth/delete-account'); // API call to delete account
            logout(); // Log out after deletion
            alert('Account deleted successfully.');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete account.';
            setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }));
            throw new Error(errorMessage);
        }
    };

    return (
        // Provide auth state and functions to consumers of this context
        <AuthContext.Provider value={{ ...authState, login, verifyOtp, register, logout, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily access auth context values
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};