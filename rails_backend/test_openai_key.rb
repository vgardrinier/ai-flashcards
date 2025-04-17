#!/usr/bin/env ruby
# Simple script to test OpenAI API key
require 'net/http'
require 'json'
require 'dotenv'

# Load environment variables from .env file
Dotenv.load

# Get the API key
api_key = ENV['OPENAI_API_KEY']

puts "API key exists: #{!api_key.nil? && !api_key.empty?}"
puts "API key length: #{api_key ? api_key.length : 0}"

if api_key && !api_key.empty?
  puts "First few chars: #{api_key[0..3]}..."
  puts "Last few chars: ...#{api_key[-4..-1]}"
  
  # Remove any whitespace or non-printable characters
  cleaned_key = api_key.strip.gsub(/[^[:print:]]/, '')
  
  # Test with the API
  uri = URI('https://api.openai.com/v1/chat/completions')
  request = Net::HTTP::Post.new(uri)
  request['Content-Type'] = 'application/json'
  request['Authorization'] = "Bearer #{cleaned_key}"
  
  request.body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Say hello!' }
    ]
  }.to_json
  
  puts "Sending request to OpenAI API..."
  
  begin
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
    
    puts "Response status: #{response.code} #{response.message}"
    
    if response.is_a?(Net::HTTPSuccess)
      data = JSON.parse(response.body)
      message = data.dig('choices', 0, 'message', 'content')
      puts "Success! Got response: #{message}"
    else
      puts "Error response: #{response.body}"
    end
  rescue => e
    puts "Error: #{e.message}"
  end
else
  puts "No API key found in environment variables."
end