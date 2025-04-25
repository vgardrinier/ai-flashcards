namespace :content do
  desc "Load advanced AI content for the new categories"
  task load_advanced: :environment do
    puts "Loading advanced AI content..."
    load Rails.root.join('db', 'seeds', 'load_advanced_content.rb')
    puts "Advanced AI content loaded successfully!"
  end
  
  desc "Generate all missing content using OpenAI"
  task generate_missing: :environment do
    puts "This task will scan all categories and generate content for those without sufficient flashcards/questions."
    puts "Not implemented yet - coming soon!"
    # TODO: Implement OpenAI-based content generation for empty categories
  end
end