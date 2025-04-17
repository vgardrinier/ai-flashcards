class QuizAttempt < ApplicationRecord
  belongs_to :user
  belongs_to :quiz_question
  
  validates :selected_option, presence: true, inclusion: { in: ['a', 'b', 'c', 'd'] }
  validates :correct, inclusion: { in: [true, false] }
  validates :score_change, presence: true, numericality: { only_integer: true }
  
  # Automatically determine if the answer is correct and calculate score change
  before_validation :check_answer_and_calculate_score, on: :create
  after_create :update_elo_score
  
  private
  
  def check_answer_and_calculate_score
    self.correct = (selected_option == quiz_question.correct_option)
    
    # Calculate score change based on difficulty and correctness
    if self.correct
      self.score_change = 5 * quiz_question.difficulty
    else
      self.score_change = -3 * quiz_question.difficulty
    end
  end
  
  def update_elo_score
    elo_score = user.elo_score
    new_score = [0, elo_score.score + score_change].max # Ensure score doesn't go below 0
    elo_score.update(score: new_score)
  end
end
