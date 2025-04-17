class UserProgress < ApplicationRecord
  belongs_to :user
  belongs_to :flashcard
  
  validates :times_reviewed, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :ease_factor, presence: true, numericality: { greater_than_or_equal_to: 1.0 }
  
  # Default values for new records
  after_initialize :set_defaults, if: :new_record?
  
  private
  
  def set_defaults
    self.times_reviewed ||= 0
    self.ease_factor ||= 2.5
    self.last_reviewed ||= Time.current
    self.next_review ||= Time.current + 1.day
  end
end
