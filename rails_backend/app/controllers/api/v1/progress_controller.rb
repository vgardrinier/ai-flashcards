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
  
  private
  
  def progress_params
    params.require(:progress).permit(:user_id, :flashcard_id, :times_reviewed, :last_reviewed, :ease_factor, :next_review)
  end
end
