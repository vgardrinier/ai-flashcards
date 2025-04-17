class QuizAttempt < ApplicationRecord
  belongs_to :user
  belongs_to :quiz_question
  
  validates :user_id, presence: true
  validates :quiz_question_id, presence: true
  validates :selected_option, presence: true
  validates :difficulty, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 3 }, allow_nil: true
  validates :correct, inclusion: { in: [true, false] }
  validates :score_change, numericality: { only_integer: true }, allow_nil: true
  validates :elo_score_after, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  
  # Automatically determine if the answer is correct and calculate score change
  before_validation :check_answer_and_calculate_score, on: :create
  before_create :calculate_elo_score_after
  after_create :update_elo_score
  
  def correct?
    selected_option == quiz_question.correct_option
  end
  
  private
  
  def check_answer_and_calculate_score
    self.correct = correct?
    
    # Calculate base score (0-100)
    base_score = correct? ? 100 : -50  # Negative base score for incorrect answers
    
    # Adjust score based on difficulty
    # Higher difficulty questions are worth more points (or lose more points)
    difficulty_multiplier = 1.0 + (difficulty - 1) * 0.2 if difficulty
    
    # Calculate final score
    final_score = (base_score * difficulty_multiplier).round
    
    # Calculate score change based on user's current ELO
    # Higher ELO users need to perform better to maintain their score
    elo_factor = case user.elo_score.score
                 when 0..1000 then 1.0
                 when 1001..2000 then 0.8
                 when 2001..3000 then 0.6
                 else 0.4
                 end
    
    # Calculate score change (positive for correct, negative for incorrect)
    # Cap the maximum score change to prevent extreme fluctuations
    max_score_change = 20
    self.score_change = (final_score * elo_factor).round.clamp(-max_score_change, max_score_change)
  end

  def calculate_elo_score_after
    current_score = user.elo_score.score
    self.elo_score_after = [0, current_score + score_change].max # Ensure score doesn't go below 0
  end
  
  def update_elo_score
    elo_score = user.elo_score
    elo_score.update(score: elo_score_after)
  end
end
