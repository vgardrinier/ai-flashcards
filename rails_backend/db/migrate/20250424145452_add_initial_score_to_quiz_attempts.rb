class AddInitialScoreToQuizAttempts < ActiveRecord::Migration[7.1]
  def change
    add_column :quiz_attempts, :initial_score, :integer
  end
end
