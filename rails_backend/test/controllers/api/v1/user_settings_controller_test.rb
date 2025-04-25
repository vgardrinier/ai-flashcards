require "test_helper"

class Api::V1::UserSettingsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:one)
    @token = jwt_token_for_user(@user)
  end
  
  test "should show user settings when authenticated" do
    get api_v1_user_settings_url, headers: { 'Authorization': "Bearer #{@token}" }
    assert_response :success
    
    json_response = JSON.parse(response.body)
    assert_not_nil json_response['notification_preference']
    assert_not_nil json_response['ui_theme']
    assert_not_nil json_response['timezone']
  end
  
  test "should not show user settings without authentication" do
    get api_v1_user_settings_url
    assert_response :unauthorized
  end
  
  test "should update user settings when authenticated" do
    put api_v1_user_settings_url, 
        params: { 
          user_setting: { 
            notification_preference: "important", 
            ui_theme: "dark", 
            timezone: "America/Los_Angeles" 
          } 
        },
        headers: { 'Authorization': "Bearer #{@token}" },
        as: :json
        
    assert_response :success
    
    settings = @user.user_setting.reload
    assert_equal "important", settings.notification_preference
    assert_equal "dark", settings.ui_theme
    assert_equal "America/Los_Angeles", settings.timezone
  end
  
  test "should not update user settings without authentication" do
    put api_v1_user_settings_url, 
        params: { 
          user_setting: { 
            notification_preference: "important", 
            ui_theme: "dark", 
            timezone: "America/Los_Angeles" 
          } 
        },
        as: :json
        
    assert_response :unauthorized
  end
  
  test "should create settings if they don't exist" do
    # Delete existing settings
    @user.user_setting.destroy
    @user.reload
    
    get api_v1_user_settings_url, headers: { 'Authorization': "Bearer #{@token}" }
    assert_response :success
    
    @user.reload
    assert_not_nil @user.user_setting
  end
  
  private
  
  def jwt_token_for_user(user)
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
  end
end