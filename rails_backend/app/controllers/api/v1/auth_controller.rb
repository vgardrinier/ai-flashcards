class Api::V1::AuthController < ApplicationController
  # POST /api/v1/login
  def login
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
  
  # GET /api/v1/me
  def me
    token = request.headers['Authorization']&.split(' ')&.last
    
    if token && valid_token?(token)
      user_id = decode_token(token)
      user = User.find(user_id)
      
      render json: {
        user: user,
        elo_score: user.elo_score
      }
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
  
  # POST /api/v1/logout
  def logout
    # In a token-based authentication system, the client simply discards the token
    # The server doesn't need to do anything special
    render json: { message: 'Logged out successfully' }
  end
  
  private
  
  def generate_token(user_id)
    # In a real application, use a proper JWT library with secret key
    # This is a simplified version for demonstration
    require 'base64'
    payload = { user_id: user_id, exp: 24.hours.from_now.to_i }
    Base64.strict_encode64(payload.to_json)
  end
  
  def decode_token(token)
    # In a real application, use a proper JWT library with verification
    # This is a simplified version for demonstration
    require 'base64'
    payload = JSON.parse(Base64.strict_decode64(token))
    
    if payload['exp'] < Time.now.to_i
      nil
    else
      payload['user_id']
    end
  rescue
    nil
  end
  
  def valid_token?(token)
    !!decode_token(token)
  end
end
