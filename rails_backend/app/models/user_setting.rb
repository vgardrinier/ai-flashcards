class UserSetting < ApplicationRecord
  belongs_to :user
  
  validates :user_id, presence: true, uniqueness: true
  
  # Default settings
  after_initialize :set_defaults, if: :new_record?
  
  private
  
  def set_defaults
    self.notification_preference ||= 'all'
    self.ui_theme ||= 'light'
    self.timezone ||= 'UTC'
  end
end