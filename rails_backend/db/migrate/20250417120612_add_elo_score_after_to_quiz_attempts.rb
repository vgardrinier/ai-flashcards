class AddEloScoreAfterToQuizAttempts < ActiveRecord::Migration[7.1]
  def change
    add_column :quiz_attempts, :elo_score_after, :integer
  end
end 