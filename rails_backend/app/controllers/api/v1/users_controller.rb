class Api::V1::UsersController < ApplicationController
  # GET /api/v1/users/:id
  def show
    user = User.find(params[:id])
    render json: user, include: :elo_score
  end
  
  # POST /api/v1/users
  def create
    user = User.new(user_params)
    
    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PUT /api/v1/users/:id
  def update
    user = User.find(params[:id])
    
    if user.update(user_params)
      render json: user
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
end
