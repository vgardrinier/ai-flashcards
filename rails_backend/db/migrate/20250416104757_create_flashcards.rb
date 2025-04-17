class CreateFlashcards < ActiveRecord::Migration[7.1]
  def change
    create_table :flashcards do |t|
      t.text :question
      t.text :answer
      t.text :explanation
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
