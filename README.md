Authentication System - MERN Stack
A complete user authentication system with registration, login, OTP verification, and account management.
Features

User Registration: Name, email, password, company, age, DOB, profile image
Secure Login: Email/password with 6-digit OTP verification
User Dashboard: Profile management and account overview
Account Management: Update profile and delete account
File Upload: Profile image support (PNG/JPG)

Project Structure
AUTHENTICATION/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication middleware
│   ├── models/          # User data models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── uploads/         # Profile images storage
│   ├── utils/           # Helper functions
│   └── server.js
├── frontend/
│   ├── src/app/
│   │   ├── dashboard/   # User dashboard
│   │   ├── login/       # Login page
│   │   ├── register/    # Registration page
│   │   └── verify-otp/  # OTP verification
│   ├── contexts/        # React context (Auth)
│   └── lib/             # Utility functions
└── README.md
Quick Setup
Prerequisites

Node.js (v16+)
MongoDB
Gmail account (for OTP emails)

1. Backend Setup
bashcd backend
npm install
Create .env file:
envPORT=5000
DATABASE_URL=mongodb://localhost:27017/auth_db
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
OTP_EXPIRY=10
Start server:
bashnpm start
2. Frontend Setup
bashcd frontend
npm install
Create .env.local file:
envNEXT_PUBLIC_API_URL=http://localhost:5000/api
Start development server:
bashnpm run dev
API Endpoints

POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/verify-otp - OTP verification
GET /api/auth/dashboard - Get user dashboard
DELETE /api/auth/delete-account - Delete account

How It Works

Register: Fill form with personal details and upload profile image
Login: Enter email/password, receive OTP via email
Verify: Enter 6-digit OTP (expires in 10 minutes)
Dashboard: Access user profile and account management
Manage: Update profile or delete account

Tech Stack

Frontend: Next.js, React, Context API
Backend: Node.js, Express.js, JWT
Database: MongoDB, Mongoose
Email: Nodemailer with Gmail
File Upload: Multer
Security: bcrypt, input validation

Security Features

Password hashing with bcrypt
JWT token authentication
OTP expiration (10 minutes)
Input validation and sanitization
Protected routes and middleware

Access URLs

Frontend: http://localhost:3000
Backend API: http://localhost:5000
