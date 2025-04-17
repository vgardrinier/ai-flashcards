class AddExplanationToQuizQuestions < ActiveRecord::Migration[7.1]
  def change
    add_column :quiz_questions, :explanation, :text
  end
end
