const express = require('express');
const router = express.Router();
const { 
  getQuizQuestions,
  getQuizQuestionById,
  createQuizQuestion,
  submitQuiz,
  getQuizHistory
} = require('../controllers/quizController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/questions', getQuizQuestions);
router.get('/questions/:id', getQuizQuestionById);

// Protected routes
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);

// Protected admin routes
router.post('/questions', protect, admin, createQuizQuestion);

module.exports = router;
