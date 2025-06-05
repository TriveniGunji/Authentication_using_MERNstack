// frontend/src/app/page.jsx
'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-content-area flex-center">
            <div className="form-card text-center">
                <h1 className="form-title">
                    Welcome to the Secure Authentication System
                </h1>
                <p className="mb-4 text-muted">
                    Built with Node.js, Express, MongoDB, and React.js/Next.js.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <Link href="/login" className="btn btn-primary">
                        Login
                    </Link>
                    <Link href="/register" className="btn btn-secondary">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}