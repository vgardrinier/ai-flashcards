class BackfillEloScoreAfter < ActiveRecord::Migration[7.1]
  def up
    # For each user, process their attempts in chronological order
    User.find_each do |user|
      running_score = user.elo_score.score # Current score
      
      # Get all attempts for this user in reverse chronological order
      attempts = user.quiz_attempts.order(created_at: :desc)
      
      # Process attempts from newest to oldest
      attempts.each do |attempt|
        # This was the score after this attempt
        attempt.update_column(:elo_score_after, running_score)
        
        # Subtract the score change to get the score before this attempt
        running_score -= attempt.score_change
      end
    end
  end

  def down
    QuizAttempt.update_all(elo_score_after: nil)
  end
end 