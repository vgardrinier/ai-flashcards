require 'test_helper'

class SpacedRepetitionServiceTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
    @flashcard = flashcards(:one)
    @user_progress = UserProgress.create(
      user: @user,
      flashcard: @flashcard,
      times_reviewed: 0,
      ease_factor: nil,
      next_review: nil,
      last_reviewed: nil
    )
  end
  
  test "initializes new card with default values" do
    result = SpacedRepetitionService.calculate_next_review(@user_progress, 3)
    
    assert_equal 1, result.times_reviewed
    assert_equal SpacedRepetitionService::DEFAULT_EASE_FACTOR, result.ease_factor
    assert_not_nil result.next_review
    assert_not_nil result.last_reviewed
  end
  
  test "schedules failed cards (rating < 3) for tomorrow" do
    # First review with rating 2 (fail)
    result = SpacedRepetitionService.calculate_next_review(@user_progress, 2)
    
    assert_equal 1, result.times_reviewed
    assert_in_delta Time.current + 1.day, result.next_review, 5.seconds
  end
  
  test "increases interval for successfully reviewed cards" do
    # First successful review (rating 3)
    result1 = SpacedRepetitionService.calculate_next_review(@user_progress, 3)
    assert_equal 1, result1.times_reviewed
    assert_in_delta Time.current + 1.day, result1.next_review, 5.seconds
    
    # Second successful review (rating 4)
    result1.last_reviewed = Time.current - 1.day
    result2 = SpacedRepetitionService.calculate_next_review(result1, 4)
    assert_equal 2, result2.times_reviewed
    assert_in_delta Time.current + 6.days, result2.next_review, 5.seconds
    
    # Third successful review (rating 5)
    result2.last_reviewed = Time.current - 6.days
    result3 = SpacedRepetitionService.calculate_next_review(result2, 5)
    assert_equal 3, result3.times_reviewed
    
    # Interval should now be 6 * easeFactor (which has increased from perfect ratings)
    assert result3.next_review > Time.current + 15.days
  end
  
  test "adjusts ease factor based on performance" do
    # Perfect rating increases ease factor
    result1 = SpacedRepetitionService.calculate_next_review(@user_progress, 5)
    assert result1.ease_factor > SpacedRepetitionService::DEFAULT_EASE_FACTOR
    
    # Poor rating decreases ease factor
    result2 = SpacedRepetitionService.calculate_next_review(@user_progress, 1)
    assert result2.ease_factor < SpacedRepetitionService::DEFAULT_EASE_FACTOR
    
    # Ease factor never goes below minimum
    5.times do
      # Multiple poor ratings in a row
      @user_progress = SpacedRepetitionService.calculate_next_review(@user_progress, 0)
    end
    assert_equal SpacedRepetitionService::MIN_EASE_FACTOR, @user_progress.ease_factor
  end
  
  test "caps interval at maximum value" do
    # Simulate many successful reviews to reach maximum interval
    progress = @user_progress
    
    # Artificially set high ease factor to reach maximum faster
    progress.ease_factor = 3.0
    
    # Simulate 10 perfect reviews
    10.times do |i|
      progress = SpacedRepetitionService.calculate_next_review(progress, 5)
    end
    
    # The interval should be capped at the maximum
    max_date = Time.current + SpacedRepetitionService::MAX_INTERVAL.days
    assert progress.next_review <= max_date
  end
end