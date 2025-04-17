class CreateQuizAttempts < ActiveRecord::Migration[7.1]
  def change
    create_table :quiz_attempts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :quiz_question, null: false, foreign_key: true
      t.string :selected_option
      t.boolean :correct
      t.integer :score_change

      t.timestamps
    end
  end
end
