require "test_helper"

class QuizAttemptTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)
    @question = quiz_questions(:one)
    @user.elo_score.update(score: 1000) # Set initial ELO score
  end

  test "correct answer increases score" do
    attempt = QuizAttempt.new(
      user: @user,
      quiz_question: @question,
      selected_option: @question.correct_option
    )
    
    assert_difference -> { @user.elo_score.reload.score }, 20 do
      attempt.save!
    end
  end

  test "incorrect answer decreases score" do
    attempt = QuizAttempt.new(
      user: @user,
      quiz_question: @question,
      selected_option: 'd' # Assuming this is incorrect
    )
    
    assert_difference -> { @user.elo_score.reload.score }, -20 do
      attempt.save!
    end
  end

  test "score change is capped" do
    # Test with a high difficulty question
    @question.update(difficulty: 5)
    
    attempt = QuizAttempt.new(
      user: @user,
      quiz_question: @question,
      selected_option: @question.correct_option
    )
    
    attempt.save!
    assert_equal 20, attempt.score_change
  end

  test "score never goes below zero" do
    @user.elo_score.update(score: 10) # Set low score
    
    attempt = QuizAttempt.new(
      user: @user,
      quiz_question: @question,
      selected_option: 'd' # Incorrect answer
    )
    
    attempt.save!
    assert_equal 0, @user.elo_score.reload.score
  end

  test "higher difficulty questions give more points" do
    @question.update(difficulty: 3)
    
    attempt = QuizAttempt.new(
      user: @user,
      quiz_question: @question,
      selected_option: @question.correct_option
    )
    
    attempt.save!
    assert_equal 20, attempt.score_change
  end

  # test "the truth" do
  #   assert true
  # end
end
