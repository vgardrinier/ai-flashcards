class Api::V1::QuizQuestionsController < ApplicationController
  # GET /api/v1/quiz_questions
  def index
    quiz_questions = QuizQuestion.includes(:category)
    
    # Filter by category if provided
    if params[:category_id].present?
      quiz_questions = quiz_questions.where(category_id: params[:category_id])
    end
    
    # Filter by difficulty if provided
    if params[:difficulty].present?
      quiz_questions = quiz_questions.where(difficulty: params[:difficulty])
    end
    
    render json: quiz_questions, include: :category
  end
  
  # GET /api/v1/quiz_questions/:id
  def show
    quiz_question = QuizQuestion.find(params[:id])
    render json: quiz_question, include: :category
  end
  
  # POST /api/v1/quiz_questions
  def create
    quiz_question = QuizQuestion.new(quiz_question_params)
    
    if quiz_question.save
      render json: quiz_question, status: :created
    else
      render json: { errors: quiz_question.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # POST /api/v1/quiz_questions/:id/attempt
  def attempt
    Rails.logger.info "Attempt action called with params: #{params.inspect}"
    Rails.logger.info "Request headers: #{request.headers.inspect}"
    Rails.logger.info "Request body: #{request.raw_post}"
    
    quiz_question = QuizQuestion.find(params[:id])
    Rails.logger.info "Found quiz question: #{quiz_question.id}"
    
    # Try to get parameters from different sources
    user_id = params[:user_id] || params.dig(:user_id) || begin
      body = JSON.parse(request.raw_post)
      body['user_id']
    rescue JSON::ParserError => e
      Rails.logger.error "Error parsing JSON: #{e.message}"
      nil
    end
    
    selected_option = params[:selected_option] || params.dig(:selected_option) || begin
      body = JSON.parse(request.raw_post)
      body['selected_option']
    rescue JSON::ParserError => e
      Rails.logger.error "Error parsing JSON: #{e.message}"
      nil
    end
    
    Rails.logger.info "Extracted parameters - user_id: #{user_id}, selected_option: #{selected_option}"
    
    # Validate required parameters
    if user_id.nil? || selected_option.nil?
      Rails.logger.error "Missing required parameters - user_id: #{user_id.nil? ? 'missing' : 'present'}, selected_option: #{selected_option.nil? ? 'missing' : 'present'}"
      render json: { 
        error: "Missing required parameters",
        details: {
          user_id: user_id.nil? ? "missing" : "present",
          selected_option: selected_option.nil? ? "missing" : "present"
        }
      }, status: :unprocessable_entity
      return
    end
    
    user = User.find_by(id: user_id)
    if user.nil?
      render json: { error: "User not found" }, status: :not_found
      return
    end
    
    attempt = QuizAttempt.new(
      user: user,
      quiz_question: quiz_question,
      selected_option: selected_option
    )
    
    if attempt.save
      render json: {
        data: {
          correct: attempt.correct,
          score_change: attempt.score_change
        }
      }
    else
      render json: { 
        data: {
          error: attempt.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: e.message }, status: :not_found
  rescue => e
    Rails.logger.error "Error in attempt action: #{e.message}"
    render json: { error: e.message }, status: :internal_server_error
  end
  
  private
  
  def quiz_question_params
    params.require(:quiz_question).permit(:question, :option_a, :option_b, :option_c, :option_d, :correct_option, :difficulty, :category_id)
  end
end
