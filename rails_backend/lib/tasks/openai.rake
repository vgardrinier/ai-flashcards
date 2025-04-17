namespace :openai do
  desc "Test OpenAI API connection"
  task test_connection: :environment do
    require 'openai'
    
    puts "Testing OpenAI API connection..."
    
    api_key = ENV['OPENAI_API_KEY']
    puts "API key exists: #{api_key.present?}"
    puts "API key length: #{api_key.to_s.length}"
    
    if api_key.present?
      puts "First few chars: #{api_key[0..3]}..."
      puts "Last few chars: ...#{api_key[-4..-1]}"
      puts "Starts with 'sk-': #{api_key.start_with?('sk-')}"
      
      contains_whitespace = api_key.match?(/\s/)
      puts "Contains whitespace: #{contains_whitespace}"
      
      if contains_whitespace
        puts "Trimming whitespace..."
        api_key = api_key.strip
        puts "New length: #{api_key.length}"
      end
      
      begin
        puts "\nAttempting to connect to OpenAI API..."
        client = OpenAI::Client.new(api_key: api_key)
        
        puts "Testing a simple chat completion..."
        chat_response = client.chat(
          parameters: {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: "Say hello in 5 words or less!" }
            ]
          }
        )
        
        if chat_response['error']
          puts "Error: #{chat_response['error']['message']}"
          puts "Full error response: #{chat_response['error'].inspect}"
        else
          content = chat_response.dig('choices', 0, 'message', 'content')
          puts "Success! Response: #{content}"
          puts "Test successful!"
        end
      rescue => e
        puts "Error: #{e.class}: #{e.message}"
        puts e.backtrace.first(5)
      end
    else
      puts "No API key found. Please set the OPENAI_API_KEY environment variable."
    end
  end
end