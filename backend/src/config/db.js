const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://banithamadu12:banitha%401234@movie.jj9ig6m.mongodb.net/movie-explorer';
    
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection by checking the connection state
    const connectionState = mongoose.connection.readyState;
    console.log(`MongoDB Connection State: ${connectionState} (0: disconnected, 1: connected, 2: connecting, 3: disconnecting)`);
    
    // Listen for connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Full error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 