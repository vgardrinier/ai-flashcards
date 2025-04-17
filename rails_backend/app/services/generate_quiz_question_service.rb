require 'openai'

class GenerateQuizQuestionService
  DEFAULT_MODEL = 'gpt-3.5-turbo'.freeze

  def initialize(category_id: nil, difficulty: nil)
    @category_id = category_id
    @difficulty = difficulty
  end

  def call
    client = OpenAI::Client.new(access_token: ENV.fetch('OPENAI_API_KEY'))
    response = client.chat(
      parameters: {
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates quiz questions.' },
          { role: 'user', content: build_prompt }
        ],
        temperature: 0.7
      }
    )
    content = response.dig('choices', 0, 'message', 'content')
    data = JSON.parse(content)
    category = find_or_create_category(data['category'])
    QuizQuestion.create!(
      question: data['question'],
      option_a: data['options']['A'],
      option_b: data['options']['B'],
      option_c: data['options']['C'],
      option_d: data['options']['D'],
      correct_option: data['correct_option'],
      explanation: data['explanation'],
      difficulty: data['difficulty'],
      category_id: @category_id || category.id
    )
  end

  private

  def build_prompt
    prompt = 'Generate a multiple-choice quiz question'
    prompt += " with difficulty #{@difficulty}" if @difficulty.present?
    if @category_id.present?
      category = Category.find_by(id: @category_id)
      prompt += " in the category #{category.name}" if category
    end
    prompt += ' as a JSON object with keys: question (string), options (object with keys A, B, C, D), '
    prompt += 'correct_option (one of A, B, C, D), explanation (string), difficulty (integer), category (string).'
    prompt
  end

  def find_or_create_category(name)
    Category.find_or_create_by(name: name)
  end
end