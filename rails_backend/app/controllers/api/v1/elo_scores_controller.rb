class Api::V1::EloScoresController < ApplicationController
  # GET /api/v1/elo_scores/:user_id
  def show
    user = User.find(params[:user_id])
    elo_score = user.elo_score
    
    render json: elo_score
  end
  
  # PUT /api/v1/elo_scores/:user_id
  def update
    user = User.find(params[:user_id])
    elo_score = user.elo_score
    
    if elo_score.update(elo_score_params)
      render json: elo_score
    else
      render json: { errors: elo_score.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # GET /api/v1/elo_scores/:user_id/history
  def history
    user = User.find(params[:user_id])
    
    # If there are no attempts, return just the current score
    if user.quiz_attempts.empty?
      render json: [{
        date: user.elo_score.created_at,
        score: user.elo_score.score,
        change: 0
      }]
      return
    end
    
    # Get unique quiz sessions
    sessions = QuizAttempt.unique_sessions_for_user(user.id).compact
    
    # Create history entries for each session
    history = []
    
    # Add initial score entry if it doesn't exist
    first_attempt = user.quiz_attempts.order(created_at: :asc).first
    if first_attempt && first_attempt.initial_score
      history << {
        date: user.elo_score.created_at,
        score: first_attempt.initial_score,
        change: 0,
        session_id: nil
      }
    end
    
    # Process each session
    sessions.each do |session_id|
      next unless session_id.present?
      
      # Get the last attempt in the session to get the final score
      last_attempt = user.quiz_attempts.where(quiz_session_id: session_id).order(created_at: :desc).first
      first_attempt = user.quiz_attempts.where(quiz_session_id: session_id).order(created_at: :asc).first
      
      next unless last_attempt && first_attempt
      
      # Calculate total change for the session
      total_change = user.quiz_attempts.where(quiz_session_id: session_id).sum(:score_change)
      
      # Add entry for this session
      history << {
        date: last_attempt.created_at,
        score: last_attempt.elo_score_after,
        change: total_change,
        session_id: session_id,
        initial_score: first_attempt.initial_score
      }
    end
    
    # Sort by date
    history = history.sort_by { |entry| entry[:date] }
    
    render json: history
  end
  
  # GET /api/v1/elo_scores/levels
  def levels
    levels = EloLevel.all.order(min_score: :asc)
    render json: levels
  end
  
  private
  
  def elo_score_params
    params.require(:elo_score).permit(:score)
  end
end
