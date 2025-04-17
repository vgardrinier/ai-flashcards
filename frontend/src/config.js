// Frontend configuration for connecting to the Rails backend
const config = {
  // API URL configuration
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1',
  
  // ELO level configuration
  eloLevels: [
    { name: "Novice Explorer", minScore: 0, maxScore: 999, color: "#6c757d", icon: "🔍" },
    { name: "AI Apprentice", minScore: 1000, maxScore: 1249, color: "#28a745", icon: "🌱" },
    { name: "Algorithm Adept", minScore: 1250, maxScore: 1499, color: "#17a2b8", icon: "🧮" },
    { name: "Data Disciple", minScore: 1500, maxScore: 1749, color: "#007bff", icon: "📊" },
    { name: "ML Engineer", minScore: 1750, maxScore: 1999, color: "#6610f2", icon: "⚙️" },
    { name: "LLM Specialist", minScore: 2000, maxScore: 2149, color: "#6f42c1", icon: "🔤" },
    { name: "AI Architect", minScore: 2150, maxScore: 2299, color: "#e83e8c", icon: "🏗️" },
    { name: "Agent Master", minScore: 2300, maxScore: 2449, color: "#fd7e14", icon: "🤖" },
    { name: "Tech Lead", minScore: 2450, maxScore: 2599, color: "#ffc107", icon: "👨‍💻" },
    { name: "AI Strategist", minScore: 2600, maxScore: 2749, color: "#20c997", icon: "🧠" },
    { name: "Innovation Director", minScore: 2750, maxScore: 2999, color: "#dc3545", icon: "💡" },
    { name: "Tier-1 AI CTO", minScore: 3000, maxScore: 9999, color: "#gold", icon: "👑" }
  ],
  
  // Quiz configuration
  quizSettings: {
    questionsPerSession: 10,
    timeLimit: 60, // seconds per question
    baseScoreCorrect: 25,
    baseScoreIncorrect: -15,
    difficultyMultiplier: true
  },
  
  // Flashcard review settings
  flashcardSettings: {
    initialInterval: 1, // days
    easyBonus: 1.3,
    hardPenalty: 0.8,
    minimumEaseFactor: 1.3
  }
};

export default config;
