class CreateUserProgresses < ActiveRecord::Migration[7.1]
  def change
    create_table :user_progresses do |t|
      t.references :user, null: false, foreign_key: true
      t.references :flashcard, null: false, foreign_key: true
      t.integer :times_reviewed
      t.datetime :last_reviewed
      t.float :ease_factor
      t.datetime :next_review

      t.timestamps
    end
  end
end
