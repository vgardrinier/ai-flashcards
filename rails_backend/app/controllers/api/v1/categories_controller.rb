class Api::V1::CategoriesController < ApplicationController
  # GET /api/v1/categories
  def index
    categories = Category.all
    render json: categories
  end
  
  # GET /api/v1/categories/:id
  def show
    category = Category.find(params[:id])
    render json: category, include: [:flashcards, :quiz_questions]
  end
  
  # POST /api/v1/categories
  def create
    category = Category.new(category_params)
    
    if category.save
      render json: category, status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def category_params
    params.require(:category).permit(:name, :description)
  end
end
