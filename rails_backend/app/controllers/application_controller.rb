class ApplicationController < ActionController::API
  # Add authentication methods that can be used by all controllers
  
  # Authenticate user from token
  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last
    
    unless token && valid_token?(token)
      render json: { error: 'Unauthorized' }, status: :unauthorized
      return
    end
    
    user_id = decode_token(token)
    @current_user = User.find_by(id: user_id)
    
    unless @current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
      return
    end
  end
  
  # Get the current authenticated user
  def current_user
    @current_user
  end
  
  private
  
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
