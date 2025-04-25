class CreateUserSettings < ActiveRecord::Migration[7.1]
  def change
    create_table :user_settings do |t|
      t.references :user, null: false, foreign_key: true
      t.string :notification_preference
      t.string :ui_theme
      t.string :timezone

      t.timestamps
    end
  end
end
