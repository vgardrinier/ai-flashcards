require "test_helper"

class UserTest < ActiveSupport::TestCase
  def setup
    @user = User.new(
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      password_confirmation: "password123"
    )
  end
  
  test "should be valid" do
    assert @user.valid?
  end
  
  test "username should be present" do
    @user.username = ""
    assert_not @user.valid?
  end
  
  test "username should be unique" do
    duplicate_user = @user.dup
    @user.save
    assert_not duplicate_user.valid?
  end
  
  test "email should be present" do
    @user.email = ""
    assert_not @user.valid?
  end
  
  test "email should be unique" do
    duplicate_user = @user.dup
    @user.save
    assert_not duplicate_user.valid?
  end
  
  test "email should have valid format" do
    @user.email = "invalid_email"
    assert_not @user.valid?
  end
  
  test "role should have a default value" do
    @user.save
    assert_equal "user", @user.role
  end
  
  test "role should be valid" do
    @user.role = "invalid_role"
    assert_not @user.valid?
    
    @user.role = "admin"
    assert @user.valid?
  end
  
  test "email_verified should default to false" do
    @user.save
    assert_not @user.email_verified
  end
  
  test "should create elo_score after creation" do
    @user.save
    assert @user.elo_score.present?
    assert_equal 1000, @user.elo_score.score
    assert_equal "AI Apprentice", @user.elo_score.level
  end
  
  test "should create user_setting after creation" do
    @user.save
    assert @user.user_setting.present?
    assert_equal "all", @user.user_setting.notification_preference
    assert_equal "light", @user.user_setting.ui_theme
    assert_equal "UTC", @user.user_setting.timezone
  end
  
  test "admin? returns true for admin users" do
    @user.role = "admin"
    assert @user.admin?
  end
  
  test "admin? returns false for non-admin users" do
    @user.role = "user"
    assert_not @user.admin?
  end
  
  test "verified? returns true for verified users" do
    @user.email_verified = true
    assert @user.verified?
  end
  
  test "verified? returns false for unverified users" do
    @user.email_verified = false
    assert_not @user.verified?
  end
  
  test "generate_verification_token creates a token" do
    @user.save
    assert_nil @user.verification_token
    token = @user.generate_verification_token
    assert_not_nil token
    assert_equal token, @user.verification_token
  end
  
  test "verify_email! marks user as verified" do
    @user.verification_token = "test_token"
    @user.email_verified = false
    @user.save
    
    @user.verify_email!
    assert @user.email_verified
    assert_nil @user.verification_token
  end
  
  test "generate_password_reset creates a token" do
    @user.save
    token = @user.generate_password_reset
    assert_not_nil token
    assert_equal token, @user.reset_password_token
    assert_not_nil @user.reset_password_sent_at
  end
  
  test "password_reset_expired? returns true for expired tokens" do
    @user.reset_password_sent_at = 3.hours.ago
    assert @user.password_reset_expired?
  end
  
  test "password_reset_expired? returns false for valid tokens" do
    @user.reset_password_sent_at = 1.hour.ago
    assert_not @user.password_reset_expired?
  end
end
