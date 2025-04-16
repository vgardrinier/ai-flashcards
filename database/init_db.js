// MongoDB initialization script for AI Flashcards application

// Create database
use ai_flashcards;

// Create collections
db.createCollection("users");
db.createCollection("categories");
db.createCollection("flashcards");
db.createCollection("quizQuestions");
db.createCollection("userProgress");
db.createCollection("quizSessions");
db.createCollection("eloScores");
db.createCollection("eloLevels");

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.categories.createIndex({ "name": 1 });
db.flashcards.createIndex({ "tags": 1 });
db.userProgress.createIndex({ "user_id": 1, "flashcard_id": 1 });
db.eloScores.createIndex({ "user_id": 1, "category_id": 1 });
db.quizSessions.createIndex({ "user_id": 1, "start_time": 1 });

// Insert ELO level tiers
db.eloLevels.insertMany([
  {
    "min_score": 0,
    "max_score": 999,
    "name": "Novice Explorer",
    "description": "Beginning the AI journey with foundational knowledge",
    "badge_icon": "novice_badge.png"
  },
  {
    "min_score": 1000,
    "max_score": 1199,
    "name": "AI Apprentice",
    "description": "Building core understanding of AI concepts",
    "badge_icon": "apprentice_badge.png"
  },
  {
    "min_score": 1200,
    "max_score": 1399,
    "name": "ML Practitioner",
    "description": "Applying machine learning principles effectively",
    "badge_icon": "practitioner_badge.png"
  },
  {
    "min_score": 1400,
    "max_score": 1599,
    "name": "Neural Navigator",
    "description": "Navigating complex neural network architectures",
    "badge_icon": "navigator_badge.png"
  },
  {
    "min_score": 1600,
    "max_score": 1799,
    "name": "LLM Specialist",
    "description": "Mastering large language model concepts and applications",
    "badge_icon": "llm_specialist_badge.png"
  },
  {
    "min_score": 1800,
    "max_score": 1999,
    "name": "Agent Architect",
    "description": "Designing sophisticated AI agent systems",
    "badge_icon": "agent_architect_badge.png"
  },
  {
    "min_score": 2000,
    "max_score": 2199,
    "name": "AI Strategy Director",
    "description": "Developing strategic AI implementation plans",
    "badge_icon": "strategy_director_badge.png"
  },
  {
    "min_score": 2200,
    "max_score": 2399,
    "name": "Technical Visionary",
    "description": "Creating forward-thinking AI technical roadmaps",
    "badge_icon": "visionary_badge.png"
  },
  {
    "min_score": 2400,
    "max_score": 2599,
    "name": "Innovation Leader",
    "description": "Leading breakthrough AI innovations",
    "badge_icon": "innovation_leader_badge.png"
  },
  {
    "min_score": 2600,
    "max_score": 2799,
    "name": "Startup CTO Candidate",
    "description": "Demonstrating skills comparable to AI startup CTOs",
    "badge_icon": "cto_candidate_badge.png"
  },
  {
    "min_score": 2800,
    "max_score": 2999,
    "name": "Elite AI Executive",
    "description": "Exhibiting exceptional AI leadership capabilities",
    "badge_icon": "elite_executive_badge.png"
  },
  {
    "min_score": 3000,
    "max_score": 9999,
    "name": "Tier-1 AI CTO",
    "description": "Achieving mastery equivalent to top AI startup CTOs",
    "badge_icon": "tier1_cto_badge.png"
  }
]);

// Insert main categories
db.categories.insertMany([
  {
    "name": "AI Fundamentals",
    "description": "Core concepts and principles of artificial intelligence",
    "icon": "ai_fundamentals.png",
    "order": 1
  },
  {
    "name": "Large Language Models",
    "description": "Concepts, architecture, and applications of LLMs",
    "icon": "llm.png",
    "order": 2
  },
  {
    "name": "AI Agents",
    "description": "Autonomous AI systems, planning, and decision-making",
    "icon": "ai_agents.png",
    "order": 3
  },
  {
    "name": "Tech CTO Skills",
    "description": "Leadership, technical, and strategic skills for AI CTOs",
    "icon": "cto_skills.png",
    "order": 4
  }
]);
