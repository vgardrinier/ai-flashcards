puts "Creating Multimodal AI content..."

multimodal_category = Category.find_by(name: "Multimodal AI")

if multimodal_category
  # Sample flashcards for Multimodal AI
  flashcards = [
    {
      question: "What is multimodal AI?",
      answer: "Multimodal AI refers to AI systems that can process and generate content across multiple types of data or 'modalities' such as text, images, audio, and video.",
      explanation: "Unlike unimodal AI systems that work with only one type of data (e.g., text-only or image-only), multimodal AI can understand relationships between different data types and perform tasks that require integrating information across modalities."
    },
    {
      question: "What is cross-modal transfer learning?",
      answer: "The technique of using knowledge gained from training on one modality to improve performance on tasks involving another modality.",
      explanation: "Cross-modal transfer learning enables AI models to leverage patterns and representations learned from one data type (e.g., images) to better understand or generate content in another data type (e.g., text), leading to more efficient learning and better performance across modalities."
    },
    {
      question: "What are embeddings in multimodal AI?",
      answer: "Numerical vector representations that encode information from different modalities in a shared latent space where semantic relationships can be preserved.",
      explanation: "Multimodal embeddings allow different types of data (text, images, audio) to be represented in a common mathematical space where similar concepts are positioned close together regardless of their original modality, enabling cross-modal operations like text-to-image search."
    },
    {
      question: "What is vision-language pre-training?",
      answer: "A training approach where AI models learn joint representations of images and text through self-supervised or weakly supervised objectives on paired image-text data.",
      explanation: "Vision-language pre-training creates foundation models that understand relationships between visual and textual content by training on large datasets of image-text pairs, often using contrastive learning to align visual and textual representations in the same semantic space."
    },
    {
      question: "What is multimodal fusion?",
      answer: "The process of combining information from multiple modalities to make predictions or generate outputs that leverage complementary information across modalities.",
      explanation: "Multimodal fusion can be early (inputs are combined before processing), late (separate predictions from each modality are combined), or intermediate (representations are fused at various processing stages). The fusion strategy significantly impacts how effectively the model integrates cross-modal information."
    }
  ]
  
  # Create flashcards
  flashcards.each do |flashcard_data|
    Flashcard.find_or_create_by!(
      question: flashcard_data[:question],
      category: multimodal_category
    ) do |flashcard|
      flashcard.answer = flashcard_data[:answer]
      flashcard.explanation = flashcard_data[:explanation]
      puts "  Created flashcard: #{flashcard_data[:question]}"
    end
  end
  
  # Sample quiz questions for Multimodal AI
  quiz_questions = [
    {
      question: "Which of the following is an example of a multimodal AI application?",
      option_a: "A text-only sentiment analyzer",
      option_b: "An image classifier for medical scans",
      option_c: "A visual question answering system",
      option_d: "A speech-to-text transcription service",
      correct_option: "c",
      explanation: "Visual question answering (VQA) is a multimodal application that requires processing both image and text inputs to generate text outputs. The other options (sentiment analysis, image classification, and speech recognition) are unimodal applications that work with a single data type.",
      difficulty: 1
    },
    {
      question: "What is a key challenge in multimodal learning?",
      option_a: "Different modalities have different statistical properties",
      option_b: "Single modality datasets are too small",
      option_c: "Computing resources are insufficient",
      option_d: "Supervised learning doesn't work with multiple modalities",
      correct_option: "a",
      explanation: "A key challenge in multimodal learning is that different modalities (text, images, audio) have fundamentally different statistical properties, distributions, and structures, making it difficult to create unified representations that effectively capture information from all modalities.",
      difficulty: 3
    },
    {
      question: "Which architecture is commonly used for encoding both images and text in modern multimodal models?",
      option_a: "GAN (Generative Adversarial Network)",
      option_b: "Transformer",
      option_c: "LSTM (Long Short-Term Memory)",
      option_d: "ResNet (Residual Network)",
      correct_option: "b",
      explanation: "Transformer architectures have become the dominant approach for multimodal models due to their effectiveness in modeling sequences and their ability to handle both text (e.g., BERT) and images (e.g., Vision Transformer). Models like CLIP, DALL-E, and Flamingo use transformers to process both visual and textual data.",
      difficulty: 2
    },
    {
      question: "What does 'grounding' refer to in multimodal AI?",
      option_a: "Connecting neural network layers to prevent vanishing gradients",
      option_b: "Anchoring language understanding in visual or physical context",
      option_c: "Implementing electrical safety features in AI hardware",
      option_d: "Reducing model bias through data normalization",
      correct_option: "b",
      explanation: "In multimodal AI, grounding refers to anchoring language understanding in visual, physical, or experiential context. It enables models to connect abstract language concepts to their real-world referents and is crucial for applications like visual dialogue, embodied AI, and robot instruction following.",
      difficulty: 3
    },
    {
      question: "Which evaluation metric is specifically designed for multimodal generation tasks?",
      option_a: "BLEU score",
      option_b: "Mean Average Precision (MAP)",
      option_c: "CLIPScore",
      option_d: "ROUGE-L",
      correct_option: "c",
      explanation: "CLIPScore uses CLIP (Contrastive Language-Image Pre-training) to measure the semantic similarity between generated images and their text descriptions, making it specifically designed for evaluating text-to-image generation quality. BLEU and ROUGE are text-only metrics, while MAP is a ranking metric not specific to multimodal tasks.",
      difficulty: 4
    }
  ]
  
  # Create quiz questions
  quiz_questions.each do |quiz_data|
    QuizQuestion.find_or_create_by!(
      question: quiz_data[:question],
      category: multimodal_category
    ) do |quiz|
      quiz.option_a = quiz_data[:option_a]
      quiz.option_b = quiz_data[:option_b]
      quiz.option_c = quiz_data[:option_c]
      quiz.option_d = quiz_data[:option_d]
      quiz.correct_option = quiz_data[:correct_option]
      quiz.explanation = quiz_data[:explanation]
      quiz.difficulty = quiz_data[:difficulty]
      puts "  Created quiz question: #{quiz_data[:question]}"
    end
  end
  
  puts "Completed creating Multimodal AI content"
else
  puts "Error: Multimodal AI category not found!"
end