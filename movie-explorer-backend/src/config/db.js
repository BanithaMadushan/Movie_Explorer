const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the direct MongoDB URI if environment variable is not available
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://banitha:banitha123@movie-explorer.a34i0tv.mongodb.net/?retryWrites=true&w=majority&appName=Movie-Explorer';
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 