puts "Creating Retrieval Augmented Generation (RAG) content..."

rag_category = Category.find_by(name: "Retrieval Augmented Generation (RAG)")

if rag_category
  # Sample flashcards for RAG
  flashcards = [
    {
      question: "What is Retrieval Augmented Generation (RAG)?",
      answer: "RAG is a technique that enhances large language models by retrieving relevant information from external knowledge sources during generation.",
      explanation: "RAG combines the strengths of retrieval-based and generation-based approaches. It retrieves relevant documents or passages from a knowledge base and provides them as context to the LLM, allowing it to generate more accurate, factual, and up-to-date responses."
    },
    {
      question: "What are the main components of a RAG system?",
      answer: "Retriever, knowledge base, and generator (LLM).",
      explanation: "A RAG system consists of: 1) A knowledge base or corpus of documents; 2) A retriever that finds relevant information from the knowledge base; 3) A generator (typically an LLM) that uses the retrieved information to produce outputs."
    },
    {
      question: "What is the main advantage of RAG over pure LLM generation?",
      answer: "It reduces hallucinations and improves factual accuracy by grounding the generation in retrieved information.",
      explanation: "By providing relevant external knowledge to the LLM, RAG helps the model generate responses that are more factually accurate and better aligned with trusted information sources, reducing the tendency of LLMs to fabricate information."
    },
    {
      question: "What is 'chunking' in the context of RAG?",
      answer: "The process of breaking down documents into smaller, manageable pieces for efficient retrieval and relevance matching.",
      explanation: "Chunking involves splitting documents into smaller segments (paragraphs, sentences, or fixed-length passages) that can be independently indexed, retrieved, and processed. The size and method of chunking significantly impact RAG system performance."
    },
    {
      question: "What is vector similarity search in RAG systems?",
      answer: "A technique that converts text into numerical vectors and finds the most similar vectors in a database based on distance metrics.",
      explanation: "Vector similarity search encodes text chunks into dense vector representations (embeddings) and then identifies the most relevant chunks by finding vectors with the smallest distance (or highest similarity) to the query vector in the embedding space."
    }
  ]
  
  # Create flashcards
  flashcards.each do |flashcard_data|
    Flashcard.find_or_create_by!(
      question: flashcard_data[:question],
      category: rag_category
    ) do |flashcard|
      flashcard.answer = flashcard_data[:answer]
      flashcard.explanation = flashcard_data[:explanation]
      puts "  Created flashcard: #{flashcard_data[:question]}"
    end
  end
  
  # Sample quiz questions for RAG
  quiz_questions = [
    {
      question: "Which of these is NOT a common retrieval method in RAG systems?",
      option_a: "Dense retrieval with embeddings",
      option_b: "BM25 keyword search",
      option_c: "Neural network pruning",
      option_d: "Hybrid (dense + sparse) retrieval",
      correct_option: "c",
      explanation: "Neural network pruning is a technique used to make neural networks more efficient by removing unnecessary weights, not a retrieval method in RAG systems. The other options are all common retrieval methods in RAG.",
      difficulty: 2
    },
    {
      question: "What is 'retrieval fusion' in RAG systems?",
      option_a: "Combining multiple retrieved documents into one",
      option_b: "Merging results from different retrieval methods",
      option_c: "Integrating LLM outputs with retrieved text",
      option_d: "Compressing retrieved contexts to save tokens",
      correct_option: "b",
      explanation: "Retrieval fusion refers to combining results from multiple retrieval methods (e.g., semantic search, keyword search, and metadata filtering) to improve overall retrieval quality and diversity.",
      difficulty: 3
    },
    {
      question: "Which metric is most commonly used to evaluate the relevance of retrieved documents in RAG?",
      option_a: "ROUGE score",
      option_b: "BLEU score",
      option_c: "Mean Reciprocal Rank (MRR)",
      option_d: "Cosine similarity",
      correct_option: "c",
      explanation: "Mean Reciprocal Rank (MRR) is commonly used to evaluate retrieval quality in RAG systems by measuring how high the first relevant document appears in the ranked list of retrieved documents. ROUGE and BLEU are generation metrics, while cosine similarity is used for vector comparisons.",
      difficulty: 4
    },
    {
      question: "What is the primary challenge in implementing RAG for domain-specific applications?",
      option_a: "Creating a high-quality, relevant knowledge base",
      option_b: "Finding sufficiently powerful LLMs",
      option_c: "Managing GPU memory constraints",
      option_d: "Implementing the retrieval algorithm",
      correct_option: "a",
      explanation: "The most significant challenge in domain-specific RAG implementations is creating a high-quality knowledge base with relevant, accurate, and up-to-date information. Without good source documents, even the best retrieval methods cannot provide useful context to the LLM.",
      difficulty: 3
    },
    {
      question: "How does RAG help with the 'knowledge cutoff' problem in LLMs?",
      option_a: "By increasing the context window size",
      option_b: "By fine-tuning the model on newer data",
      option_c: "By providing access to external, up-to-date information",
      option_d: "By using multiple LLMs in parallel",
      correct_option: "c",
      explanation: "RAG helps overcome the knowledge cutoff limitation of LLMs by retrieving information from external, updatable knowledge sources, allowing access to information that was not available during the model's training period.",
      difficulty: 2
    }
  ]
  
  # Create quiz questions
  quiz_questions.each do |quiz_data|
    QuizQuestion.find_or_create_by!(
      question: quiz_data[:question],
      category: rag_category
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
  
  puts "Completed creating RAG content"
else
  puts "Error: RAG category not found!"
end