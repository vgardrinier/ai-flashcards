class BackfillQuizSessionIds < ActiveRecord::Migration[7.1]
  def up
    # Group existing quiz attempts into sessions
    User.find_each do |user|
      # Get all attempts for this user
      attempts = QuizAttempt.where(user_id: user.id).order(created_at: :asc)
      
      # Skip if no attempts
      next if attempts.empty?
      
      # Group attempts that are close together in time (within 5 minutes)
      current_session = nil
      last_attempt_time = nil
      
      attempts.each do |attempt|
        # If this is the first attempt or it's been more than 5 minutes, create a new session
        if current_session.nil? || last_attempt_time.nil? || 
           (attempt.created_at - last_attempt_time) > 5.minutes
          current_session = "quiz_#{user.id}_#{attempt.created_at.to_i}"
        end
        
        # Update the attempt with the session ID
        attempt.update_column(:quiz_session_id, current_session)
        
        # Also backfill the initial score
        if attempt.initial_score.nil?
          # Use the previous score as the initial score
          previous_attempts = QuizAttempt.where(user_id: user.id)
                                         .where('created_at < ?', attempt.created_at)
                                         .order(created_at: :desc)
                                         .first
          
          initial_score = if previous_attempts
                            previous_attempts.elo_score_after
                          else
                            # Default initial score
                            1000
                          end
          
          attempt.update_column(:initial_score, initial_score)
        end
        
        # Update the last attempt time
        last_attempt_time = attempt.created_at
      end
    end
  end

  def down
    # If needed, we could remove the session IDs here
    QuizAttempt.update_all(quiz_session_id: nil, initial_score: nil)
  end
end
