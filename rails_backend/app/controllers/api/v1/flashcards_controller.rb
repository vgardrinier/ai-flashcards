class Api::V1::FlashcardsController < ApplicationController
  before_action :authenticate_user, except: [:index, :show]
  before_action :require_admin, only: [:create, :update, :destroy]
  before_action :set_flashcard, only: [:show, :update, :destroy]
  
  # GET /api/v1/flashcards
  def index
    flashcards = Flashcard.includes(:category)
    
    # Filter by category if provided
    if params[:category_id].present?
      flashcards = flashcards.where(category_id: params[:category_id])
    end
    
    # Pagination
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 20).to_i
    flashcards = flashcards.limit(per_page).offset((page - 1) * per_page)
    
    render json: {
      flashcards: flashcards.as_json(include: :category),
      meta: {
        total_count: Flashcard.count,
        current_page: page,
        per_page: per_page,
        total_pages: (Flashcard.count.to_f / per_page).ceil
      }
    }
  end
  
  # GET /api/v1/flashcards/:id
  def show
    render json: @flashcard, include: :category
  end
  
  # POST /api/v1/flashcards
  def create
    flashcard = Flashcard.new(flashcard_params)
    
    if flashcard.save
      render json: flashcard, status: :created
    else
      render json: { errors: flashcard.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PUT /api/v1/flashcards/:id
  def update
    if @flashcard.update(flashcard_params)
      render json: @flashcard
    else
      render json: { errors: @flashcard.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/flashcards/:id
  def destroy
    @flashcard.destroy
    head :no_content
  end
  
  private
  
  def set_flashcard
    @flashcard = Flashcard.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Flashcard not found' }, status: :not_found
  end
  
  def flashcard_params
    params.require(:flashcard).permit(:question, :answer, :explanation, :category_id)
  end
end
