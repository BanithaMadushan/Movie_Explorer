# MovieFlix - Movie Explorer Application

A Netflix-inspired movie explorer web application built with React, Material-UI, and TMDb API.

## Features

- User login interface with username and password
- Search functionality for finding movies
- Grid display of movie posters with details
- Detailed movie view with additional information
- Trending movies section
- Light/dark mode toggle
- Filter movies by genre, year, or rating
- YouTube trailer integration
- Save favorite movies to a list
- Mobile-responsive design

## Technologies Used

- React.js
- React Router for navigation
- Material-UI for styling
- Axios for API requests
- TMDb API for movie data
- YouTube API for trailers
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/movie-explorer.git
   cd movie-explorer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Keys

This application uses the following APIs:

- TMDb API: The Movie Database API for fetching movie data
  - API Key: ea5758a7e6e0705021c3e48f9579899d

- YouTube API: For embedding movie trailers
  - API Key: AIzaSyD_hmdsN5vnXpOrBP4GXWKXaRe7Ix_wpYU

## Usage

- **Login**: Use any username and password (minimum 6 characters) for demo purposes
- **Search**: Use the search bar to find movies by title
- **Browse**: Explore trending movies on the homepage
- **Filter**: Filter movies by genre, year, or rating
- **Favorites**: Save movies to your favorites list by clicking the heart icon
- **Details**: Click on any movie to view detailed information and watch trailers

## Project Structure

```
movie-explorer/
├── public/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Reusable UI components
│   ├── context/        # React context for state management
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── App.js          # Main App component
│   └── index.js        # Entry point
└── package.json
```

## Acknowledgements

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the movie data API
- [Material-UI](https://mui.com/) for the UI components
- [React Router](https://reactrouter.com/) for navigation
- [Netflix](https://www.netflix.com/) for UI/UX inspiration
