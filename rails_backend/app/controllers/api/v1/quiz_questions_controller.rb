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
  
  # POST /api/v1/quiz_questions/generate
  def generate
    count = (params[:count] || 1).to_i
    generated = []
    count.times do
      service = GenerateQuizQuestionService.new(
        category_id: params[:category_id],
        difficulty: params[:difficulty]
      )
      generated << service.call
    end
    render json: generated, include: :category, status: :created
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  # POST /api/v1/quiz_questions/:id/attempt
  def attempt
    begin
      user_id = params.require(:user_id)
      selected_option = params.require(:selected_option)
      difficulty = params[:difficulty]

      quiz_question = QuizQuestion.find(params[:id])
      user = User.find(user_id)

      quiz_attempt = QuizAttempt.new(
        user: user,
        quiz_question: quiz_question,
        selected_option: selected_option,
        difficulty: difficulty,
        correct: selected_option == quiz_question.correct_option
      )

      if quiz_attempt.save
        render json: {
          data: {
            correct: quiz_attempt.correct,
            score_change: quiz_attempt.score_change,
            explanation: quiz_question.explanation
          }
        }
      else
        render json: { errors: quiz_attempt.errors.full_messages }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound => e
      render json: { error: e.message }, status: :not_found
    rescue => e
      Rails.logger.error "Error in quiz attempt: #{e.message}\n#{e.backtrace.join("\n")}"
      render json: { error: e.message }, status: :internal_server_error
    end
  end
  
  private
  
  def quiz_question_params
    params.require(:quiz_question).permit(:question, :option_a, :option_b, :option_c, :option_d, :correct_option, :difficulty, :category_id)
  end

  def calculate_score_change(difficulty)
    base_score = 20
    difficulty_multiplier = case difficulty.to_i
      when 1 then 0.8  # Easy
      when 2 then 1.0  # Medium
      when 3 then 1.2  # Hard
      else 1.0
    end
    
    (base_score * difficulty_multiplier).round
  end
end
