class Category < ApplicationRecord
  has_many :flashcards, dependent: :destroy
  has_many :quiz_questions, dependent: :destroy
  
  validates :name, presence: true, uniqueness: true
end
