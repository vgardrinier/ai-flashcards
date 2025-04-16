// Script to import flashcards and quiz questions into the database
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const Category = require('../models/categoryModel');
const Flashcard = require('../models/flashcardModel');
const QuizQuestion = require('../models/quizQuestionModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_flashcards')
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Create categories if they don't exist
      console.log('Creating categories...');
      const categories = [
        { name: 'AI Fundamentals', description: 'Core concepts of artificial intelligence and machine learning' },
        { name: 'Large Language Models', description: 'Understanding transformer models, attention mechanisms, and NLP' },
        { name: 'AI Agents', description: 'Autonomous systems, planning, and decision-making' },
        { name: 'Tech CTO Skills', description: 'Leadership, strategy, and technical skills for AI startup CTOs' }
      ];
      
      // Create category map for lookups
      const categoryMap = {};
      
      for (const category of categories) {
        const savedCategory = await Category.findOneAndUpdate(
          { name: category.name },
          category,
          { upsert: true, new: true }
        );
        categoryMap[category.name] = savedCategory._id;
        console.log(`Category created: ${category.name}`);
      }
      
      // Import flashcards
      console.log('Importing flashcards...');
      const flashcardsPath = path.join(__dirname, '..', '..', 'data', 'generated_flashcards.json');
      
      if (fs.existsSync(flashcardsPath)) {
        const flashcardsData = JSON.parse(fs.readFileSync(flashcardsPath, 'utf8'));
        
        let importedCount = 0;
        for (const flashcard of flashcardsData) {
          // Map category name to ID
          const categoryId = categoryMap[flashcard.category_id];
          
          if (!categoryId) {
            console.warn(`Category not found for flashcard: ${flashcard.question}`);
            continue;
          }
          
          // Check if flashcard already exists
          const existingFlashcard = await Flashcard.findOne({ question: flashcard.question });
          
          if (!existingFlashcard) {
            // Create new flashcard
            await Flashcard.create({
              ...flashcard,
              category_id: categoryId
            });
            importedCount++;
          }
        }
        
        console.log(`Imported ${importedCount} new flashcards`);
      } else {
        console.error('Flashcards data file not found');
      }
      
      // Import quiz questions
      console.log('Importing quiz questions...');
      const questionsPath = path.join(__dirname, '..', '..', 'data', 'generated_quiz_questions.json');
      
      if (fs.existsSync(questionsPath)) {
        const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
        
        let importedCount = 0;
        for (const question of questionsData) {
          // Map category name to ID
          const categoryId = categoryMap[question.category_id];
          
          if (!categoryId) {
            console.warn(`Category not found for question: ${question.question}`);
            continue;
          }
          
          // Check if question already exists
          const existingQuestion = await QuizQuestion.findOne({ question: question.question });
          
          if (!existingQuestion) {
            // Create new question
            await QuizQuestion.create({
              ...question,
              category_id: categoryId
            });
            importedCount++;
          }
        }
        
        console.log(`Imported ${importedCount} new quiz questions`);
      } else {
        console.error('Quiz questions data file not found');
      }
      
      console.log('Import completed successfully');
    } catch (error) {
      console.error('Error during import:', error);
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
