Sure! Here's a comprehensive **README.md** file for your MERN Authentication System project based on the details you shared:

---

# Authentication System - MERN Stack

A complete user authentication system with registration, login, OTP verification, and account management.

---

## Features

* **User Registration:** Name, email, password, company, age, DOB, profile image upload
* **Secure Login:** Email/password authentication with 6-digit OTP verification sent via email
* **User Dashboard:** View and manage user profile and account details
* **Account Management:** Update profile and delete account functionality
* **File Upload:** Support for PNG/JPG profile images

---

## Project Structure

```
AUTHENTICATION/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication middleware
│   ├── models/          # User data models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── uploads/         # Profile images storage
│   ├── utils/           # Helper functions (e.g., email sender)
│   └── server.js        # Express server entry point
├── frontend/
│   ├── src/app/
│   │   ├── dashboard/   # User dashboard pages
│   │   ├── login/       # Login page
│   │   ├── register/    # Registration page
│   │   └── verify-otp/  # OTP verification page
│   ├── contexts/        # React Context API for authentication state
│   └── lib/             # Utility functions for frontend
└── README.md
```

---

## Tech Stack

* **Frontend:** Next.js, React, Context API
* **Backend:** Node.js, Express.js, JWT (JSON Web Tokens)
* **Database:** MongoDB with Mongoose
* **Email:** Nodemailer with Gmail SMTP
* **File Upload:** Multer middleware
* **Security:** bcrypt password hashing, input validation, JWT authentication, OTP expiration

---

## Prerequisites

* Node.js (v16 or higher)
* MongoDB (local or cloud instance)
* Gmail account for sending OTP emails (use App Password if 2FA enabled)

---

## Quick Setup

### Backend

1. Navigate to backend folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file with the following environment variables:

   ```
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/auth_db
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   OTP_EXPIRY=10
   ```
4. Start the backend server:

   ```bash
   npm start
   ```

---

### Frontend

1. Navigate to frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create `.env.local` file with:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start frontend dev server:

   ```bash
   npm run dev
   ```

---

## API Endpoints

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| POST   | `/api/auth/register`       | User registration   |
| POST   | `/api/auth/login`          | User login          |
| POST   | `/api/auth/verify-otp`     | OTP verification    |
| GET    | `/api/auth/dashboard`      | Fetch user profile  |
| DELETE | `/api/auth/delete-account` | Delete user account |

---

## How It Works

1. **Register:** User fills in personal details and uploads a profile image.
2. **Login:** User enters email and password, then receives a 6-digit OTP via email.
3. **Verify:** User submits OTP within 10 minutes to authenticate.
4. **Dashboard:** Access user profile and manage account.
5. **Manage:** Users can update profile details or delete account as needed.

---

## Security Features

* Passwords are hashed securely with bcrypt before storage
* JWT tokens protect routes and sessions
* OTP expires after 10 minutes to prevent reuse
* Input validation and sanitization to avoid injection attacks
* Protected API routes via middleware

---

## Access URLs (Default Localhost)

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:5000/api](http://localhost:5000/ap
