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
    attempts = user.quiz_attempts.order(created_at: :asc).limit(100)
    
    # Calculate cumulative score over time
    score_history = []
    running_score = 1000 # Starting score
    
    attempts.each do |attempt|
      running_score += attempt.score_change
      score_history << {
        date: attempt.created_at,
        score: running_score,
        change: attempt.score_change,
        question_id: attempt.quiz_question_id,
        correct: attempt.correct
      }
    end
    
    render json: score_history
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
