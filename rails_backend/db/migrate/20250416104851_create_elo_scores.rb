class CreateEloScores < ActiveRecord::Migration[7.1]
  def change
    create_table :elo_scores do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :score
      t.string :level

      t.timestamps
    end
  end
end
