class SpacedRepetitionService
  # Based on the SuperMemo-2 algorithm for spaced repetition
  
  # Constants for the SM-2 algorithm
  MIN_EASE_FACTOR = 1.3 # Minimum ease factor
  DEFAULT_EASE_FACTOR = 2.5 # Starting ease factor for new cards
  MAX_INTERVAL = 365 # Maximum interval in days
  
  # Ratings for card reviews
  # 0 - Complete blackout, wrong answer
  # 1 - Incorrect answer but recognized the correct answer
  # 2 - Incorrect answer but upon seeing the correct answer it felt familiar
  # 3 - Correct answer but required significant effort to recall
  # 4 - Correct answer after some hesitation
  # 5 - Perfect recall
  
  def self.calculate_next_review(user_progress, rating)
    # Initialize values for new cards
    if user_progress.times_reviewed.nil? || user_progress.times_reviewed == 0
      user_progress.times_reviewed = 0
      user_progress.ease_factor = DEFAULT_EASE_FACTOR
    end
    
    # Increment the review count
    user_progress.times_reviewed += 1
    
    # Calculate the next review interval based on rating
    if rating < 3
      # If rating is less than 3, reset the review count but keep the ease factor
      # This means the user will see the card again sooner
      user_progress.times_reviewed = 1
      interval = 1 # Review again tomorrow
    else
      # Apply the SuperMemo-2 algorithm
      interval = calculate_interval(user_progress.times_reviewed, user_progress.ease_factor)
    end
    
    # Update the ease factor based on the rating
    user_progress.ease_factor = calculate_new_ease_factor(user_progress.ease_factor, rating)
    
    # Calculate the next review date
    user_progress.next_review = Time.current + interval.days
    user_progress.last_reviewed = Time.current
    
    # Return the updated user_progress
    user_progress
  end
  
  private
  
  def self.calculate_interval(times_reviewed, ease_factor)
    case times_reviewed
    when 1
      1 # First review is always 1 day later
    when 2
      6 # Second review is 6 days later
    else
      # For subsequent reviews, multiply the previous interval by the ease factor
      # Calculate what the previous interval would have been
      previous_interval = times_reviewed == 3 ? 6 : calculate_interval(times_reviewed - 1, ease_factor)
      # Calculate the new interval
      new_interval = (previous_interval * ease_factor).round
      # Cap the interval at MAX_INTERVAL
      [new_interval, MAX_INTERVAL].min
    end
  end
  
  def self.calculate_new_ease_factor(current_ease_factor, rating)
    # Adjust the ease factor based on the performance rating (0-5)
    new_ease_factor = current_ease_factor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
    
    # Ensure ease factor doesn't go below the minimum
    [new_ease_factor, MIN_EASE_FACTOR].max
  end
end