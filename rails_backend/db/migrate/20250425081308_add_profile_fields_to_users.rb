class AddProfileFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :full_name, :string
    add_column :users, :avatar_url, :string
    add_column :users, :email_verified, :boolean, default: false
    add_column :users, :verification_token, :string
    add_column :users, :reset_password_token, :string
    add_column :users, :reset_password_sent_at, :datetime
  end
end
