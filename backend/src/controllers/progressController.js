const UserProgress = require('../models/userProgressModel');
const Flashcard = require('../models/flashcardModel');

// Get user progress for all flashcards
exports.getUserProgress = async (req, res) => {
  try {
    const { category, status, limit = 50, skip = 0 } = req.query;
    const user_id = req.user.id;
    
    // Build query
    const query = { user_id };
    if (category) {
      // Find flashcards in category first
      const flashcards = await Flashcard.find({ category_id: category }).select('_id');
      const flashcardIds = flashcards.map(f => f._id);
      query.flashcard_id = { $in: flashcardIds };
    }
    if (status) query.status = status;
    
    const progress = await UserProgress.find(query)
      .sort({ next_review: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate({
        path: 'flashcard_id',
        populate: {
          path: 'category_id',
          select: 'name'
        }
      });
    
    const total = await UserProgress.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: progress.length,
      total,
      data: progress
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user progress'
    });
  }
};

// Get user progress for a specific flashcard
exports.getFlashcardProgress = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const user_id = req.user.id;
    
    const progress = await UserProgress.findOne({
      user_id,
      flashcard_id: flashcardId
    });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found for this flashcard'
      });
    }
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get flashcard progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching flashcard progress'
    });
  }
};

// Update flashcard progress
exports.updateFlashcardProgress = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const { status, isCorrect } = req.body;
    const user_id = req.user.id;
    
    // Find existing progress or create new one
    let progress = await UserProgress.findOne({
      user_id,
      flashcard_id: flashcardId
    });
    
    if (!progress) {
      progress = new UserProgress({
        user_id,
        flashcard_id: flashcardId,
        status: 'new',
        times_reviewed: 0,
        times_correct: 0,
        times_incorrect: 0,
        last_reviewed: null,
        next_review: null,
        ease_factor: 2.5,
        interval: 0
      });
    }
    
    // Update progress
    if (status) progress.status = status;
    
    // Update review stats
    progress.times_reviewed += 1;
    progress.last_reviewed = new Date();
    
    if (isCorrect !== undefined) {
      if (isCorrect) {
        progress.times_correct += 1;
      } else {
        progress.times_incorrect += 1;
      }
      
      // Update spaced repetition parameters
      if (isCorrect) {
        // Increase ease factor if correct
        progress.ease_factor = Math.max(1.3, progress.ease_factor + 0.1);
        
        // Calculate next interval based on SM-2 algorithm
        if (progress.interval === 0) {
          progress.interval = 1; // First correct answer: 1 day
        } else if (progress.interval === 1) {
          progress.interval = 6; // Second correct answer: 6 days
        } else {
          // Subsequent correct answers: interval * ease factor
          progress.interval = Math.round(progress.interval * progress.ease_factor);
        }
        
        // Cap maximum interval at 365 days
        progress.interval = Math.min(progress.interval, 365);
        
        // Set next review date
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + progress.interval);
        progress.next_review = nextReview;
        
        // Update status based on interval
        if (progress.interval >= 30) {
          progress.status = 'mastered';
        } else if (progress.interval >= 7) {
          progress.status = 'reviewing';
        } else {
          progress.status = 'learning';
        }
      } else {
        // Decrease ease factor if incorrect
        progress.ease_factor = Math.max(1.3, progress.ease_factor - 0.2);
        
        // Reset interval to shorter time
        progress.interval = Math.max(1, Math.floor(progress.interval * 0.5));
        
        // Set next review date
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + progress.interval);
        progress.next_review = nextReview;
        
        // Update status
        progress.status = 'learning';
      }
    }
    
    await progress.save();
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Update flashcard progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating flashcard progress'
    });
  }
};

// Get due flashcards for review
exports.getDueFlashcards = async (req, res) => {
  try {
    const { limit = 20, category } = req.query;
    const user_id = req.user.id;
    
    // Build query for due cards (next_review <= now or null)
    const query = {
      user_id,
      $or: [
        { next_review: { $lte: new Date() } },
        { next_review: null }
      ]
    };
    
    // Add category filter if specified
    if (category) {
      // Find flashcards in category first
      const flashcards = await Flashcard.find({ category_id: category }).select('_id');
      const flashcardIds = flashcards.map(f => f._id);
      query.flashcard_id = { $in: flashcardIds };
    }
    
    // Get due cards
    const dueProgress = await UserProgress.find(query)
      .sort({ next_review: 1, status: 1 })
      .limit(parseInt(limit))
      .populate('flashcard_id');
    
    // If not enough due cards, get new cards
    if (dueProgress.length < parseInt(limit)) {
      // Find all flashcard IDs the user has progress for
      const userProgressFlashcards = await UserProgress.find({ user_id })
        .select('flashcard_id');
      const reviewedFlashcardIds = userProgressFlashcards.map(p => p.flashcard_id);
      
      // Build query for new cards
      const newCardsQuery = {
        _id: { $nin: reviewedFlashcardIds }
      };
      
      if (category) {
        newCardsQuery.category_id = category;
      }
      
      // Get new cards
      const newFlashcards = await Flashcard.find(newCardsQuery)
        .limit(parseInt(limit) - dueProgress.length);
      
      // Combine due cards and new cards
      const dueFlashcards = dueProgress.map(p => p.flashcard_id);
      const allDueFlashcards = [...dueFlashcards, ...newFlashcards];
      
      res.status(200).json({
        success: true,
        count: allDueFlashcards.length,
        data: allDueFlashcards
      });
    } else {
      // Return just the due cards
      const dueFlashcards = dueProgress.map(p => p.flashcard_id);
      
      res.status(200).json({
        success: true,
        count: dueFlashcards.length,
        data: dueFlashcards
      });
    }
  } catch (error) {
    console.error('Get due flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching due flashcards'
    });
  }
};

// Get user study stats
exports.getStudyStats = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get counts by status
    const statusCounts = await UserProgress.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format status counts
    const formattedStatusCounts = {};
    statusCounts.forEach(item => {
      formattedStatusCounts[item._id] = item.count;
    });
    
    // Get total reviewed
    const totalReviewed = await UserProgress.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
      { $group: { _id: null, total: { $sum: '$times_reviewed' } } }
    ]);
    
    // Get correct percentage
    const correctStats = await UserProgress.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
      { 
        $group: { 
          _id: null, 
          totalCorrect: { $sum: '$times_correct' },
          totalIncorrect: { $sum: '$times_incorrect' }
        } 
      }
    ]);
    
    // Calculate correct percentage
    let correctPercentage = 0;
    if (correctStats.length > 0) {
      const total = correctStats[0].totalCorrect + correctStats[0].totalIncorrect;
      if (total > 0) {
        correctPercentage = Math.round((correctStats[0].totalCorrect / total) * 100);
      }
    }
    
    // Get category breakdown
    const categoryBreakdown = await UserProgress.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
      { 
        $lookup: {
          from: 'flashcards',
          localField: 'flashcard_id',
          foreignField: '_id',
          as: 'flashcard'
        }
      },
      { $unwind: '$flashcard' },
      {
        $group: {
          _id: '$flashcard.category_id',
          total: { $sum: 1 },
          mastered: { $sum: { $cond: [{ $eq: ['$status', 'mastered'] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          categoryId: '$_id',
          categoryName: '$category.name',
          total: 1,
          mastered: 1,
          masteredPercentage: { 
            $multiply: [{ $divide: ['$mastered', { $max: ['$total', 1] }] }, 100] 
          }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        statusCounts: formattedStatusCounts,
        totalReviewed: totalReviewed.length > 0 ? totalReviewed[0].total : 0,
        correctPercentage,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get study stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching study stats'
    });
  }
};
