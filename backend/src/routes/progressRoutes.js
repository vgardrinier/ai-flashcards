const express = require('express');
const router = express.Router();
const { 
  getUserProgress,
  getFlashcardProgress,
  updateFlashcardProgress,
  getDueFlashcards,
  getStudyStats
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/', protect, getUserProgress);
router.get('/stats', protect, getStudyStats);
router.get('/due', protect, getDueFlashcards);
router.get('/flashcard/:flashcardId', protect, getFlashcardProgress);
router.put('/flashcard/:flashcardId', protect, updateFlashcardProgress);

module.exports = router;
