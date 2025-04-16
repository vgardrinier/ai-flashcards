// Test script for the AI flashcards application
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB models
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Flashcard = require('../models/flashcardModel');
const QuizQuestion = require('../models/quizQuestionModel');
const EloLevel = require('../models/eloLevelModel');

// Test configuration
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
let authToken = '';
let testUserId = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!'
};

// Helper functions
const logSuccess = (message) => console.log(`✅ ${message}`);
const logError = (error) => console.error(`❌ Error: ${error.message || error}`);
const logInfo = (message) => console.log(`ℹ️ ${message}`);

// Initialize database with test data
async function initializeTestData() {
  try {
    logInfo('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_flashcards');
    logSuccess('Connected to MongoDB');

    // Clear existing test data
    logInfo('Clearing existing test data...');
    await User.deleteOne({ email: testUser.email });
    logSuccess('Test data cleared');

    // Load categories from JSON
    const fs = require('fs');
    const path = require('path');
    
    // Create categories
    logInfo('Creating test categories...');
    const categories = [
      { name: 'AI Fundamentals', description: 'Core concepts of artificial intelligence and machine learning' },
      { name: 'Large Language Models', description: 'Understanding transformer models, attention mechanisms, and NLP' },
      { name: 'AI Agents', description: 'Autonomous systems, planning, and decision-making' },
      { name: 'Tech CTO Skills', description: 'Leadership, strategy, and technical skills for AI startup CTOs' }
    ];
    
    for (const category of categories) {
      await Category.findOneAndUpdate(
        { name: category.name },
        category,
        { upsert: true, new: true }
      );
    }
    logSuccess('Test categories created');
    
    // Load flashcards and quiz questions
    logInfo('Loading flashcards and quiz questions...');
    const flashcardsPath = path.join(__dirname, '..', '..', 'data', 'generated_flashcards.json');
    const quizQuestionsPath = path.join(__dirname, '..', '..', 'data', 'generated_quiz_questions.json');
    
    if (fs.existsSync(flashcardsPath) && fs.existsSync(quizQuestionsPath)) {
      const flashcardsData = JSON.parse(fs.readFileSync(flashcardsPath, 'utf8'));
      const quizQuestionsData = JSON.parse(fs.readFileSync(quizQuestionsPath, 'utf8'));
      
      // Get category IDs
      const categoryMap = {};
      const categories = await Category.find();
      categories.forEach(category => {
        categoryMap[category.name] = category._id;
      });
      
      // Process flashcards
      for (const flashcard of flashcardsData) {
        const categoryId = categoryMap[flashcard.category_id];
        if (categoryId) {
          await Flashcard.findOneAndUpdate(
            { question: flashcard.question },
            { ...flashcard, category_id: categoryId },
            { upsert: true, new: true }
          );
        }
      }
      
      // Process quiz questions
      for (const question of quizQuestionsData) {
        const categoryId = categoryMap[question.category_id];
        if (categoryId) {
          await QuizQuestion.findOneAndUpdate(
            { question: question.question },
            { ...question, category_id: categoryId },
            { upsert: true, new: true }
          );
        }
      }
      
      logSuccess(`Loaded ${flashcardsData.length} flashcards and ${quizQuestionsData.length} quiz questions`);
    } else {
      logError('Flashcards or quiz questions data files not found');
    }
    
    mongoose.connection.close();
    logSuccess('Test data initialization complete');
  } catch (error) {
    logError(error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
}

// API Tests
async function runApiTests() {
  try {
    logInfo('Starting API tests...');
    
    // Test user registration
    logInfo('Testing user registration...');
    const registerResponse = await axios.post(`${API_URL}/users/register`, testUser);
    if (registerResponse.data.success) {
      logSuccess('User registration successful');
      authToken = registerResponse.data.token;
      testUserId = registerResponse.data.user._id;
    } else {
      throw new Error('User registration failed');
    }
    
    // Test user login
    logInfo('Testing user login...');
    const loginResponse = await axios.post(`${API_URL}/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    if (loginResponse.data.success) {
      logSuccess('User login successful');
      authToken = loginResponse.data.token;
    } else {
      throw new Error('User login failed');
    }
    
    // Set auth header for subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    // Test getting categories
    logInfo('Testing category retrieval...');
    const categoriesResponse = await axios.get(`${API_URL}/categories`);
    if (categoriesResponse.data.success && categoriesResponse.data.data.length > 0) {
      logSuccess(`Retrieved ${categoriesResponse.data.data.length} categories`);
    } else {
      throw new Error('Category retrieval failed');
    }
    
    // Test getting flashcards
    logInfo('Testing flashcard retrieval...');
    const flashcardsResponse = await axios.get(`${API_URL}/flashcards`);
    if (flashcardsResponse.data.success && flashcardsResponse.data.data.length > 0) {
      logSuccess(`Retrieved ${flashcardsResponse.data.data.length} flashcards`);
    } else {
      throw new Error('Flashcard retrieval failed');
    }
    
    // Test getting quiz questions
    logInfo('Testing quiz question retrieval...');
    const questionsResponse = await axios.get(`${API_URL}/quiz/questions`);
    if (questionsResponse.data.success && questionsResponse.data.data.length > 0) {
      logSuccess(`Retrieved ${questionsResponse.data.data.length} quiz questions`);
    } else {
      throw new Error('Quiz question retrieval failed');
    }
    
    // Test submitting a quiz
    logInfo('Testing quiz submission...');
    const quizData = {
      category_id: categoriesResponse.data.data[0]._id,
      mode: 'practice',
      start_time: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      end_time: new Date().toISOString(),
      questions: [
        {
          question_id: questionsResponse.data.data[0]._id,
          user_answer: questionsResponse.data.data[0].options[0]._id,
          time_taken: 15
        },
        {
          question_id: questionsResponse.data.data[1]._id,
          user_answer: questionsResponse.data.data[1].options[0]._id,
          time_taken: 20
        }
      ]
    };
    
    const quizSubmitResponse = await axios.post(`${API_URL}/quiz/submit`, quizData);
    if (quizSubmitResponse.data.success) {
      logSuccess('Quiz submission successful');
      if (quizSubmitResponse.data.data.eloUpdate) {
        logSuccess(`ELO update: ${quizSubmitResponse.data.data.eloUpdate.oldScore} → ${quizSubmitResponse.data.data.eloUpdate.newScore} (${quizSubmitResponse.data.data.eloUpdate.change > 0 ? '+' : ''}${quizSubmitResponse.data.data.eloUpdate.change})`);
        logSuccess(`Current level: ${quizSubmitResponse.data.data.eloUpdate.level}`);
      }
    } else {
      throw new Error('Quiz submission failed');
    }
    
    // Test getting user progress
    logInfo('Testing user progress retrieval...');
    const progressResponse = await axios.get(`${API_URL}/progress`);
    if (progressResponse.data.success) {
      logSuccess(`Retrieved user progress data`);
    } else {
      throw new Error('User progress retrieval failed');
    }
    
    // Test getting ELO levels
    logInfo('Testing ELO levels retrieval...');
    const levelsResponse = await axios.get(`${API_URL}/elo/levels`);
    if (levelsResponse.data.success && levelsResponse.data.data.length > 0) {
      logSuccess(`Retrieved ${levelsResponse.data.data.length} ELO levels`);
    } else {
      throw new Error('ELO levels retrieval failed');
    }
    
    logSuccess('All API tests passed successfully!');
  } catch (error) {
    logError(error);
    if (error.response) {
      logError(`Status: ${error.response.status}`);
      logError(`Data: ${JSON.stringify(error.response.data)}`);
    }
  }
}

// Main test function
async function runTests() {
  try {
    await initializeTestData();
    await runApiTests();
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

// Run tests
runTests();
