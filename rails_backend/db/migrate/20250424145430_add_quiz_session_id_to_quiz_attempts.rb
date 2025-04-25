class AddQuizSessionIdToQuizAttempts < ActiveRecord::Migration[7.1]
  def change
    add_column :quiz_attempts, :quiz_session_id, :string
  end
end
