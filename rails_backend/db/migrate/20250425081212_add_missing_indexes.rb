class AddMissingIndexes < ActiveRecord::Migration[7.1]
  def change
    # Add indexes on users table
    add_index :users, :email, unique: true
    add_index :users, :username, unique: true
    
    # Add index on quiz_attempts table
    add_index :quiz_attempts, :quiz_session_id
    
    # Add composite index on user_progresses
    add_index :user_progresses, [:user_id, :next_review]
  end
end
