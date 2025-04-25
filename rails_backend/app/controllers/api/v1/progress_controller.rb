class Api::V1::ProgressController < ApplicationController
  # GET /api/v1/progress/:user_id
  def index
    user = User.find(params[:user_id])
    progress = user.user_progresses.includes(:flashcard)
    
    render json: progress, include: { flashcard: { include: :category } }
  end
  
  # POST /api/v1/progress
  def create
    progress = UserProgress.new(progress_params)
    
    if progress.save
      render json: progress, status: :created
    else
      render json: { errors: progress.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PUT /api/v1/progress/:id
  def update
    progress = UserProgress.find(params[:id])
    
    if progress.update(progress_params)
      render json: progress
    else
      render json: { errors: progress.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # GET /api/v1/progress/due/:user_id
  def due
    user = User.find(params[:user_id])
    due_cards = user.user_progresses
                    .where('next_review <= ?', Time.current)
                    .includes(:flashcard)
    
    render json: due_cards, include: { flashcard: { include: :category } }
  end
  
  # GET /api/v1/progress/stats/:user_id
  def stats
    Rails.logger.info("Stats endpoint called with user_id: #{params[:user_id]}")
    
    begin
      user = User.find(params[:user_id])
      Rails.logger.info("Found user: #{user.username}")
      
      # Total cards reviewed (sum of times_reviewed across all progress)
      cards_reviewed = user.user_progresses.sum(:times_reviewed)
      Rails.logger.info("Cards reviewed: #{cards_reviewed}")
      
      # Study streak (days in a row with activity)
      study_streak = calculate_study_streak(user)
      Rails.logger.info("Study streak: #{study_streak}")
      
      # Time spent (estimate based on quiz attempts and flashcard reviews)
      time_spent = calculate_time_spent(user)
      Rails.logger.info("Time spent: #{time_spent}")
      
      # Category breakdown with ELO scores
      categories = Category.all
      Rails.logger.info("Found #{categories.count} categories")
      
      category_scores = []
      
      categories.each do |category|
        # For now, we don't have category-specific ELO scores, so use overall ELO
        # In the future, we could track category-specific scores
        level = find_level_for_score(user.elo_score.score)
        
        category_scores << {
          category: category.name,
          score: user.elo_score.score,
          level: level
        }
      end
      
      # Quiz history
      quiz_history = []
      
      # Get unique quiz sessions
      sessions = QuizAttempt.unique_sessions_for_user(user.id).compact
      Rails.logger.info("Found #{sessions.count} quiz sessions")
      
      sessions.each do |session_id|
        next unless session_id.present?
        
        # Get attempts for this session
        attempts = user.quiz_attempts.where(quiz_session_id: session_id)
        next if attempts.empty?
        
        # Get the category from the first question
        category_name = attempts.first.quiz_question.category&.name || "Unknown"
        
        # Calculate score and totals
        correct_answers = attempts.where(correct: true).count
        total_questions = attempts.count
        score = (correct_answers.to_f / total_questions * 100).round
        
        quiz_history << {
          date: attempts.order(created_at: :desc).first.created_at,
          category: category_name,
          score: score,
          correctAnswers: correct_answers,
          totalQuestions: total_questions
        }
      end
      
      # Sort by date (newest first)
      quiz_history = quiz_history.sort_by { |q| q[:date] }.reverse
      
      response_data = {
        studyStreak: study_streak,
        cardsReviewed: cards_reviewed,
        timeSpent: time_spent,
        categoryScores: category_scores,
        quizHistory: quiz_history
      }
      
      Rails.logger.info("Response data: #{response_data.inspect}")
      
      render json: response_data
    rescue => e
      Rails.logger.error("Error in stats endpoint: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      render json: { error: e.message }, status: :internal_server_error
    end
  end
  
  private
  
  def progress_params
    params.require(:progress).permit(:user_id, :flashcard_id, :times_reviewed, :last_reviewed, :ease_factor, :next_review)
  end
  
  def calculate_study_streak(user)
    # Get all user activity dates (quiz attempts and flashcard reviews)
    activity_dates = []
    
    # Add quiz attempt dates
    user.quiz_attempts.select(:created_at).each do |attempt|
      activity_dates << attempt.created_at.to_date
    end
    
    # Add flashcard review dates
    user.user_progresses.select(:last_reviewed).each do |progress|
      activity_dates << progress.last_reviewed.to_date if progress.last_reviewed
    end
    
    # Sort and deduplicate dates
    activity_dates = activity_dates.uniq.sort.reverse
    
    # If no activity, return 0
    return 0 if activity_dates.empty?
    
    # Check for consecutive days
    streak = 1
    today = Date.today
    
    # Only count streak if there was activity today or yesterday
    return 0 if (today - activity_dates.first) > 1.day
    
    # Calculate streak
    activity_dates.each_with_index do |date, index|
      break if index == 0 # Skip the first date
      previous_date = activity_dates[index - 1]
      
      if (previous_date - date) == 1.day
        streak += 1
      else
        break
      end
    end
    
    streak
  end
  
  def calculate_time_spent(user)
    # Estimate time spent based on activity
    # Assume each quiz question takes 1 minute
    quiz_time = user.quiz_attempts.count
    
    # Assume each flashcard review takes 30 seconds
    flashcard_time = user.user_progresses.sum(:times_reviewed) * 0.5
    
    # Return total time in minutes
    (quiz_time + flashcard_time).round
  end
  
  def find_level_for_score(score)
    # Find the appropriate level for the given score
    level = EloLevel.where('min_score <= ? AND max_score >= ?', score, score).first
    
    # Return a hash with camelCase keys for the frontend
    # Note: We use a default icon since the EloLevel model doesn't have an icon column
    return {
      name: level&.name || "Unknown",
      minScore: level&.min_score || 0,
      maxScore: level&.max_score || 0,
      description: level&.description || "",
      badgeIcon: get_icon_for_level(level&.name) || "default_badge.png"
    }
  end
  
  # Helper method to return an appropriate icon name based on level name
  def get_icon_for_level(level_name)
    case level_name
    when "Novice Explorer"
      "novice_explorer.png"
    when "AI Apprentice"
      "ai_apprentice.png"
    when "Algorithm Adept"
      "algorithm_adept.png"
    when "Data Disciple"
      "data_disciple.png"
    when "ML Engineer"
      "ml_engineer.png"
    when "LLM Specialist"
      "llm_specialist.png"
    else
      "default_badge.png"
    end
  end
end
