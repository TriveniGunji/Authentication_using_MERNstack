// frontend/src/app/verify-otp/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './verify-otp.module.css'; // Import CSS Modules

export default function VerifyOtpPage() {
    const { verifyOtp, loading, error } = useAuth(); // Access verifyOtp function and state from AuthContext
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromParam = searchParams.get('email') || ''; // Get email from URL query parameter

    const [email, setEmail] = useState(emailFromParam);
    const [otp, setOtp] = useState('');
    const [formError, setFormError] = useState(null); // Local error state for client-side validation

    // Pre-fill email field if it comes from the URL parameter
    useEffect(() => {
        if (emailFromParam) {
            setEmail(emailFromParam);
        }
    }, [emailFromParam]); // Re-run if emailFromParam changes

    // Handles form submission for OTP verification
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null); // Clear previous local errors

        // Client-side validation: ensure email and OTP are not empty and OTP format is correct
        if (!email || !otp) {
            setFormError('Please enter both email and OTP.');
            return;
        }
        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            setFormError('OTP must be a 6-digit number.');
            return;
        }

        try {
            await verifyOtp(email, otp); // Call verifyOtp function from AuthContext
            // Redirection to /dashboard is handled by AuthContext upon successful verification
        } catch (err) {
            setFormError(err.message || 'An unexpected error occurred during OTP verification.'); // Display error from AuthContext
        }
    };

    return (
        <div className="min-h-content-area flex-center">
            <div className="form-card">
                <h2 className="form-title">Verify OTP</h2>
                <p className={styles.otpMessage}>A 6-digit OTP has been sent to your email.</p>
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
                            readOnly={!!emailFromParam} // Make email read-only if pre-filled from URL
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="otp">OTP</label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6} // Limit input to 6 characters
                            className={styles.otpInput}
                            placeholder="XXXXXX"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading} // Disable button while verification is in progress
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
                <p className="mt-4 text-center text-muted">
                    Didn't receive OTP? <Link href="/login">Go back to login</Link>
                </p>
            </div>
        </div>
    );
}