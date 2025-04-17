class QuizQuestion < ApplicationRecord
  belongs_to :category
  has_many :quiz_attempts, dependent: :destroy
  
  validates :question, presence: true
  validates :option_a, presence: true
  validates :option_b, presence: true
  validates :option_c, presence: true
  validates :option_d, presence: true
  validates :correct_option, presence: true, inclusion: { in: ['a', 'b', 'c', 'd'] }
  validates :difficulty, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
end
