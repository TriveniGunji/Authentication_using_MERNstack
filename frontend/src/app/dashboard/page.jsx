// frontend/src/app/dashboard/page.jsx
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Next.js Image component for optimized images
import styles from './dashboard.module.css'; // Import CSS Modules

export default function DashboardPage() {
    const { user, isAuthenticated, loading, logout, deleteAccount, error } = useAuth(); // Access auth state and functions
    const router = useRouter();

    // Redirect unauthenticated users to login page
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]); // Dependency array ensures effect runs when these values change

    // Handler for deleting account
    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await deleteAccount(); // Call deleteAccount function from AuthContext
                // Redirection is handled by AuthContext after successful deletion
            } catch (err) {
                alert(err.message || 'Failed to delete account.'); // Display error from AuthContext
            }
        }
    };

    // Show loading state while authentication status is being determined
    if (loading) {
        return (
            <div className="min-h-content-area flex-center">
                <p>Loading user data...</p>
            </div>
        );
    }

    // Show access denied if not authenticated or user data is missing after loading
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-content-area flex-center">
                <p className="text-error">Access Denied. Please log in to view the dashboard.</p>
            </div>
        );
    }

    // Determine the full URL for the profile image
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    // Construct the image URL, replacing backslashes with forward slashes for URLs
    const profileImageUrl = user.profileImage
        ? `<span class="math-inline">\{backendUrl\}/</span>{user.profileImage.replace(/\\/g, '/')}`
        : '/default-profile.jpg'; // Fallback to a default image in public folder

    return (
        <div className="min-h-content-area flex-center p-4">
            <div className={styles.dashboardContainer}>
                <h2 className={styles.dashboardTitle}>Welcome to Your Dashboard, {user.name}!</h2>

                <div className={styles.profileImageWrapper}>
                    <Image
                        src={profileImageUrl}
                        alt="Profile"
                        width={120} // Set desired width
                        height={120} // Set desired height
                        className={styles.profileImage}
                        onError={(e) => {
                            // Fallback if the profile image fails to load
                            e.target.onerror = null;
                            e.target.src = '/default-profile.png';
                        }}
                    />
                </div>

                <div className={styles.userInfo}>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.company && <p><strong>Company:</strong> {user.company}</p>}
                    {user.age && <p><strong>Age:</strong> {user.age}</p>}
                    {user.dob && <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>}
                </div>

                {/* Display any general errors from AuthContext */}
                {error && (
                    <p className="text-error mb-4">{error}</p>
                )}

                <div className={styles.buttonGroup}>
                    <button
                        onClick={logout}
                        className="btn btn-danger"
                    >
                        Logout
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="btn btn-secondary"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}