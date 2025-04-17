class User < ApplicationRecord
  has_secure_password
  
  has_many :user_progresses, dependent: :destroy
  has_many :flashcards, through: :user_progresses
  has_many :quiz_attempts, dependent: :destroy
  has_one :elo_score, dependent: :destroy
  
  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  
  after_create :create_initial_elo_score
  
  private
  
  def create_initial_elo_score
    # Start with 1000 points at the "AI Apprentice" level
    self.create_elo_score(score: 1000, level: "AI Apprentice")
  end
end
