#!/usr/bin/env ruby
# Script to test OpenAI with a manually entered API key
require 'net/http'
require 'json'

puts "Enter your OpenAI API key (starting with sk-): "
api_key = gets.chomp

puts "Testing with key: #{api_key[0..3]}...#{api_key[-4..-1]}"
puts "Key length: #{api_key.length}"

# Test with the API
uri = URI('https://api.openai.com/v1/chat/completions')
request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request['Authorization'] = "Bearer #{api_key}"

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
    
    # Write the working key to a new .env file
    File.open('.env.new', 'w') do |f|
      f.write("OPENAI_API_KEY=#{api_key}\n")
    end
    puts "Success! Working API key saved to .env.new"
    puts "You can replace your current .env file with this one"
  else
    puts "Error response: #{response.body}"
  end
rescue => e
  puts "Error: #{e.message}"
end