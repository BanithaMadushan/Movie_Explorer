# Movie Explorer Backend

A RESTful API backend for the Movie Explorer application built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout)
- JWT-based authentication
- User profile management
- Favorite movies management
- RESTful API design
- MongoDB database integration
- Error handling middleware
- Input validation

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### User Management

- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update user password

### Favorites Management

- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add movie to favorites
- `DELETE /api/favorites/:id` - Remove movie from favorites
- `GET /api/favorites/check/:id` - Check if movie is in favorites
- `DELETE /api/favorites` - Clear all favorites

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```
4. Start the server: `npm run dev`

## Usage

The API can be accessed at `http://localhost:5000` by default.

### Example Requests

#### Register a new user

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Add a movie to favorites

```
POST /api/favorites
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "movieId": 123456,
  "title": "The Matrix",
  "poster_path": "/path/to/poster.jpg",
  "backdrop_path": "/path/to/backdrop.jpg",
  "overview": "Movie description...",
  "release_date": "1999-03-31",
  "vote_average": 8.7,
  "genre_ids": [28, 878]
}
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation 