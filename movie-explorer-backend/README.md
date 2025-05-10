# Movie Explorer Backend API

Backend API for the Movie Explorer application built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login)
- JWT-based authentication
- User profile management
- RESTful API design
- Error handling middleware
- MongoDB database integration

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/profile` - Update user profile (requires authentication)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   ```
4. Run the server:
   ```
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt.js for password hashing
- CORS for cross-origin requests
- Morgan for logging
- dotenv for environment variables 