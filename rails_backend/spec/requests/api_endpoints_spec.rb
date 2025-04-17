require 'rails_helper'

RSpec.describe "API Endpoints", type: :request do
  describe "Database Seed" do
    it "creates initial ELO levels" do
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
      
      expect(EloLevel.count).to eq(12)
    end
  end
end
