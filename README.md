# Task Management Application

A production-ready full-stack task management application with secure authentication and premium aesthetics.

## Features
- **Secure Authentication**: JWT-based auth with HTTP-only cookies and bcrypt password hashing.
- **Payload Encryption**: Sensitive user data in API responses is encrypted using AES-256.
- **Task Management**: Full CRUD operations for personal tasks.
- **Advanced API**: Search by title, filter by status, and pagination support.
- **Premium UI**: Modern dark theme with glassmorphism and smooth animations.

## Tech Stack
- **Frontend**: React.js (Vite), Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Security**: JWT, AES-256-GCM, Bcrypt

## Architecture
The application follows a clean decoupling of frontend and backend:
- **Server**: Modular controller-route pattern. Middleware handles JWT validation and authorization.
- **Client**: Context-driven state management for auth. Component-based UI with responsive design.

## Setup Instructions

### Backend
1. `cd server`
2. `npm install`
3. Create `.env` file (see below)
4. `npm start` or `node server.js`

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`

### Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=32-character-secret-encryption-key-123
NODE_ENV=development
```

## Sample API Documentation

### Auth: Register
**POST** `/api/auth/register`
Response:
```json
{
  "success": true,
  "payload": "encrypted_user_data..."
}
```

### Tasks: Get All
**GET** `/api/tasks?page=1&limit=5&search=work&status=pending`
Response:
```json
{
  "success": true,
  "count": 1,
  "pagination": { "next": { "page": 2, "limit": 5 } },
  "total": 12,
  "data": [...]
}
```
