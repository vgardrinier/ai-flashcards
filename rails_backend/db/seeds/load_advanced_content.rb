#!/usr/bin/env ruby
# This script loads all the advanced content seeds

# Get the directory of this file
seed_dir = File.dirname(__FILE__)

# List of all seed content files to load
seed_files = [
  'rag_content.rb',
  'multimodal_content.rb',
  # Add more files as they are created
]

# Load each seed file
seed_files.each do |file|
  puts "Loading seed file: #{file}..."
  require File.join(seed_dir, file)
  puts "Completed loading: #{file}"
end

puts "All advanced content loaded successfully!"