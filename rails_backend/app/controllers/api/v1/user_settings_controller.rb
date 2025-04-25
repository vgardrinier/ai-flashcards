class Api::V1::UserSettingsController < ApplicationController
  before_action :authenticate_user
  before_action :set_user_setting
  
  # GET /api/v1/user_settings
  def show
    render json: @user_setting
  end
  
  # PUT /api/v1/user_settings
  def update
    if @user_setting.update(user_setting_params)
      render json: @user_setting
    else
      render json: { errors: @user_setting.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def set_user_setting
    @user_setting = current_user.user_setting
    
    # Create settings if they don't exist
    if @user_setting.nil?
      @user_setting = UserSetting.create(user: current_user)
    end
  end
  
  def user_setting_params
    params.require(:user_setting).permit(:notification_preference, :ui_theme, :timezone)
  end
end