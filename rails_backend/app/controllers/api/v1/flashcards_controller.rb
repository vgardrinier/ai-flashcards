class Api::V1::FlashcardsController < ApplicationController
  # GET /api/v1/flashcards
  def index
    flashcards = Flashcard.includes(:category)
    
    # Filter by category if provided
    if params[:category_id].present?
      flashcards = flashcards.where(category_id: params[:category_id])
    end
    
    render json: flashcards, include: :category
  end
  
  # GET /api/v1/flashcards/:id
  def show
    flashcard = Flashcard.find(params[:id])
    render json: flashcard, include: :category
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
    flashcard = Flashcard.find(params[:id])
    
    if flashcard.update(flashcard_params)
      render json: flashcard
    else
      render json: { errors: flashcard.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def flashcard_params
    params.require(:flashcard).permit(:question, :answer, :explanation, :category_id)
  end
end
