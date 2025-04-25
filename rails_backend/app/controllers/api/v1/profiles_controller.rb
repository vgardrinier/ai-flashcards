class Api::V1::ProfilesController < ApplicationController
  before_action :authenticate_user
  
  # GET /api/v1/profile
  def show
    render json: current_user, include: [:elo_score, :user_setting], 
           methods: [:admin?, :verified?],
           except: [:password_digest, :verification_token, :reset_password_token]
  end
  
  # PUT /api/v1/profile
  def update
    if current_user.update(profile_params)
      render json: current_user, include: [:elo_score, :user_setting], 
             methods: [:admin?, :verified?],
             except: [:password_digest, :verification_token, :reset_password_token]
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # PUT /api/v1/profile/change_password
  def change_password
    if !current_user.authenticate(params[:current_password])
      render json: { error: 'Current password is incorrect' }, status: :unauthorized
      return
    end
    
    if params[:password] != params[:password_confirmation]
      render json: { error: 'New password and confirmation do not match' }, status: :unprocessable_entity
      return
    end
    
    if current_user.update(password: params[:password])
      render json: { message: 'Password updated successfully' }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def profile_params
    params.require(:profile).permit(:full_name, :avatar_url)
  end
end