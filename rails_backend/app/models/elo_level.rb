class EloLevel < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :min_score, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :max_score, presence: true, numericality: { only_integer: true, greater_than: :min_score }
  validates :description, presence: true
  
  # Find users at this level
  def users
    User.joins(:elo_score).where(elo_scores: { level: self.name })
  end
end
