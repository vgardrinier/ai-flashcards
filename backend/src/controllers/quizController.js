const QuizQuestion = require('../models/quizQuestionModel');
const Category = require('../models/categoryModel');
const QuizSession = require('../models/quizSessionModel');
const ELOScore = require('../models/eloScoreModel');
const ELOLevel = require('../models/eloLevelModel');
const { calculateQuizEloChange, getEloLevel } = require('../utils/eloUtils');

// Get quiz questions
exports.getQuizQuestions = async (req, res) => {
  try {
    const { category, difficulty, limit = 10, tags } = req.query;
    
    // Build query
    const query = {};
    if (category) query.category_id = category;
    if (difficulty) query.difficulty = parseInt(difficulty);
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    // Get random questions based on query
    const questions = await QuizQuestion.aggregate([
      { $match: query },
      { $sample: { size: parseInt(limit) } },
      { $project: {
        'options.is_correct': 0 // Remove correct answer flags for client
      }}
    ]);
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz questions'
    });
  }
};

// Get quiz question by ID
exports.getQuizQuestionById = async (req, res) => {
  try {
    const question = await QuizQuestion.findById(req.params.id)
      .populate('category_id', 'name')
      .populate('related_flashcard_id');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Quiz question not found'
      });
    }
    
    // Remove correct answer flags for client
    const sanitizedQuestion = question.toObject();
    sanitizedQuestion.options = sanitizedQuestion.options.map(option => ({
      _id: option._id,
      text: option.text
    }));
    
    res.status(200).json({
      success: true,
      data: sanitizedQuestion
    });
  } catch (error) {
    console.error('Get quiz question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz question'
    });
  }
};

// Create new quiz question
exports.createQuizQuestion = async (req, res) => {
  try {
    const { 
      question, 
      options, 
      explanation, 
      category_id, 
      subcategory_id, 
      difficulty, 
      tags, 
      related_flashcard_id 
    } = req.body;
    
    // Validate category exists
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }
    
    // Validate options (at least one correct answer)
    if (!options || !options.length || !options.some(opt => opt.is_correct)) {
      return res.status(400).json({
        success: false,
        message: 'Quiz question must have at least one correct answer'
      });
    }
    
    // Create new quiz question
    const quizQuestion = new QuizQuestion({
      question,
      options,
      explanation,
      category_id,
      subcategory_id,
      difficulty: difficulty || 3,
      tags: tags || [],
      related_flashcard_id
    });
    
    await quizQuestion.save();
    
    res.status(201).json({
      success: true,
      data: quizQuestion
    });
  } catch (error) {
    console.error('Create quiz question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating quiz question'
    });
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    const { 
      category_id, 
      mode, 
      questions, 
      start_time, 
      end_time 
    } = req.body;
    
    const user_id = req.user.id;
    
    // Validate questions format
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quiz submission format'
      });
    }
    
    // Create quiz session
    const quizSession = new QuizSession({
      user_id,
      category_id,
      mode,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      questions: [],
      total_questions: questions.length,
      correct_answers: 0
    });
    
    // Process each question
    const questionIds = questions.map(q => q.question_id);
    const quizQuestions = await QuizQuestion.find({ _id: { $in: questionIds } });
    
    // Map questions by ID for easier lookup
    const questionMap = {};
    quizQuestions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });
    
    // Process answers and calculate score
    let correctCount = 0;
    const processedQuestions = [];
    
    for (const answer of questions) {
      const question = questionMap[answer.question_id];
      
      if (!question) {
        continue; // Skip if question not found
      }
      
      // Find if answer is correct
      const correctOption = question.options.find(opt => opt.is_correct);
      const isCorrect = correctOption && answer.user_answer === correctOption._id.toString();
      
      if (isCorrect) {
        correctCount++;
      }
      
      processedQuestions.push({
        question_id: answer.question_id,
        user_answer: answer.user_answer,
        is_correct: isCorrect,
        time_taken: answer.time_taken || 0,
        difficulty: question.difficulty
      });
    }
    
    // Calculate score percentage
    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    
    // Update quiz session
    quizSession.questions = processedQuestions;
    quizSession.correct_answers = correctCount;
    quizSession.score = scorePercentage;
    
    await quizSession.save();
    
    // Update ELO score if category specified
    let eloUpdate = null;
    if (category_id) {
      // Get current ELO score or create new one
      let eloScore = await ELOScore.findOne({ user_id, category_id });
      
      if (!eloScore) {
        // Initialize with default score
        eloScore = new ELOScore({
          user_id,
          category_id,
          score: 1000,
          level_name: 'AI Apprentice',
          history: []
        });
      }
      
      // Calculate ELO change based on quiz performance
      const { newElo, eloChange } = calculateQuizEloChange(
        eloScore.score,
        processedQuestions.map(q => ({
          difficulty: q.difficulty,
          isCorrect: q.is_correct
        }))
      );
      
      // Get all ELO levels
      const eloLevels = await ELOLevel.find().sort({ min_score: 1 });
      
      // Determine level based on new score
      const newLevel = getEloLevel(newElo, eloLevels);
      
      // Update ELO score
      eloScore.score = newElo;
      eloScore.level_name = newLevel.name;
      eloScore.updated_at = new Date();
      eloScore.history.push({
        date: new Date(),
        score: newElo,
        change: eloChange,
        quiz_session_id: quizSession._id
      });
      
      await eloScore.save();
      
      eloUpdate = {
        oldScore: eloScore.score - eloChange,
        newScore: eloScore.score,
        change: eloChange,
        level: newLevel.name
      };
    }
    
    res.status(200).json({
      success: true,
      data: {
        quizSession: {
          id: quizSession._id,
          score: quizSession.score,
          correctAnswers: quizSession.correct_answers,
          totalQuestions: quizSession.total_questions
        },
        eloUpdate
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting quiz'
    });
  }
};

// Get quiz history for user
exports.getQuizHistory = async (req, res) => {
  try {
    const { limit = 10, skip = 0, category } = req.query;
    const user_id = req.user.id;
    
    // Build query
    const query = { user_id };
    if (category) query.category_id = category;
    
    const quizSessions = await QuizSession.find(query)
      .sort({ start_time: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('category_id', 'name');
    
    const total = await QuizSession.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: quizSessions.length,
      total,
      data: quizSessions
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz history'
    });
  }
};
