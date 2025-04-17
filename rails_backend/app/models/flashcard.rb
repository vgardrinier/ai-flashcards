class Flashcard < ApplicationRecord
  belongs_to :category
  has_many :user_progresses, dependent: :destroy
  has_many :users, through: :user_progresses
  
  validates :question, presence: true
  validates :answer, presence: true
end
