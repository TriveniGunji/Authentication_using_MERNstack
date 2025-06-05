// frontend/src/app/register/page.jsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './register.module.css'; // Import CSS Modules

export default function RegisterPage() {
    const { register, loading, error } = useAuth(); // Access auth context functions and state
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        age: '',
        dob: '',
        profileImage: null, // Will store File object from input type="file"
    });
    const [formError, setFormError] = useState(null); // Local error message for form validation

    // Handles changes in form inputs
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const file = e.target.files?.[0] || null; // Get the selected file
            setFormData({ ...formData, [name]: file });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Client-side form validation
    const validateForm = () => {
        setFormError(null); // Clear previous errors

        // Basic required fields check
        if (!formData.name || !formData.email || !formData.password) {
            setFormError('Please fill in all required fields (Name, Email, Password).');
            return false;
        }

        // Email format validation
        const emailRegex = /.+@.+\..+/;
        if (!emailRegex.test(formData.email)) {
            setFormError('Please enter a valid email address.');
            return false;
        }

        // Password strength validation (at least 6 chars, 1 digit, 1 lowercase, 1 uppercase)
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        if (!passwordRegex.test(formData.password)) {
            setFormError('Password must be at least 6 characters long and contain at least one digit, one lowercase, and one uppercase letter.');
            return false;
        }

        // Profile image validation
        if (formData.profileImage) {
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(formData.profileImage.type)) {
                setFormError('Only PNG and JPG/JPEG image formats are allowed.');
                return false;
            }
            if (formData.profileImage.size > 2 * 1024 * 1024) { // 2MB limit
                setFormError('Profile image size cannot exceed 2MB.');
                return false;
            }
        }

        return true; // Form is valid
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null); // Clear previous local form errors

        if (!validateForm()) {
            return; // Stop if validation fails
        }

        // Create FormData object to send multipart/form-data (required for file uploads)
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('company', formData.company);
        data.append('age', formData.age);
        data.append('dob', formData.dob);
        if (formData.profileImage) {
            data.append('profileImage', formData.profileImage);
        }

        try {
            await register(data); // Call the register function from AuthContext
            // Redirection to /login is handled by the AuthContext after successful registration
        } catch (err) {
            setFormError(err.message || 'Registration failed.'); // Display backend error
        }
    };

    return (
        <div className="min-h-content-area flex-center">
            <div className="form-card">
                <h2 className="form-title">Register</h2>
                <form onSubmit={handleSubmit}>
                    {/* Display local form validation errors */}
                    {formError && (
                        <p className="text-error">{formError}</p>
                    )}
                    {/* Display backend errors from AuthContext */}
                    {error && (
                        <p className="text-error">{error}</p>
                    )}
                    <div className="form-group">
                        <label htmlFor="name">Name <span className={styles.requiredStar}>*</span></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email <span className={styles.requiredStar}>*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password <span className={styles.requiredStar}>*</span></label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profileImage">Profile Image (PNG/JPG, max 2MB)</label>
                        <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept=".png,.jpg,.jpeg" // Specify accepted file types
                            onChange={handleChange}
                            className={styles.profileImageInput}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading} // Disable button while loading/submitting
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="mt-4 text-center text-muted">
                    Already have an account? <Link href="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}