// frontend/src/app/login/page.jsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
    const { login, loading, error } = useAuth(); // Access login function and loading/error state from AuthContext

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState(null); // Local error state for client-side validation

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null); // Clear any previous local form errors

        // Client-side validation: ensure email and password are not empty
        if (!email || !password) {
            setFormError('Please enter both email and password.');
            return;
        }

        try {
            await login(email, password); // Call login function from AuthContext
            // Redirection to /verify-otp is handled by AuthContext after successful login request
        } catch (err) {
            setFormError(err.message || 'An unexpected error occurred during login.'); // Display error from AuthContext
        }
    };

    return (
        <div className="min-h-content-area flex-center">
            <div className="form-card">
                <h2 className="form-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    {/* Display local form validation errors */}
                    {formError && (
                        <p className="text-error">{formError}</p>
                    )}
                    {/* Display backend/auth context errors */}
                    {error && (
                        <p className="text-error">{error}</p>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading} // Disable button while authentication is in progress
                    >
                        {loading ? 'Sending OTP...' : 'Login & Get OTP'}
                    </button>
                </form>
                <p className="mt-4 text-center text-muted">
                    Don't have an account? <Link href="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}