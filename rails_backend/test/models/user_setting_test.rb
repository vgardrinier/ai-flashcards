require "test_helper"

class UserSettingTest < ActiveSupport::TestCase
  def setup
    @user = User.create(
      username: "settingsuser",
      email: "settings@example.com",
      password: "password123",
      password_confirmation: "password123"
    )
    @user_setting = @user.user_setting
  end
  
  test "should be valid" do
    assert @user_setting.valid?
  end
  
  test "should belong to a user" do
    assert_equal @user, @user_setting.user
  end
  
  test "user_id should be unique" do
    duplicate_setting = UserSetting.new(user: @user)
    assert_not duplicate_setting.valid?
  end
  
  test "should set default notification_preference" do
    assert_equal "all", @user_setting.notification_preference
  end
  
  test "should set default ui_theme" do
    assert_equal "light", @user_setting.ui_theme
  end
  
  test "should set default timezone" do
    assert_equal "UTC", @user_setting.timezone
  end
  
  test "should update notification_preference" do
    @user_setting.update(notification_preference: "none")
    assert_equal "none", @user_setting.reload.notification_preference
  end
  
  test "should update ui_theme" do
    @user_setting.update(ui_theme: "dark")
    assert_equal "dark", @user_setting.reload.ui_theme
  end
  
  test "should update timezone" do
    @user_setting.update(timezone: "America/New_York")
    assert_equal "America/New_York", @user_setting.reload.timezone
  end
  
  test "should be deleted when user is deleted" do
    setting_id = @user_setting.id
    @user.destroy
    assert_nil UserSetting.find_by(id: setting_id)
  end
end