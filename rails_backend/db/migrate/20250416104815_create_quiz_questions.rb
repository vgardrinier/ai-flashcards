class CreateQuizQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :quiz_questions do |t|
      t.text :question
      t.string :option_a
      t.string :option_b
      t.string :option_c
      t.string :option_d
      t.string :correct_option
      t.integer :difficulty
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
