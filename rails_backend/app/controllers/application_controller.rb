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
  
  # Check if user is an admin
  def require_admin
    authenticate_user
    unless @current_user&.role == 'admin'
      render json: { error: 'Forbidden: Admin access required' }, status: :forbidden
    end
  end
  
  private
  
  def decode_token(token)
    # Proper JWT implementation
    begin
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })[0]
      return decoded['user_id']
    rescue JWT::ExpiredSignature
      # Token has expired
      nil
    rescue JWT::DecodeError
      # Invalid token
      nil
    end
  end
  
  def valid_token?(token)
    !!decode_token(token)
  end
end
