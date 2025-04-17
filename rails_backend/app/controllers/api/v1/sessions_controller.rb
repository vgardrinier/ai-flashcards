class Api::V1::SessionsController < ApplicationController
  # POST /api/v1/login
  def create
    user = User.find_by(email: params[:email])
    
    if user && user.authenticate(params[:password])
      render json: {
        user: user,
        elo_score: user.elo_score,
        token: generate_token(user.id)
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
  
  private
  
  def generate_token(user_id)
    # In a real application, use a proper JWT library with secret key
    # This is a simplified version for demonstration
    require 'base64'
    payload = { user_id: user_id, exp: 24.hours.from_now.to_i }
    Base64.strict_encode64(payload.to_json)
  end
end
