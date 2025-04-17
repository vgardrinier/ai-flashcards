class EloScore < ApplicationRecord
  belongs_to :user
  
  validates :score, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :level, presence: true
  
  # Update user's level based on score
  after_save :update_level
  
  private
  
  def update_level
    # Find the appropriate level based on the current score
    appropriate_level = EloLevel.where('min_score <= ? AND max_score >= ?', self.score, self.score).first
    
    # Update the level if it's different from the current one
    if appropriate_level && self.level != appropriate_level.name
      self.update_column(:level, appropriate_level.name)
    end
  end
end
