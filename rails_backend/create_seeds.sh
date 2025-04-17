#!/bin/bash

# Create seed file for ELO levels
cat > /home/ubuntu/ai_flashcards/rails_backend/db/seeds.rb << 'EOL'
# Create the 12 named ELO levels
levels = [
  { name: "Novice Explorer", min_score: 0, max_score: 999, description: "Beginning your journey into AI concepts" },
  { name: "AI Apprentice", min_score: 1000, max_score: 1249, description: "Learning the fundamentals of AI and machine learning" },
  { name: "Algorithm Adept", min_score: 1250, max_score: 1499, description: "Mastering basic algorithms and neural networks" },
  { name: "Data Disciple", min_score: 1500, max_score: 1749, description: "Developing expertise in data processing and analysis" },
  { name: "ML Engineer", min_score: 1750, max_score: 1999, description: "Building and optimizing machine learning models" },
  { name: "LLM Specialist", min_score: 2000, max_score: 2149, description: "Understanding the intricacies of large language models" },
  { name: "AI Architect", min_score: 2150, max_score: 2299, description: "Designing complex AI systems and infrastructures" },
  { name: "Agent Master", min_score: 2300, max_score: 2449, description: "Creating and orchestrating autonomous AI agents" },
  { name: "Tech Lead", min_score: 2450, max_score: 2599, description: "Leading technical teams and AI initiatives" },
  { name: "AI Strategist", min_score: 2600, max_score: 2749, description: "Developing AI strategies for business growth" },
  { name: "Innovation Director", min_score: 2750, max_score: 2999, description: "Directing cutting-edge AI innovation" },
  { name: "Tier-1 AI CTO", min_score: 3000, max_score: 9999, description: "Achieved mastery of AI concepts at the CTO level" }
]

levels.each do |level_data|
  EloLevel.create!(level_data)
end

# Create AI categories
categories = [
  { name: "AI Fundamentals", description: "Core concepts of artificial intelligence and machine learning" },
  { name: "Large Language Models", description: "Understanding transformer architecture and LLM capabilities" },
  { name: "AI Agents", description: "Autonomous systems that can perceive, decide, and act" },
  { name: "Tech CTO Skills", description: "Leadership and technical skills for AI startup CTOs" }
]

categories.each do |category_data|
  Category.create!(category_data)
end

# Create sample flashcards and quiz questions for each category
ai_fundamentals = Category.find_by(name: "AI Fundamentals")
llm_category = Category.find_by(name: "Large Language Models")
agents_category = Category.find_by(name: "AI Agents")
cto_category = Category.find_by(name: "Tech CTO Skills")

# Sample flashcards for AI Fundamentals
Flashcard.create!(
  category: ai_fundamentals,
  question: "What is the difference between supervised and unsupervised learning?",
  answer: "Supervised learning uses labeled data with known outputs, while unsupervised learning works with unlabeled data to find patterns.",
  explanation: "In supervised learning, the algorithm learns from labeled training data to make predictions or decisions. Unsupervised learning identifies patterns in unlabeled data without predefined outputs."
)

# Sample quiz question for AI Fundamentals
QuizQuestion.create!(
  category: ai_fundamentals,
  question: "Which of the following is NOT a type of neural network?",
  option_a: "Convolutional Neural Network (CNN)",
  option_b: "Recurrent Neural Network (RNN)",
  option_c: "Quantum Neural Network (QNN)",
  option_d: "Algorithmic Regression Network (ARN)",
  correct_option: "d",
  difficulty: 3
)

# Sample flashcards for LLMs
Flashcard.create!(
  category: llm_category,
  question: "What is the key innovation in transformer architecture?",
  answer: "Self-attention mechanism",
  explanation: "The self-attention mechanism allows transformers to weigh the importance of different words in a sequence relative to each other, enabling parallel processing and better handling of long-range dependencies."
)

# Sample quiz question for LLMs
QuizQuestion.create!(
  category: llm_category,
  question: "Which technique is used to improve LLM performance on specific tasks after pre-training?",
  option_a: "Fine-tuning",
  option_b: "Tokenization",
  option_c: "Embedding",
  option_d: "Quantization",
  correct_option: "a",
  difficulty: 2
)

# Sample flashcards for AI Agents
Flashcard.create!(
  category: agents_category,
  question: "What are the three key components of an AI agent?",
  answer: "Perception, decision-making, and action",
  explanation: "AI agents perceive their environment through sensors, make decisions based on their goals and knowledge, and then take actions that affect their environment."
)

# Sample quiz question for AI Agents
QuizQuestion.create!(
  category: agents_category,
  question: "Which planning approach involves breaking down a problem into subproblems?",
  option_a: "Reactive planning",
  option_b: "Hierarchical planning",
  option_c: "Monte Carlo planning",
  option_d: "Greedy planning",
  correct_option: "b",
  difficulty: 4
)

# Sample flashcards for CTO Skills
Flashcard.create!(
  category: cto_category,
  question: "What is MLOps?",
  answer: "MLOps is the practice of applying DevOps principles to machine learning systems.",
  explanation: "MLOps combines machine learning, DevOps, and data engineering to deploy and maintain ML models in production reliably and efficiently."
)

# Sample quiz question for CTO Skills
QuizQuestion.create!(
  category: cto_category,
  question: "Which is NOT typically a responsibility of a CTO in an AI startup?",
  option_a: "Setting technical vision and strategy",
  option_b: "Managing day-to-day sales operations",
  option_c: "Evaluating new AI technologies",
  option_d: "Building and leading technical teams",
  correct_option: "b",
  difficulty: 2
)
EOL

echo "Seed file created successfully"
