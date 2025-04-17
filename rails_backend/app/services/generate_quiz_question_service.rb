require 'net/http'
require 'json'

class GenerateQuizQuestionService
  # Use GPT-3.5 Turbo for faster responses and lower cost
  # You can switch to GPT-4 if you need higher quality
  CHAT_MODEL = 'gpt-3.5-turbo'.freeze
  API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'.freeze

  def initialize(category_id: nil, difficulty: nil)
    @category_id = category_id
    @difficulty = difficulty
  end

  def call
    # Check if we have the OpenAI API key
    api_key = ENV['OPENAI_API_KEY']
    if api_key.blank?
      Rails.logger.error("OPENAI_API_KEY is not set in environment variables")
      raise "OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable."
    end
    
    # Trim any whitespace from the API key
    api_key = api_key.strip if api_key.match?(/\s/)
    
    # Log API key info (safely)
    Rails.logger.info("API key exists: #{!api_key.nil? && !api_key.empty?}")
    Rails.logger.info("API key length: #{api_key.length}")
    Rails.logger.info("API key format valid: #{api_key.start_with?('sk-')}")
    
    # Make sure to clean the API key (remove any non-printable characters)
    api_key = api_key.gsub(/[^[:print:]]/, '')

    begin
      # Make a direct HTTP request to OpenAI API
      uri = URI(API_ENDPOINT)
      request = Net::HTTP::Post.new(uri)
      request['Content-Type'] = 'application/json'
      request['Authorization'] = "Bearer #{api_key}"
      
      # Prepare the request payload
      request_payload = {
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates quiz questions in JSON format.' },
          { role: 'user', content: build_prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 800
      }
      
      request.body = request_payload.to_json
      
      # Send the request
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(request)
      end
      
      Rails.logger.info("OpenAI response status: #{response.code} #{response.message}")
      
      # Check the response status
      unless response.is_a?(Net::HTTPSuccess)
        error_message = "OpenAI API returned #{response.code} #{response.message}"
        begin
          error_body = JSON.parse(response.body)
          if error_body['error'] && error_body['error']['message']
            error_message += ": #{error_body['error']['message']}"
          end
        rescue JSON::ParserError
          # Ignore parsing errors in error messages
        end
        
        Rails.logger.error(error_message)
        Rails.logger.error("Response body: #{response.body}")
        raise error_message
      end
      
      # Parse the JSON response
      response_data = JSON.parse(response.body)
      
      # Extract the content from the response
      content = response_data.dig('choices', 0, 'message', 'content')
      
      if content.blank?
        Rails.logger.error("Empty response from OpenAI API")
        Rails.logger.error("Full response: #{response_data.inspect}")
        raise "Received empty response from OpenAI. Please try again."
      end
      
      # Parse the JSON response
      begin
        data = JSON.parse(content)
        
        # Validate the required fields in the response
        validate_quiz_data(data)
        
        # Create or find the category
        category = find_or_create_category(data['category'])
        
        # Create the quiz question
        QuizQuestion.create!(
          question: data['question'],
          option_a: data['options']['A'],
          option_b: data['options']['B'],
          option_c: data['options']['C'],
          option_d: data['options']['D'],
          correct_option: data['correct_option'],
          explanation: data['explanation'],
          difficulty: data['difficulty'] || @difficulty || 1,
          category_id: @category_id || category.id
        )
      rescue JSON::ParserError => e
        Rails.logger.error("Failed to parse OpenAI response: #{e.message}")
        Rails.logger.error("Response content: #{content}")
        raise "Failed to parse the response from OpenAI as JSON. Please try again."
      end
    rescue SocketError, Timeout::Error, Errno::ECONNREFUSED => e
      Rails.logger.error("Network error with OpenAI API: #{e.message}")
      raise "Network error while connecting to OpenAI: #{e.message}"
    rescue StandardError => e
      Rails.logger.error("Error in OpenAI service: #{e.class.name} - #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      raise "Error generating quiz question: #{e.message}"
    end
  end

  private

  def validate_quiz_data(data)
    # Check for required fields
    required_fields = ['question', 'options', 'correct_option', 'explanation', 'category']
    missing_fields = required_fields.select { |field| data[field].nil? }
    
    if missing_fields.any?
      Rails.logger.error("Missing required fields in OpenAI response: #{missing_fields.join(', ')}")
      Rails.logger.error("Response data: #{data.inspect}")
      raise "The generated question is missing required fields: #{missing_fields.join(', ')}"
    end
    
    # Check for options
    unless data['options'].is_a?(Hash) && 
           data['options']['A'].present? && 
           data['options']['B'].present? && 
           data['options']['C'].present? && 
           data['options']['D'].present?
      Rails.logger.error("Invalid options format in OpenAI response")
      Rails.logger.error("Options: #{data['options'].inspect}")
      raise "The generated question has invalid options format"
    end
    
    # Check correct_option is valid and normalize to lowercase
    unless ['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd'].include?(data['correct_option'])
      Rails.logger.error("Invalid correct_option value: #{data['correct_option']}")
      raise "The correct_option must be one of A, B, C, or D"
    end
    
    # QuizQuestion model requires lowercase options
    data['correct_option'] = data['correct_option'].downcase
  end

  def build_prompt
    prompt = 'Generate a multiple-choice quiz question'
    prompt += " with difficulty level #{@difficulty}" if @difficulty.present?
    
    if @category_id.present?
      category = Category.find_by(id: @category_id)
      prompt += " in the category #{category.name}" if category
    end
    
    prompt += ". The response must be a valid JSON object with the following structure:\n"
    prompt += "{\n"
    prompt += '  "question": "The question text",\n'
    prompt += '  "options": {\n'
    prompt += '    "A": "First option",\n'
    prompt += '    "B": "Second option",\n'
    prompt += '    "C": "Third option",\n'
    prompt += '    "D": "Fourth option"\n'
    prompt += '  },\n'
    prompt += '  "correct_option": "a",\n'  # IMPORTANT: lower-case a, b, c, or d
    prompt += '  "explanation": "Explanation of why the correct answer is correct",\n'
    prompt += '  "difficulty": 1,\n'  # Example value, will be replaced by the model
    prompt += '  "category": "Category name"\n'  # Will be replaced by the model
    prompt += "}\n\n"
    prompt += "Requirements:\n"
    prompt += "1. The question must be appropriate for the difficulty level defined below:\n"
    prompt += "   - Level 1: Basic concepts, suitable for AI enthusiasts or junior software developers with minimal AI knowledge\n"
    prompt += "   - Level 2: Intermediate concepts, suitable for mid-level developers with some AI exposure\n"
    prompt += "   - Level 3: Advanced concepts, suitable for senior developers with AI experience\n"
    prompt += "   - Level 4: Expert concepts, suitable for ML engineers or AI specialists\n"
    prompt += "   - Level 5: Deep, specialist knowledge, suitable for PhD-level AI researchers\n"
    prompt += "2. All options must be valid and plausible\n"
    prompt += "3. VERY IMPORTANT: The correct_option must be lowercase, one of: a, b, c, or d\n"
    prompt += "4. The difficulty must be an integer from 1 (easiest) to 5 (hardest), matching the levels described above\n"
    prompt += "5. The explanation should clearly explain why the correct answer is right and why the other options are wrong\n"
    prompt += "6. The response must be a valid JSON object with the exact structure shown above\n"
    prompt += "7. Make sure to include all required fields exactly as specified\n"
    
    # If a specific difficulty was requested, emphasize it
    if @difficulty.present?
      prompt += "\nYou MUST generate a question at difficulty level #{@difficulty}, "
      case @difficulty.to_i
      when 1
        prompt += "which is BASIC level, suitable for AI enthusiasts or junior software developers with minimal AI knowledge."
      when 2
        prompt += "which is INTERMEDIATE level, suitable for mid-level developers with some AI exposure."
      when 3
        prompt += "which is ADVANCED level, suitable for senior developers with AI experience."
      when 4
        prompt += "which is EXPERT level, suitable for ML engineers or AI specialists."
      when 5
        prompt += "which is PHD RESEARCH level, suitable for PhD-level AI researchers with deep specialist knowledge."
      end
    end
    
    prompt
  end

  def find_or_create_category(name)
    Category.find_or_create_by(name: name)
  end
end