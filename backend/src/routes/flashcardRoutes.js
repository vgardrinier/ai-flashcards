const express = require('express');
const router = express.Router();
const { 
  getAllFlashcards,
  getFlashcardById,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcardsByCategory
} = require('../controllers/flashcardController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllFlashcards);
router.get('/:id', getFlashcardById);
router.get('/category/:categoryId', getFlashcardsByCategory);

// Protected admin routes
router.post('/', protect, admin, createFlashcard);
router.put('/:id', protect, admin, updateFlashcard);
router.delete('/:id', protect, admin, deleteFlashcard);

module.exports = router;
