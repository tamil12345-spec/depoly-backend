# Full-Stack Auth App
React + Express + MongoDB + Nodemailer

## Project Structure
```
fullstack-auth/
├── backend/
│   ├── models/User.js          # Mongoose user model (bcrypt, reset token)
│   ├── routes/auth.js          # All 4 auth routes
│   ├── middleware/index.js     # JWT protect + error handler
│   ├── utils/sendEmail.js      # Nodemailer with HTML templates
│   ├── server.js               # Express app entry
│   ├── .env.example            # Copy to .env and fill in values
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/AuthContext.js   # Auth state, login/register/logout
    │   ├── services/api.js          # Axios instance + all API calls
    │   ├── utils/validation.js      # Email, password, strength helpers
    │   ├── components/UI.jsx        # All reusable UI components
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── ResetPassword.jsx    # Uses token from URL param
    │   │   └── Dashboard.jsx        # Protected page
    │   ├── App.js                   # Router + route guards
    │   └── index.js / index.css
    └── package.json
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env          # Fill in MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS
npm run dev                   # Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm start                     # Runs on zippy-croquembouche-b60afa.netlify.app
```

## API Endpoints

| Method | Endpoint                          | Body                         | Description         |
|--------|-----------------------------------|------------------------------|---------------------|
| POST   | /api/auth/register                | name, email, password        | Create account      |
| POST   | /api/auth/login                   | email, password              | Sign in             |
| POST   | /api/auth/forgot-password         | email                        | Send reset email    |
| POST   | /api/auth/reset-password/:token   | password                     | Set new password    |

## Password Reset Flow
1. User submits email → `/api/auth/forgot-password`
2. Server generates secure token, hashes it, saves to DB, emails plain token
3. Email link: `zippy-croquembouche-b60afa.netlify.app/reset-password/<plain-token>`
4. User submits new password → `/api/auth/reset-password/:token`
5. Server hashes token, finds user, updates password, returns JWT

## Gmail Setup
1. Enable 2-Step Verification on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate password for "Mail" and use it as `EMAIL_PASS`
