class AddDifficultyToQuizAttempts < ActiveRecord::Migration[7.0]
  def change
    add_column :quiz_attempts, :difficulty, :integer
  end
end 