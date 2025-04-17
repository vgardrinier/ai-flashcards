import { QuizQuestion } from '../types/api';

export const quizQuestions: Record<string, Array<{
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
  explanation: string;
  category_id: number;
  difficulty: number;
}>> = {
  "AI Fundamentals": [
    {
      id: 1,
      question: "What is the key difference between supervised and unsupervised learning?",
      option_a: "Supervised learning requires labeled data, while unsupervised learning works with unlabeled data",
      option_b: "Supervised learning is faster than unsupervised learning",
      option_c: "Unsupervised learning always produces better results",
      option_d: "Supervised learning can only be used for classification tasks",
      correct_option: "a",
      explanation: "Supervised learning uses labeled data to train models, where each input has a corresponding output label. Unsupervised learning, on the other hand, works with unlabeled data to find patterns and structure without predefined outputs.",
      category_id: 1,
      difficulty: 2
    },
    {
      id: 2,
      question: "What is the purpose of a loss function in machine learning?",
      option_a: "To measure how well the model's predictions match the actual values",
      option_b: "To determine the learning rate of the model",
      option_c: "To select the best features for the model",
      option_d: "To initialize the model's parameters",
      correct_option: "a",
      explanation: "A loss function quantifies how far the model's predictions are from the actual values. It's used to guide the optimization process during training by providing a measure of model performance that needs to be minimized.",
      category_id: 1,
      difficulty: 2
    },
    {
      id: 3,
      question: "What is overfitting in machine learning?",
      option_a: "When a model performs well on training data but poorly on new, unseen data",
      option_b: "When a model takes too long to train",
      option_c: "When a model uses too many features",
      option_d: "When a model's predictions are always incorrect",
      correct_option: "a",
      explanation: "Overfitting occurs when a model learns the training data too well, including its noise and outliers, resulting in poor generalization to new data. This often happens when the model is too complex relative to the amount of training data available.",
      category_id: 1,
      difficulty: 3
    }
  ],
  "Neural Networks": [
    {
      id: 4,
      question: "What is the role of an activation function in a neural network?",
      option_a: "To introduce non-linearity into the network",
      option_b: "To speed up the training process",
      option_c: "To reduce the number of parameters",
      option_d: "To initialize the weights",
      correct_option: "a",
      explanation: "Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns and relationships in the data. Without activation functions, a neural network would only be able to learn linear relationships.",
      category_id: 2,
      difficulty: 3
    },
    {
      id: 5,
      question: "What is backpropagation?",
      option_a: "A method for calculating gradients and updating weights in a neural network",
      option_b: "A technique for visualizing neural network architectures",
      option_c: "A way to reduce the size of neural networks",
      option_d: "A method for initializing neural network weights",
      correct_option: "a",
      explanation: "Backpropagation is the algorithm used to train neural networks. It calculates the gradient of the loss function with respect to each weight by propagating the error backward through the network, allowing for efficient weight updates.",
      category_id: 2,
      difficulty: 3
    },
    {
      id: 6,
      question: "What is a convolutional neural network (CNN) primarily used for?",
      option_a: "Processing grid-like data such as images",
      option_b: "Processing sequential data",
      option_c: "Processing tabular data",
      option_d: "Processing text data",
      correct_option: "a",
      explanation: "CNNs are specifically designed to process grid-like data such as images. They use convolutional layers to automatically learn spatial hierarchies of features, making them particularly effective for computer vision tasks.",
      category_id: 2,
      difficulty: 4
    }
  ],
  "Natural Language Processing": [
    {
      id: 7,
      question: "What is the purpose of word embeddings in NLP?",
      option_a: "To represent words as dense vectors that capture semantic meaning",
      option_b: "To reduce the vocabulary size",
      option_c: "To speed up text processing",
      option_d: "To correct spelling errors",
      correct_option: "a",
      explanation: "Word embeddings represent words as dense vectors in a continuous vector space, where similar words are closer together. This representation captures semantic relationships between words and is fundamental to many NLP tasks.",
      category_id: 3,
      difficulty: 3
    },
    {
      id: 8,
      question: "What is the transformer architecture primarily known for?",
      option_a: "Its ability to process sequences in parallel and capture long-range dependencies",
      option_b: "Its small model size",
      option_c: "Its fast training speed",
      option_d: "Its ability to work without any training data",
      correct_option: "a",
      explanation: "The transformer architecture revolutionized NLP by introducing self-attention mechanisms that allow for parallel processing of sequences and better capture of long-range dependencies, leading to significant improvements in language understanding tasks.",
      category_id: 3,
      difficulty: 4
    },
    {
      id: 9,
      question: "What is the purpose of tokenization in NLP?",
      option_a: "To break down text into smaller units (tokens) for processing",
      option_b: "To translate text into different languages",
      option_c: "To remove all punctuation from text",
      option_d: "To make text more readable",
      correct_option: "a",
      explanation: "Tokenization is the process of breaking down text into smaller units called tokens, which can be words, subwords, or characters. This is a crucial first step in NLP pipelines as it converts raw text into a format that can be processed by machine learning models.",
      category_id: 3,
      difficulty: 2
    }
  ],
  "Ethics and Safety": [
    {
      id: 10,
      question: "What is algorithmic bias?",
      option_a: "Systematic and unfair discrimination in automated decision-making systems",
      option_b: "A type of machine learning algorithm",
      option_c: "A way to improve model accuracy",
      option_d: "A technique for data augmentation",
      correct_option: "a",
      explanation: "Algorithmic bias refers to systematic and unfair discrimination that can occur in automated decision-making systems. This often stems from biased training data or flawed assumptions in the algorithm design, leading to unfair outcomes for certain groups.",
      category_id: 4,
      difficulty: 2
    },
    {
      id: 11,
      question: "What is the purpose of AI explainability?",
      option_a: "To make AI systems' decisions understandable to humans",
      option_b: "To make AI systems run faster",
      option_c: "To reduce the size of AI models",
      option_d: "To make AI systems more accurate",
      correct_option: "a",
      explanation: "AI explainability aims to make the decision-making process of AI systems transparent and understandable to humans. This is crucial for building trust, ensuring accountability, and identifying potential biases or errors in AI systems.",
      category_id: 4,
      difficulty: 2
    },
    {
      id: 12,
      question: "What is the main concern with AI systems making autonomous decisions?",
      option_a: "The potential for unintended consequences and lack of human oversight",
      option_b: "The speed of decision-making",
      option_c: "The cost of implementation",
      option_d: "The energy consumption",
      correct_option: "a",
      explanation: "The main concern with autonomous AI systems is the potential for unintended consequences and the lack of human oversight in critical decision-making processes. This raises ethical questions about accountability, safety, and the alignment of AI systems with human values.",
      category_id: 4,
      difficulty: 3
    }
  ]
}; 