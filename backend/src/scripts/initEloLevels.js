// Script to initialize ELO levels in the database
require('dotenv').config();
const mongoose = require('mongoose');
const { initializeEloLevels } = require('../utils/eloUtils');
const EloLevelModel = require('../models/eloLevelModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_flashcards')
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Initialize ELO levels
      await initializeEloLevels(EloLevelModel);
      console.log('ELO levels initialization complete');
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      // Close connection
      mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
