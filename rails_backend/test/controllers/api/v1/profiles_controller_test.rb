require "test_helper"

class Api::V1::ProfilesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:one)
    @token = jwt_token_for_user(@user)
  end
  
  test "should show profile when authenticated" do
    get api_v1_profile_url, headers: { 'Authorization': "Bearer #{@token}" }
    assert_response :success
    
    json_response = JSON.parse(response.body)
    assert_equal @user.username, json_response['username']
    assert_not_nil json_response['elo_score']
    assert_not_nil json_response['user_setting']
  end
  
  test "should not show profile without authentication" do
    get api_v1_profile_url
    assert_response :unauthorized
  end
  
  test "should update profile when authenticated" do
    patch api_v1_profile_url, 
          params: { profile: { full_name: "Updated Name", avatar_url: "https://example.com/avatar.jpg" } },
          headers: { 'Authorization': "Bearer #{@token}" },
          as: :json
          
    assert_response :success
    
    @user.reload
    assert_equal "Updated Name", @user.full_name
    assert_equal "https://example.com/avatar.jpg", @user.avatar_url
  end
  
  test "should not update profile without authentication" do
    patch api_v1_profile_url, 
          params: { profile: { full_name: "Updated Name", avatar_url: "https://example.com/avatar.jpg" } },
          as: :json
          
    assert_response :unauthorized
  end
  
  test "should change password with valid credentials" do
    put api_v1_profile_change_password_url,
        params: { 
          current_password: "password", 
          password: "newpassword123", 
          password_confirmation: "newpassword123" 
        },
        headers: { 'Authorization': "Bearer #{@token}" },
        as: :json
        
    assert_response :success
    
    @user.reload
    assert @user.authenticate("newpassword123")
  end
  
  test "should not change password with incorrect current password" do
    put api_v1_profile_change_password_url,
        params: { 
          current_password: "wrongpassword", 
          password: "newpassword123", 
          password_confirmation: "newpassword123" 
        },
        headers: { 'Authorization': "Bearer #{@token}" },
        as: :json
        
    assert_response :unauthorized
  end
  
  test "should not change password when passwords don't match" do
    put api_v1_profile_change_password_url,
        params: { 
          current_password: "password", 
          password: "newpassword123", 
          password_confirmation: "differentpassword" 
        },
        headers: { 'Authorization': "Bearer #{@token}" },
        as: :json
        
    assert_response :unprocessable_entity
  end
  
  private
  
  def jwt_token_for_user(user)
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
  end
end