class Api::V1::Tests::OpenaiController < ApplicationController
  # Testing endpoint for OpenAI integration
  # POST /api/v1/tests/openai/generate_question
  def generate_question
    begin
      # Log the incoming parameters
      Rails.logger.info("OpenAI test params: #{params.inspect}")
      
      # Check API key first
      api_key = ENV['OPENAI_API_KEY']
      Rails.logger.info("API key exists: #{api_key.present?}")
      Rails.logger.info("API key length: #{api_key.to_s.length}")
      
      # Simple test request to OpenAI
      if params[:test_connection]
        result = test_connection
        render json: result
        return
      end
      
      service = GenerateQuizQuestionService.new(
        category_id: params[:category_id],
        difficulty: params[:difficulty]
      )
      
      # Call the service with explicit error handling
      begin
        question = service.call
        
        render json: {
          status: 'success',
          question: question,
          message: 'Successfully generated a quiz question'
        }, include: :category
      rescue => service_error
        Rails.logger.error("OpenAI service error: #{service_error.message}")
        Rails.logger.error(service_error.backtrace.join("\n"))
        
        render json: {
          status: 'error',
          error: service_error.message,
          error_type: service_error.class.name,
          backtrace: Rails.env.development? ? service_error.backtrace : nil
        }, status: :internal_server_error
      end
    rescue => controller_error
      Rails.logger.error("OpenAI controller error: #{controller_error.message}")
      Rails.logger.error(controller_error.backtrace.join("\n"))
      
      render json: {
        status: 'error',
        error: controller_error.message,
        error_type: controller_error.class.name,
        backtrace: Rails.env.development? ? controller_error.backtrace : nil
      }, status: :internal_server_error
    end
  end
  
  # GET /api/v1/tests/openai/test_connection
  def test_connection
    require 'openai'
    require 'net/http'
    
    api_key = ENV['OPENAI_API_KEY']
    
    # Get a preview of the API key for debugging
    api_key_preview = ""
    if api_key.present?
      # Get first and last few characters, but mask the rest
      api_key_preview = "#{api_key[0..3]}...#{api_key[-4..-1]}" 
    end
    
    result = {
      status: 'checking',
      api_key_exists: api_key.present?,
      api_key_length: api_key.to_s.length,
      api_key_preview: api_key_preview,
      timestamp: Time.now.to_s
    }
    
    # Try to decode the API key to check for format issues
    if api_key.present?
      result[:starts_with_sk] = api_key.to_s.start_with?('sk-')
      result[:contains_whitespace] = api_key.to_s.match?(/\s/)
      
      # Trim the API key if it has whitespace
      if result[:contains_whitespace]
        api_key = api_key.strip
        result[:trimmed_length] = api_key.length
      end
    end
    
    # Clean the API key (remove any non-printable characters)
    api_key = api_key.gsub(/[^[:print:]]/, '')
    
    # Try direct HTTP request
    begin
      result[:direct_http_test] = test_direct_http(api_key)
      
      # If direct HTTP test succeeds, we're good!
      if result[:direct_http_test][:code] == "200"
        result[:status] = 'success'
        result[:message] = "Direct HTTP test successful!"
      else
        result[:status] = 'error'
        result[:message] = "Direct HTTP test failed with status #{result[:direct_http_test][:code]}"
      end
    rescue => e
      result[:status] = 'error'
      result[:direct_http_error] = e.message
      result[:error_type] = e.class.name
      result[:backtrace] = e.backtrace.first(5) if Rails.env.development?
    end
    
    # Make sure we explicitly render JSON
    render json: result
  end
  
  private
  
  def test_direct_http(api_key)
    uri = URI('https://api.openai.com/v1/chat/completions')
    request = Net::HTTP::Post.new(uri)
    request['Content-Type'] = 'application/json'
    request['Authorization'] = "Bearer #{api_key}"
    
    request.body = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello in 5 words or less!" }
      ]
    }.to_json
    
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
    
    {
      code: response.code,
      message: response.message,
      body: response.body.length > 1000 ? "#{response.body[0...500]}..." : response.body
    }
  end
end