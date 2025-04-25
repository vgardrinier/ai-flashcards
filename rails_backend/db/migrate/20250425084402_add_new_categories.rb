class AddNewCategories < ActiveRecord::Migration[7.1]
  def up
    # Add new advanced categories
    new_categories = [
      {
        name: "Retrieval Augmented Generation (RAG)",
        description: "Techniques for enhancing LLMs by retrieving external knowledge during generation"
      },
      {
        name: "Multimodal AI",
        description: "AI systems that can process and generate multiple types of data (text, images, audio, video)"
      },
      {
        name: "AI Hardware Acceleration",
        description: "Hardware technologies and architectures optimized for AI workloads"
      },
      {
        name: "MLOps",
        description: "Practices and tools for managing the ML lifecycle in production environments"
      },
      {
        name: "Fine-tuning & PEFT",
        description: "Techniques for adapting pre-trained models to specific tasks with parameter-efficient methods"
      },
      {
        name: "Responsible AI",
        description: "Ethical considerations, bias mitigation, and responsible deployment of AI systems"
      },
      {
        name: "AI Evaluation Metrics",
        description: "Methods and metrics for measuring AI system performance, bias, and alignment"
      }
    ]
    
    # Add categories if they don't exist
    new_categories.each do |category_data|
      # Skip if category already exists
      next if Category.exists?(name: category_data[:name])
      
      # Create category
      Category.create!(category_data)
      puts "Created category: #{category_data[:name]}"
    end
  end
  
  def down
    # Define categories to remove
    categories_to_remove = [
      "Retrieval Augmented Generation (RAG)",
      "Multimodal AI",
      "AI Hardware Acceleration",
      "MLOps",
      "Fine-tuning & PEFT",
      "Responsible AI",
      "AI Evaluation Metrics"
    ]
    
    # Remove categories
    categories_to_remove.each do |name|
      category = Category.find_by(name: name)
      if category
        # Remove associated content (quiz questions and flashcards)
        QuizQuestion.where(category_id: category.id).destroy_all
        Flashcard.where(category_id: category.id).destroy_all
        category.destroy
        puts "Removed category: #{name}"
      end
    end
  end
end
