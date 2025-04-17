class CreateEloLevels < ActiveRecord::Migration[7.1]
  def change
    create_table :elo_levels do |t|
      t.string :name
      t.integer :min_score
      t.integer :max_score
      t.text :description

      t.timestamps
    end
  end
end
