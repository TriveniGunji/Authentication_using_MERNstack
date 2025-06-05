// frontend/src/app/layout.jsx
import './globals.css'; // Import global CSS
import { Inter } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthContext';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'NodeJS Auth System',
    description: 'Secure User Authentication with NodeJS and React.js',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <header className="app-header">
                        <nav className="container-main app-nav">
                            <Link href="/" className="app-title">
                                AuthApp
                            </Link>
                            <div className="nav-links">
                                <Link href="/register" className="nav-link">
                                    Register
                                </Link>
                                <Link href="/login" className="nav-link">
                                    Login
                                </Link>
                                <Link href="/dashboard" className="nav-link">
                                    Dashboard
                                </Link>
                            </div>
                        </nav>
                    </header>
                    <main className="app-main">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}