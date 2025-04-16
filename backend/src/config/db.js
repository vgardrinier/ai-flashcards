// MongoDB Atlas connection setup for production deployment
require('dotenv').config();
const mongoose = require('mongoose');

// Connection string with credentials
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://username:password@cluster0.mongodb.net/ai_flashcards?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Atlas connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
