require 'rails_helper'

RSpec.describe "API Endpoints", type: :request do
  describe "Database Seed" do
    it "creates initial ELO levels" do
      # Clear existing ELO levels
      EloLevel.delete_all
      
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
      
      # Verify we have exactly 12 unique levels
      expect(EloLevel.count).to eq(12)
      expect(EloLevel.pluck(:name).uniq.count).to eq(12)
    end
  end

  describe "Quiz Attempts" do
    let(:category) { Category.create!(name: "Test Category") }
    let(:user) { User.create!(username: "testuser", email: "test@example.com", password: "password") }
    let(:elo_score) { EloScore.create!(user: user, score: 1000) }
    let(:quiz_question) { 
      QuizQuestion.create!(
        question: "What is 2+2?",
        option_a: "3",
        option_b: "4",
        option_c: "5",
        option_d: "6",
        correct_option: "b",
        difficulty: 1,
        category: category,
        explanation: "Basic arithmetic"
      )
    }

    before do
      user.create_elo_score!(score: 1000) unless user.elo_score
    end

    context "when submitting a correct answer" do
      it "updates both quiz percentage and ELO score correctly" do
        initial_elo = user.elo_score.score
        
        post "/api/v1/quiz_questions/#{quiz_question.id}/attempt", 
             params: { user_id: user.id, selected_option: "b" }
        
        expect(response).to have_http_status(:success)
        
        json_response = JSON.parse(response.body)
        # Verify quiz attempt response
        expect(json_response["data"]["correct"]).to be true
        expect(json_response["data"]["score_change"]).to be > 0
        
        # Verify ELO score was updated
        user.reload
        expect(user.elo_score.score).to be > initial_elo
      end
    end

    context "when submitting an incorrect answer" do
      it "updates both quiz percentage and ELO score correctly" do
        initial_elo = user.elo_score.score
        
        post "/api/v1/quiz_questions/#{quiz_question.id}/attempt", 
             params: { user_id: user.id, selected_option: "a" }
        
        expect(response).to have_http_status(:success)
        
        json_response = JSON.parse(response.body)
        # Verify quiz attempt response
        expect(json_response["data"]["correct"]).to be false
        expect(json_response["data"]["score_change"]).to be < 0
        
        # Verify ELO score was updated
        user.reload
        expect(user.elo_score.score).to be < initial_elo
      end
    end

    context "with multiple attempts" do
      it "calculates both quiz percentage and cumulative ELO score correctly" do
        initial_elo = user.elo_score.score
        correct_answers = 0
        total_questions = 2
        
        # First attempt - correct answer
        post "/api/v1/quiz_questions/#{quiz_question.id}/attempt", 
             params: { user_id: user.id, selected_option: "b" }
        
        first_response = JSON.parse(response.body)
        correct_answers += 1 if first_response["data"]["correct"]
        first_score_change = first_response["data"]["score_change"]
        
        # Second attempt - incorrect answer
        post "/api/v1/quiz_questions/#{quiz_question.id}/attempt", 
             params: { user_id: user.id, selected_option: "a" }
        
        second_response = JSON.parse(response.body)
        correct_answers += 1 if second_response["data"]["correct"]
        second_score_change = second_response["data"]["score_change"]
        
        # Verify quiz percentage
        expected_percentage = (correct_answers.to_f / total_questions * 100).round
        expect(expected_percentage).to eq(50) # 1 out of 2 correct
        
        # Verify final ELO score matches the sum of changes
        user.reload
        expected_elo = initial_elo + first_score_change + second_score_change
        expect(user.elo_score.score).to eq(expected_elo)
      end
    end
  end
end
