#!/usr/bin/env ruby
# This script creates admin and regular users

# Create admin user if it doesn't exist
if User.find_by(username: 'admin').nil?
  puts "Creating admin user..."
  admin = User.create!(
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    password_confirmation: 'Admin123!',
    role: 'admin',
    email_verified: true,
    full_name: 'Admin User'
  )
  puts "Admin user created with ID: #{admin.id}"
else
  puts "Admin user already exists"
end

# Create regular user if it doesn't exist
if User.find_by(username: 'user').nil?
  puts "Creating regular user..."
  user = User.create!(
    username: 'user',
    email: 'user@example.com',
    password: 'User123!',
    password_confirmation: 'User123!',
    role: 'user',
    email_verified: true,
    full_name: 'Regular User'
  )
  puts "Regular user created with ID: #{user.id}"
else
  puts "Regular user already exists"
end

puts "User creation completed successfully!"