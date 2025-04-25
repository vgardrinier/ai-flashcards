class User < ApplicationRecord
  has_secure_password
  
  # Associations
  has_many :user_progresses, dependent: :destroy
  has_many :flashcards, through: :user_progresses
  has_many :quiz_attempts, dependent: :destroy
  has_one :elo_score, dependent: :destroy
  has_one :user_setting, dependent: :destroy
  
  # Validations
  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, inclusion: { in: %w(user admin) }
  
  # Callbacks
  after_create :create_initial_elo_score
  after_create :create_user_setting
  
  # Scopes
  scope :admins, -> { where(role: 'admin') }
  scope :verified, -> { where(email_verified: true) }
  
  # Methods
  def admin?
    role == 'admin'
  end
  
  def verified?
    email_verified
  end
  
  def generate_verification_token
    self.verification_token = SecureRandom.urlsafe_base64
    save
    verification_token
  end
  
  def verify_email!
    update(email_verified: true, verification_token: nil)
  end
  
  def generate_password_reset
    update(
      reset_password_token: SecureRandom.urlsafe_base64,
      reset_password_sent_at: Time.current
    )
    reset_password_token
  end
  
  def password_reset_expired?
    reset_password_sent_at < 2.hours.ago
  end
  
  private
  
  def create_initial_elo_score
    # Start with 1000 points at the "AI Apprentice" level
    self.create_elo_score(score: 1000, level: "AI Apprentice")
  end
  
  def create_user_setting
    # Create default user settings
    UserSetting.create(user: self)
  end
end
