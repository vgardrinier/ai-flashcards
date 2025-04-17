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
    attempts = user.quiz_attempts.order(created_at: :asc)
    
    # If there are no attempts, return just the current score
    if attempts.empty?
      render json: [{
        date: user.elo_score.created_at,
        score: user.elo_score.score,
        change: 0
      }]
      return
    end
    
    # Return the history of scores from quiz attempts
    history = attempts.map do |attempt|
      {
        date: attempt.created_at,
        score: attempt.elo_score_after,
        change: attempt.score_change
      }
    end
    
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
