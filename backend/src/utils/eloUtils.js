// ELO scoring system implementation for AI flashcards application
const mongoose = require('mongoose');

// ELO level definitions with named tiers
const eloLevels = [
  {
    name: "Novice Explorer",
    min_score: 0,
    max_score: 999,
    description: "Just beginning your AI journey. Focus on understanding fundamental concepts."
  },
  {
    name: "AI Apprentice",
    min_score: 1000,
    max_score: 1199,
    description: "Grasping basic AI concepts. Building a foundation of knowledge."
  },
  {
    name: "ML Practitioner",
    min_score: 1200,
    max_score: 1399,
    description: "Developing practical understanding of machine learning concepts and applications."
  },
  {
    name: "Deep Learning Enthusiast",
    min_score: 1400,
    max_score: 1599,
    description: "Advancing your knowledge of neural networks and deep learning architectures."
  },
  {
    name: "NLP Specialist",
    min_score: 1600,
    max_score: 1799,
    description: "Mastering language model concepts and applications."
  },
  {
    name: "AI Systems Architect",
    min_score: 1800,
    max_score: 1999,
    description: "Developing expertise in designing and implementing AI systems."
  },
  {
    name: "Agent Engineer",
    min_score: 2000,
    max_score: 2199,
    description: "Building advanced knowledge of AI agents and autonomous systems."
  },
  {
    name: "Technical AI Leader",
    min_score: 2200,
    max_score: 2399,
    description: "Combining technical expertise with leadership capabilities."
  },
  {
    name: "AI Startup Strategist",
    min_score: 2400,
    max_score: 2599,
    description: "Developing the strategic vision needed for AI startup success."
  },
  {
    name: "AI Innovation Director",
    min_score: 2600,
    max_score: 2799,
    description: "Leading AI innovation and driving technological advancement."
  },
  {
    name: "Senior AI Executive",
    min_score: 2800,
    max_score: 2999,
    description: "Mastering the executive skills needed to lead AI initiatives at scale."
  },
  {
    name: "Tier-1 AI CTO",
    min_score: 3000,
    max_score: Infinity,
    description: "Achieved mastery across AI technology, leadership, and strategy. Ready to lead a top AI startup."
  }
];

/**
 * Calculate ELO score change based on quiz performance
 * 
 * @param {Number} currentElo - Current ELO score
 * @param {Array} questions - Array of question objects with difficulty and isCorrect properties
 * @returns {Object} Object containing new ELO score and change amount
 */
const calculateQuizEloChange = (currentElo, questions) => {
  if (!questions || questions.length === 0) {
    return { newElo: currentElo, eloChange: 0 };
  }
  
  // Base K-factor (determines maximum possible change)
  // Higher K-factor means more volatile ratings
  let kFactor = 32;
  
  // Adjust K-factor based on current ELO
  // Lower K-factor for higher-rated users (more stable ratings)
  if (currentElo >= 2000) {
    kFactor = 24;
  }
  if (currentElo >= 2400) {
    kFactor = 16;
  }
  
  let totalEloChange = 0;
  
  // Process each question
  questions.forEach(question => {
    // Expected score based on question difficulty
    // Convert difficulty (1-5) to ELO equivalent (1000-2000)
    const questionElo = 1000 + (question.difficulty - 1) * 250;
    
    // Calculate expected score using ELO formula
    const expectedScore = 1 / (1 + Math.pow(10, (questionElo - currentElo) / 400));
    
    // Actual score (1 for correct, 0 for incorrect)
    const actualScore = question.isCorrect ? 1 : 0;
    
    // Calculate ELO change for this question
    // Adjust by difficulty - harder questions have more impact
    const difficultyMultiplier = 0.5 + (question.difficulty / 10);
    const questionEloChange = kFactor * difficultyMultiplier * (actualScore - expectedScore);
    
    totalEloChange += questionEloChange;
  });
  
  // Average the change across all questions and round to nearest integer
  const avgEloChange = Math.round(totalEloChange / questions.length);
  
  // Calculate new ELO score
  const newElo = Math.max(0, currentElo + avgEloChange);
  
  return {
    newElo,
    eloChange: avgEloChange
  };
};

/**
 * Get ELO level based on score
 * 
 * @param {Number} score - Current ELO score
 * @param {Array} levels - Array of level objects with min_score, max_score, and name properties
 * @returns {Object} Level object containing name, min_score, max_score, and description
 */
const getEloLevel = (score, levels = eloLevels) => {
  // Find the appropriate level for the score
  const level = levels.find(level => 
    score >= level.min_score && score <= level.max_score
  );
  
  // Default to first level if no match found
  return level || levels[0];
};

/**
 * Calculate progress percentage within current level
 * 
 * @param {Number} score - Current ELO score
 * @param {Object} level - Current level object
 * @returns {Number} Percentage progress within current level (0-100)
 */
const calculateLevelProgress = (score, level) => {
  // If at max level, return 100%
  if (level.max_score === Infinity) {
    // For the highest tier, consider anything above min_score + 500 as 100%
    const effectiveMax = level.min_score + 500;
    if (score >= effectiveMax) {
      return 100;
    }
    return Math.min(100, Math.round(((score - level.min_score) / 500) * 100));
  }
  
  // Calculate percentage within level range
  const levelRange = level.max_score - level.min_score;
  const scoreWithinLevel = score - level.min_score;
  
  return Math.min(100, Math.round((scoreWithinLevel / levelRange) * 100));
};

/**
 * Calculate points needed to reach next level
 * 
 * @param {Number} score - Current ELO score
 * @param {Object} level - Current level object
 * @returns {Number} Points needed to reach next level
 */
const pointsToNextLevel = (score, level) => {
  // If at max level, return 0
  if (level.max_score === Infinity) {
    return 0;
  }
  
  return level.max_score + 1 - score;
};

/**
 * Initialize ELO levels in database
 * 
 * @param {Object} EloLevelModel - Mongoose model for ELO levels
 * @returns {Promise} Promise resolving to array of created level documents
 */
const initializeEloLevels = async (EloLevelModel) => {
  try {
    // Check if levels already exist
    const existingCount = await EloLevelModel.countDocuments();
    
    if (existingCount > 0) {
      console.log('ELO levels already initialized');
      return;
    }
    
    // Create levels in database
    const createdLevels = await EloLevelModel.insertMany(eloLevels);
    console.log(`Initialized ${createdLevels.length} ELO levels`);
    return createdLevels;
  } catch (error) {
    console.error('Error initializing ELO levels:', error);
    throw error;
  }
};

module.exports = {
  eloLevels,
  calculateQuizEloChange,
  getEloLevel,
  calculateLevelProgress,
  pointsToNextLevel,
  initializeEloLevels
};
