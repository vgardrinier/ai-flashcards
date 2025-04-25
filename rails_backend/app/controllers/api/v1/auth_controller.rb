class Api::V1::AuthController < ApplicationController
  before_action :authenticate_user, only: [:me, :resend_verification]
  
  # POST /api/v1/login
  def login
    user = User.find_by(email: params[:email])
    
    if user && user.authenticate(params[:password])
      render json: {
        user: user.as_json(except: [:password_digest, :verification_token, :reset_password_token]),
        elo_score: user.elo_score,
        token: generate_token(user.id),
        verified: user.email_verified,
        role: user.role,
        settings: user.user_setting
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
  
  # GET /api/v1/me
  def me
    render json: {
      user: current_user.as_json(except: [:password_digest, :verification_token, :reset_password_token]),
      elo_score: current_user.elo_score,
      verified: current_user.email_verified,
      role: current_user.role,
      settings: current_user.user_setting
    }
  end
  
  # POST /api/v1/logout
  def logout
    # In a token-based authentication system, the client simply discards the token
    # The server doesn't need to do anything special
    render json: { message: 'Logged out successfully' }
  end
  
  # GET /api/v1/verify_email/:token
  def verify_email
    user = User.find_by(verification_token: params[:token])
    
    if user
      user.verify_email!
      render json: { message: 'Email verified successfully' }
    else
      render json: { error: 'Invalid verification token' }, status: :bad_request
    end
  end
  
  # POST /api/v1/resend_verification
  def resend_verification
    if current_user.email_verified
      render json: { message: 'Email already verified' }
      return
    end
    
    token = current_user.generate_verification_token
    # In a real app, send an email with a verification link
    # VerificationMailer.verification_email(current_user, token).deliver_later
    
    render json: { message: 'Verification email sent' }
  end
  
  # POST /api/v1/forgot_password
  def forgot_password
    user = User.find_by(email: params[:email])
    
    if user
      token = user.generate_password_reset
      # In a real app, send a password reset email
      # PasswordResetMailer.reset_email(user, token).deliver_later
      
      render json: { message: 'Password reset instructions sent to your email' }
    else
      # Always return success to prevent email enumeration
      render json: { message: 'If your email exists in our system, you will receive reset instructions' }
    end
  end
  
  # PUT /api/v1/reset_password/:token
  def reset_password
    user = User.find_by(reset_password_token: params[:token])
    
    if !user
      render json: { error: 'Invalid reset token' }, status: :bad_request
      return
    end
    
    if user.password_reset_expired?
      render json: { error: 'Password reset token has expired' }, status: :bad_request
      return
    end
    
    if params[:password] != params[:password_confirmation]
      render json: { error: 'Password and confirmation do not match' }, status: :unprocessable_entity
      return
    end
    
    user.update(
      password: params[:password],
      reset_password_token: nil,
      reset_password_sent_at: nil
    )
    
    render json: { message: 'Password has been reset successfully' }
  end
  
  private
  
  def generate_token(user_id)
    # Proper JWT implementation
    payload = { 
      user_id: user_id, 
      exp: 24.hours.from_now.to_i 
    }
    JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
  end
end
