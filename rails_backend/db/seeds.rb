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
  EloLevel.find_or_create_by!(name: level_data[:name]) do |level|
    level.min_score = level_data[:min_score]
    level.max_score = level_data[:max_score]
    level.description = level_data[:description]
  end
end

# Create AI categories
categories = [
  { name: "AI Fundamentals", description: "Core concepts of artificial intelligence and machine learning" },
  { name: "Large Language Models", description: "Understanding transformer architecture and LLM capabilities" },
  { name: "AI Agents", description: "Autonomous systems that can perceive, decide, and act" },
  { name: "Tech CTO Skills", description: "Leadership and technical skills for AI startup CTOs" }
]

categories.each do |category_data|
  Category.find_or_create_by!(name: category_data[:name]) do |category|
    category.description = category_data[:description]
  end
end

# Create sample flashcards and quiz questions for each category
ai_fundamentals = Category.find_by(name: "AI Fundamentals")
llm_category = Category.find_by(name: "Large Language Models")
agents_category = Category.find_by(name: "AI Agents")
cto_category = Category.find_by(name: "Tech CTO Skills")

# Sample flashcards for AI Fundamentals
Flashcard.find_or_create_by!(
  question: "What is the difference between supervised and unsupervised learning?",
  category: ai_fundamentals
) do |flashcard|
  flashcard.answer = "Supervised learning uses labeled data with known outputs, while unsupervised learning works with unlabeled data to find patterns."
  flashcard.explanation = "In supervised learning, the algorithm learns from labeled training data to make predictions or decisions. Unsupervised learning identifies patterns in unlabeled data without predefined outputs."
end

# Sample quiz questions for AI Fundamentals
QuizQuestion.find_or_create_by!(
  question: "Which of the following is NOT a type of neural network?",
  category: ai_fundamentals
) do |quiz|
  quiz.option_a = "Convolutional Neural Network (CNN)"
  quiz.option_b = "Recurrent Neural Network (RNN)"
  quiz.option_c = "Quantum Neural Network (QNN)"
  quiz.option_d = "Algorithmic Regression Network (ARN)"
  quiz.correct_option = "d"
  quiz.difficulty = 3
end

QuizQuestion.create!(
  category: ai_fundamentals,
  question: "What is the primary purpose of a loss function in machine learning?",
  option_a: "To measure how well the model's predictions match the actual data",
  option_b: "To determine the learning rate of the model",
  option_c: "To select the best features for the model",
  option_d: "To initialize the model's parameters",
  correct_option: "a",
  difficulty: 2
)

QuizQuestion.create!(
  category: ai_fundamentals,
  question: "Which of these is a key advantage of deep learning over traditional machine learning?",
  option_a: "Requires less data",
  option_b: "Automatically learns feature hierarchies",
  option_c: "Faster training time",
  option_d: "Works better with structured data",
  correct_option: "b",
  difficulty: 3
)

# Sample flashcards for LLMs
Flashcard.create!(
  category: llm_category,
  question: "What is the key innovation in transformer architecture?",
  answer: "Self-attention mechanism",
  explanation: "The self-attention mechanism allows transformers to weigh the importance of different words in a sequence relative to each other, enabling parallel processing and better handling of long-range dependencies."
)

# Sample quiz questions for LLMs
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

QuizQuestion.create!(
  category: llm_category,
  question: "What is the purpose of the attention mechanism in transformers?",
  option_a: "To reduce model size",
  option_b: "To focus on relevant parts of the input sequence",
  option_c: "To speed up training",
  option_d: "To handle different languages",
  correct_option: "b",
  difficulty: 3
)

QuizQuestion.create!(
  category: llm_category,
  question: "Which of these is NOT a common application of LLMs?",
  option_a: "Text generation",
  option_b: "Image classification",
  option_c: "Question answering",
  option_d: "Code completion",
  correct_option: "b",
  difficulty: 2
)

# Sample flashcards for AI Agents
Flashcard.create!(
  category: agents_category,
  question: "What are the three key components of an AI agent?",
  answer: "Perception, decision-making, and action",
  explanation: "AI agents perceive their environment through sensors, make decisions based on their goals and knowledge, and then take actions that affect their environment."
)

# Sample quiz questions for AI Agents
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

QuizQuestion.create!(
  category: agents_category,
  question: "What is the main challenge in multi-agent systems?",
  option_a: "Communication overhead",
  option_b: "Coordination and cooperation",
  option_c: "Individual agent performance",
  option_d: "Resource allocation",
  correct_option: "b",
  difficulty: 3
)

QuizQuestion.create!(
  category: agents_category,
  question: "Which of these is NOT a typical component of an AI agent's architecture?",
  option_a: "Knowledge base",
  option_b: "Learning algorithm",
  option_c: "Memory module",
  option_d: "Data pipeline",
  correct_option: "d",
  difficulty: 2
)

# Sample flashcards for CTO Skills
Flashcard.create!(
  category: cto_category,
  question: "What is MLOps?",
  answer: "MLOps is the practice of applying DevOps principles to machine learning systems.",
  explanation: "MLOps combines machine learning, DevOps, and data engineering to deploy and maintain ML models in production reliably and efficiently."
)

# Sample quiz questions for CTO Skills
QuizQuestion.create!(
  category: cto_category,
  question: "What is the most important skill for an AI CTO?",
  option_a: "Deep technical expertise in all AI domains",
  option_b: "Ability to communicate complex concepts to stakeholders",
  option_c: "Experience with all programming languages",
  option_d: "Knowledge of every AI framework",
  correct_option: "b",
  difficulty: 3
)

QuizQuestion.create!(
  category: cto_category,
  question: "Which of these is NOT a key responsibility of an AI CTO?",
  option_a: "Setting technical vision and strategy",
  option_b: "Managing day-to-day coding tasks",
  option_c: "Building and leading technical teams",
  option_d: "Ensuring AI ethics and compliance",
  correct_option: "b",
  difficulty: 2
)

QuizQuestion.create!(
  category: cto_category,
  question: "What is the primary goal of technical debt management for an AI CTO?",
  option_a: "Eliminate all technical debt",
  option_b: "Balance innovation with maintainability",
  option_c: "Maximize short-term development speed",
  option_d: "Minimize code documentation",
  correct_option: "b",
  difficulty: 3
)

# Create sample quiz questions
QuizQuestion.create!([
  {
    question: "What is the capital of France?",
    option_a: "London",
    option_b: "Berlin",
    option_c: "Paris",
    option_d: "Madrid",
    correct_option: "c",
    explanation: "Paris is the capital and most populous city of France. It is known as the 'City of Light' and is famous for its landmarks like the Eiffel Tower and the Louvre Museum.",
    difficulty: 1,
    category_id: 1
  },
  {
    question: "Which planet is known as the Red Planet?",
    option_a: "Venus",
    option_b: "Mars",
    option_c: "Jupiter",
    option_d: "Saturn",
    correct_option: "b",
    explanation: "Mars is often called the 'Red Planet' due to its reddish appearance, which is caused by iron oxide (rust) on its surface. It's the fourth planet from the Sun and has been a target for space exploration.",
    difficulty: 2,
    category_id: 2
  },
  {
    question: "What is the chemical symbol for gold?",
    option_a: "Ag",
    option_b: "Fe",
    option_c: "Au",
    option_d: "Cu",
    correct_option: "c",
    explanation: "The chemical symbol for gold is 'Au', derived from the Latin word 'aurum'. Gold is a precious metal that has been used for coinage, jewelry, and other arts throughout recorded history.",
    difficulty: 3,
    category_id: 3
  }
])

# Create admin user if it doesn't exist
if User.find_by(username: 'admin').nil?
  puts "Creating admin user..."
  admin = User.create!(
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    password_confirmation: 'Admin123!',
    role: 'admin',
    email_verified: true,
    full_name: 'Admin User'
  )
  puts "Admin user created with ID: #{admin.id}"
else
  puts "Admin user already exists"
end

# Create regular user if it doesn't exist
if User.find_by(username: 'user').nil?
  puts "Creating regular user..."
  user = User.create!(
    username: 'user',
    email: 'user@example.com',
    password: 'User123!',
    password_confirmation: 'User123!',
    role: 'user',
    email_verified: true,
    full_name: 'Regular User'
  )
  puts "Regular user created with ID: #{user.id}"
else
  puts "Regular user already exists"
end

puts "Seed completed successfully!"
