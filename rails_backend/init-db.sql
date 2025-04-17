-- Initialize database with ELO levels
CREATE TABLE IF NOT EXISTS elo_levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  description TEXT
);

-- Insert the 12 named ELO levels
INSERT INTO elo_levels (name, min_score, max_score, description) VALUES
  ('Novice Explorer', 0, 999, 'Beginning your journey into AI concepts'),
  ('AI Apprentice', 1000, 1249, 'Learning the fundamentals of AI and machine learning'),
  ('Algorithm Adept', 1250, 1499, 'Mastering basic algorithms and neural networks'),
  ('Data Disciple', 1500, 1749, 'Developing expertise in data processing and analysis'),
  ('ML Engineer', 1750, 1999, 'Building and optimizing machine learning models'),
  ('LLM Specialist', 2000, 2149, 'Understanding the intricacies of large language models'),
  ('AI Architect', 2150, 2299, 'Designing complex AI systems and infrastructures'),
  ('Agent Master', 2300, 2449, 'Creating and orchestrating autonomous AI agents'),
  ('Tech Lead', 2450, 2599, 'Leading technical teams and AI initiatives'),
  ('AI Strategist', 2600, 2749, 'Developing AI strategies for business growth'),
  ('Innovation Director', 2750, 2999, 'Directing cutting-edge AI innovation'),
  ('Tier-1 AI CTO', 3000, 9999, 'Achieved mastery of AI concepts at the CTO level');
