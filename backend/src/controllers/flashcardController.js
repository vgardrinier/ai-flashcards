const Flashcard = require('../models/flashcardModel');
const Category = require('../models/categoryModel');

// Get all flashcards
exports.getAllFlashcards = async (req, res) => {
  try {
    const { category, difficulty, tags, limit = 50, skip = 0 } = req.query;
    
    // Build query
    const query = {};
    if (category) query.category_id = category;
    if (difficulty) query.difficulty = difficulty;
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    const flashcards = await Flashcard.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('category_id', 'name');
    
    const total = await Flashcard.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: flashcards.length,
      total,
      data: flashcards
    });
  } catch (error) {
    console.error('Get flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching flashcards'
    });
  }
};

// Get flashcard by ID
exports.getFlashcardById = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id)
      .populate('category_id', 'name')
      .populate('subcategory_id', 'name');
    
    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: flashcard
    });
  } catch (error) {
    console.error('Get flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching flashcard'
    });
  }
};

// Create new flashcard
exports.createFlashcard = async (req, res) => {
  try {
    const { 
      question, 
      answer, 
      explanation, 
      category_id, 
      subcategory_id, 
      difficulty, 
      tags, 
      source, 
      media 
    } = req.body;
    
    // Validate category exists
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }
    
    // Validate subcategory if provided
    if (subcategory_id) {
      const subcategory = await Category.findById(subcategory_id);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subcategory'
        });
      }
    }
    
    // Create new flashcard
    const flashcard = new Flashcard({
      question,
      answer,
      explanation,
      category_id,
      subcategory_id,
      difficulty: difficulty || 3,
      tags: tags || [],
      source,
      media
    });
    
    await flashcard.save();
    
    res.status(201).json({
      success: true,
      data: flashcard
    });
  } catch (error) {
    console.error('Create flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating flashcard'
    });
  }
};

// Update flashcard
exports.updateFlashcard = async (req, res) => {
  try {
    const { 
      question, 
      answer, 
      explanation, 
      category_id, 
      subcategory_id, 
      difficulty, 
      tags, 
      source, 
      media 
    } = req.body;
    
    // Find flashcard
    let flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }
    
    // Validate category if changing
    if (category_id && category_id !== flashcard.category_id.toString()) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
    }
    
    // Validate subcategory if changing
    if (subcategory_id && subcategory_id !== flashcard.subcategory_id?.toString()) {
      const subcategory = await Category.findById(subcategory_id);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subcategory'
        });
      }
    }
    
    // Update fields
    flashcard.question = question || flashcard.question;
    flashcard.answer = answer || flashcard.answer;
    flashcard.explanation = explanation || flashcard.explanation;
    flashcard.category_id = category_id || flashcard.category_id;
    flashcard.subcategory_id = subcategory_id !== undefined ? subcategory_id : flashcard.subcategory_id;
    flashcard.difficulty = difficulty || flashcard.difficulty;
    flashcard.tags = tags || flashcard.tags;
    flashcard.source = source || flashcard.source;
    flashcard.media = media || flashcard.media;
    
    await flashcard.save();
    
    res.status(200).json({
      success: true,
      data: flashcard
    });
  } catch (error) {
    console.error('Update flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating flashcard'
    });
  }
};

// Delete flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }
    
    await flashcard.remove();
    
    res.status(200).json({
      success: true,
      message: 'Flashcard deleted successfully'
    });
  } catch (error) {
    console.error('Delete flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting flashcard'
    });
  }
};

// Get flashcards by category
exports.getFlashcardsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    
    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const flashcards = await Flashcard.find({ category_id: categoryId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('category_id', 'name');
    
    const total = await Flashcard.countDocuments({ category_id: categoryId });
    
    res.status(200).json({
      success: true,
      count: flashcards.length,
      total,
      data: flashcards
    });
  } catch (error) {
    console.error('Get flashcards by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching flashcards by category'
    });
  }
};
