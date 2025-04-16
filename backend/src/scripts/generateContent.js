// Script to generate AI flashcards and quiz questions
const fs = require('fs');
const path = require('path');

// Read research data files
const readResearchFile = (filename) => {
  try {
    return fs.readFileSync(path.join(__dirname, '..', '..', 'data', filename), 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    return '';
  }
};

// Neural Networks content
const neuralNetworksContent = readResearchFile('neural_networks.md');

// Large Language Models content
const llmContent = readResearchFile('large_language_models.md');

// AI Agents content
const aiAgentsContent = readResearchFile('ai_agents.md');

// Tech CTO Skills content
const ctoSkillsContent = readResearchFile('tech_cto_skills.md');

// Generate flashcards and quiz questions
const generateContent = () => {
  const flashcards = [];
  const quizQuestions = [];
  
  // AI Fundamentals flashcards
  const aiFundamentalsFlashcards = [
    {
      question: "What is a neural network?",
      answer: "A neural network is a computational model inspired by the human brain that consists of layers of interconnected nodes (neurons) that process and transform input data to produce an output.",
      explanation: "Neural networks are the foundation of deep learning and are used for tasks like image recognition, natural language processing, and more. They learn by adjusting the weights of connections between neurons based on training data.",
      category_id: "AI Fundamentals",
      difficulty: 1,
      tags: ["Neural Networks", "Deep Learning", "AI Basics"]
    },
    {
      question: "What is the difference between supervised and unsupervised learning?",
      answer: "Supervised learning uses labeled training data with known outputs, while unsupervised learning works with unlabeled data to find patterns or structures without predefined outputs.",
      explanation: "In supervised learning, the algorithm learns to map inputs to known outputs (like classifying images of cats and dogs). In unsupervised learning, the algorithm discovers patterns in data without explicit guidance (like clustering similar customers).",
      category_id: "AI Fundamentals",
      difficulty: 2,
      tags: ["Machine Learning", "Learning Types", "AI Basics"]
    },
    {
      question: "What is backpropagation in neural networks?",
      answer: "Backpropagation is an algorithm used to train neural networks by calculating gradients of the loss function with respect to the network weights, propagating error backwards through the network to update weights.",
      explanation: "During training, backpropagation uses the chain rule from calculus to efficiently compute how each weight contributes to the overall error, allowing the network to adjust weights to minimize error in future predictions.",
      category_id: "AI Fundamentals",
      difficulty: 3,
      tags: ["Neural Networks", "Training", "Algorithms"]
    },
    {
      question: "What is the vanishing gradient problem?",
      answer: "The vanishing gradient problem occurs when gradients become extremely small during backpropagation in deep neural networks, making it difficult for earlier layers to learn effectively.",
      explanation: "This problem particularly affects deep networks with sigmoid or tanh activation functions. As gradients are multiplied during backpropagation, they can become vanishingly small, effectively preventing weight updates in early layers. Solutions include using ReLU activations, skip connections, and batch normalization.",
      category_id: "AI Fundamentals",
      difficulty: 4,
      tags: ["Neural Networks", "Deep Learning", "Training Challenges"]
    },
    {
      question: "What is the purpose of an activation function in neural networks?",
      answer: "Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns and relationships in data that couldn't be modeled with just linear combinations.",
      explanation: "Without activation functions, a neural network would be equivalent to a linear regression model regardless of its depth. Common activation functions include ReLU, sigmoid, and tanh, each with different properties and use cases.",
      category_id: "AI Fundamentals",
      difficulty: 2,
      tags: ["Neural Networks", "Activation Functions", "Deep Learning"]
    }
  ];
  
  // Add more AI Fundamentals flashcards
  aiFundamentalsFlashcards.push(
    {
      question: "What is the difference between AI, Machine Learning, and Deep Learning?",
      answer: "AI is the broader concept of machines being able to carry out tasks intelligently. Machine Learning is a subset of AI where machines learn from data. Deep Learning is a subset of Machine Learning using neural networks with many layers.",
      explanation: "These terms form a hierarchy: Deep Learning ⊂ Machine Learning ⊂ Artificial Intelligence. AI includes any technique that enables computers to mimic human intelligence. ML focuses specifically on algorithms that improve through experience. Deep Learning uses multi-layered neural networks to automatically extract features from data.",
      category_id: "AI Fundamentals",
      difficulty: 1,
      tags: ["AI Basics", "Machine Learning", "Deep Learning"]
    },
    {
      question: "What is the bias-variance tradeoff in machine learning?",
      answer: "The bias-variance tradeoff is the balance between a model's ability to fit training data (low bias) and its ability to generalize to new data (low variance).",
      explanation: "High bias models are too simple and underfit the data, missing important patterns. High variance models are too complex and overfit the data, capturing noise rather than true patterns. Finding the right balance is crucial for creating models that perform well on unseen data.",
      category_id: "AI Fundamentals",
      difficulty: 3,
      tags: ["Machine Learning", "Model Evaluation", "Statistical Learning"]
    },
    {
      question: "What is a convolutional neural network (CNN) and what is it used for?",
      answer: "A CNN is a specialized neural network architecture that uses convolutional layers to automatically extract features from grid-like data, primarily used for image processing and computer vision tasks.",
      explanation: "CNNs use filters that slide over input data to detect patterns like edges, textures, and shapes. They incorporate pooling layers to reduce dimensionality and fully connected layers for classification. CNNs have revolutionized image classification, object detection, facial recognition, and other visual tasks.",
      category_id: "AI Fundamentals",
      difficulty: 3,
      tags: ["Neural Networks", "Computer Vision", "Deep Learning"]
    },
    {
      question: "What is transfer learning in deep learning?",
      answer: "Transfer learning is a technique where a model developed for one task is reused as the starting point for a model on a second task, leveraging knowledge gained from the first task to improve performance or reduce training time.",
      explanation: "Instead of starting from scratch, transfer learning allows you to use pre-trained models (like BERT for NLP or ResNet for images) and fine-tune them for specific tasks. This is especially valuable when you have limited training data or computational resources.",
      category_id: "AI Fundamentals",
      difficulty: 3,
      tags: ["Deep Learning", "Training Techniques", "Model Optimization"]
    },
    {
      question: "What is reinforcement learning?",
      answer: "Reinforcement learning is a type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize cumulative rewards.",
      explanation: "Unlike supervised learning, reinforcement learning doesn't require labeled data. Instead, the agent learns through trial and error, receiving feedback in the form of rewards or penalties. This approach has been used to master games like chess and Go, control robots, and optimize resource allocation.",
      category_id: "AI Fundamentals",
      difficulty: 2,
      tags: ["Reinforcement Learning", "Machine Learning", "Decision Making"]
    }
  );
  
  // LLM flashcards
  const llmFlashcards = [
    {
      question: "What is a transformer architecture in the context of LLMs?",
      answer: "The transformer architecture is a neural network design that relies on self-attention mechanisms instead of recurrence or convolution, allowing models to process all words in a sequence simultaneously while considering their relationships.",
      explanation: "Introduced in the 'Attention Is All You Need' paper, transformers revolutionized NLP by enabling parallel processing and capturing long-range dependencies more effectively than RNNs or CNNs. The architecture consists of encoder and decoder blocks with multi-head attention mechanisms and is the foundation of models like BERT, GPT, and T5.",
      category_id: "Large Language Models",
      difficulty: 3,
      tags: ["Transformers", "Architecture", "NLP"]
    },
    {
      question: "What is self-attention in transformer models?",
      answer: "Self-attention is a mechanism that allows a model to weigh the importance of different words in a sequence relative to each other, enabling the model to focus on relevant parts of the input when making predictions.",
      explanation: "In self-attention, each word in a sequence is represented by a query, key, and value vector. The dot product between a word's query and all keys determines attention weights, which are used to create a weighted sum of values. This allows the model to capture contextual relationships regardless of distance in the sequence.",
      category_id: "Large Language Models",
      difficulty: 4,
      tags: ["Transformers", "Attention Mechanisms", "NLP"]
    },
    {
      question: "What is the difference between encoder-only, decoder-only, and encoder-decoder transformer models?",
      answer: "Encoder-only models (like BERT) are best for understanding tasks, decoder-only models (like GPT) excel at generation tasks, and encoder-decoder models (like T5) are designed for sequence-to-sequence tasks like translation.",
      explanation: "Encoder-only models process the entire input bidirectionally and are ideal for classification and understanding. Decoder-only models generate text autoregressively (one token at a time) with access only to previous tokens. Encoder-decoder models first encode the input sequence, then the decoder generates the output sequence with attention to the encoded representation.",
      category_id: "Large Language Models",
      difficulty: 3,
      tags: ["Transformers", "Model Architecture", "NLP"]
    },
    {
      question: "What is prompt engineering?",
      answer: "Prompt engineering is the practice of designing and optimizing input prompts to effectively communicate with and elicit desired responses from large language models.",
      explanation: "As LLMs are sensitive to how questions are phrased, prompt engineering involves crafting inputs that provide context, constraints, examples, or specific instructions to guide the model's responses. Techniques include few-shot learning, chain-of-thought prompting, and system prompts that define the model's role or behavior.",
      category_id: "Large Language Models",
      difficulty: 2,
      tags: ["Prompting", "LLM Interaction", "NLP"]
    },
    {
      question: "What is fine-tuning in the context of LLMs?",
      answer: "Fine-tuning is the process of further training a pre-trained language model on a specific dataset to adapt it for particular tasks, domains, or styles.",
      explanation: "While pre-training gives LLMs general language understanding, fine-tuning customizes them for specific applications. This involves updating model weights using a smaller, task-specific dataset. Techniques like parameter-efficient fine-tuning (e.g., LoRA, adapters) allow customization with fewer computational resources by updating only a subset of parameters.",
      category_id: "Large Language Models",
      difficulty: 3,
      tags: ["Training", "Model Adaptation", "NLP"]
    }
  ];
  
  // Add more LLM flashcards
  llmFlashcards.push(
    {
      question: "What is the token limit in LLMs and why does it matter?",
      answer: "The token limit is the maximum number of tokens (word pieces) an LLM can process in a single context window, constraining how much text it can consider at once.",
      explanation: "Token limits (e.g., 4K, 8K, or 32K tokens) determine how much information the model can access for a given task. This affects the model's ability to handle long documents, maintain context in conversations, or process complex instructions with examples. Exceeding the token limit requires techniques like chunking, summarization, or using retrieval-augmented generation.",
      category_id: "Large Language Models",
      difficulty: 2,
      tags: ["Model Limitations", "Context Window", "NLP"]
    },
    {
      question: "What is retrieval-augmented generation (RAG)?",
      answer: "Retrieval-augmented generation is a technique that enhances LLM outputs by first retrieving relevant information from external knowledge sources and then using that information to generate more accurate and informed responses.",
      explanation: "RAG combines the strengths of retrieval systems (access to up-to-date or domain-specific information) with the generative capabilities of LLMs. This helps overcome knowledge cutoffs, reduces hallucinations, and enables models to reference specific documents or data sources that weren't in their training data.",
      category_id: "Large Language Models",
      difficulty: 3,
      tags: ["RAG", "Knowledge Retrieval", "Model Enhancement"]
    },
    {
      question: "What are embedding models and how do they relate to LLMs?",
      answer: "Embedding models convert text into numerical vector representations that capture semantic meaning, enabling similarity comparisons and serving as the foundation for retrieval systems that enhance LLMs.",
      explanation: "While LLMs generate text, embedding models transform text into dense vector spaces where similar concepts are positioned close together. These embeddings power semantic search, clustering, and retrieval systems that can feed relevant information to LLMs. Models like OpenAI's text-embedding-ada-002 or sentence-transformers create these vector representations.",
      category_id: "Large Language Models",
      difficulty: 3,
      tags: ["Embeddings", "Vector Representations", "Semantic Search"]
    },
    {
      question: "What is the hallucination problem in LLMs?",
      answer: "Hallucination refers to LLMs generating content that sounds plausible but is factually incorrect, misleading, or entirely fabricated, not supported by their training data or provided context.",
      explanation: "LLMs optimize for generating fluent, plausible-sounding text rather than factual accuracy. This can lead to confidently stated falsehoods, especially when models are prompted about topics beyond their knowledge. Mitigation strategies include retrieval-augmented generation, grounding techniques, and explicit uncertainty expressions.",
      category_id: "Large Language Models",
      difficulty: 3,
      tags: ["Model Limitations", "Factuality", "Reliability"]
    },
    {
      question: "What is chain-of-thought prompting?",
      answer: "Chain-of-thought prompting is a technique that encourages LLMs to break down complex reasoning tasks into intermediate steps, improving performance on problems requiring multi-step logical thinking.",
      explanation: "By prompting models to 'think step by step' or providing examples that demonstrate reasoning processes, chain-of-thought elicits more structured thinking. This technique has significantly improved LLM performance on mathematical problems, logical reasoning, and complex decision-making tasks by making the model's reasoning process explicit.",
      category_id: "Large Language Models",
      difficulty: 2,
      tags: ["Prompting Techniques", "Reasoning", "Model Performance"]
    }
  );
  
  // AI Agents flashcards
  const aiAgentsFlashcards = [
    {
      question: "What is an AI agent?",
      answer: "An AI agent is a system that perceives its environment through sensors, makes decisions based on those perceptions, and acts upon the environment through actuators to achieve specific goals.",
      explanation: "AI agents combine perception, reasoning, and action in a continuous cycle. They can range from simple rule-based systems to complex autonomous entities using advanced ML models. The key characteristic is their ability to operate independently to accomplish tasks, adapting their behavior based on feedback from the environment.",
      category_id: "AI Agents",
      difficulty: 1,
      tags: ["Agents", "Autonomous Systems", "AI Basics"]
    },
    {
      question: "What is the difference between a reactive agent and a deliberative agent?",
      answer: "Reactive agents respond directly to current perceptions without maintaining internal state or planning ahead, while deliberative agents maintain world models, reason about possible actions, and plan sequences of actions to achieve goals.",
      explanation: "Reactive agents follow simple stimulus-response patterns and excel in fast-changing environments where quick reactions matter more than optimal decisions. Deliberative agents use internal representations to simulate outcomes of different action sequences, enabling more sophisticated problem-solving but requiring more computational resources.",
      category_id: "AI Agents",
      difficulty: 3,
      tags: ["Agent Types", "Decision Making", "Planning"]
    },
    {
      question: "What is the OODA loop in the context of AI agents?",
      answer: "The OODA loop (Observe, Orient, Decide, Act) is a decision cycle that describes how agents process information and take action, continuously cycling through observing the environment, orienting to understand the situation, deciding on a response, and acting.",
      explanation: "Originally developed for military strategy, the OODA loop provides a framework for agent decision-making. Effective agents minimize the time through this loop while maximizing the quality of decisions. Advanced AI agents may run multiple OODA loops in parallel or at different time scales for different aspects of their operation.",
      category_id: "AI Agents",
      difficulty: 2,
      tags: ["Decision Making", "Agent Architecture", "Cognitive Models"]
    },
    {
      question: "What is the role of planning in AI agents?",
      answer: "Planning enables AI agents to determine sequences of actions that will achieve their goals, considering future states and potential obstacles rather than just reacting to the current situation.",
      explanation: "Planning involves searching through possible future states to find paths to goal states. Techniques range from classical planning algorithms like A* to hierarchical planning that breaks complex goals into subgoals. Modern agents often combine planning with learning, using experience to improve plan quality and efficiency.",
      category_id: "AI Agents",
      difficulty: 3,
      tags: ["Planning", "Goal-Oriented Behavior", "Decision Making"]
    },
    {
      question: "What is the difference between single-agent and multi-agent systems?",
      answer: "Single-agent systems involve one autonomous agent operating in an environment, while multi-agent systems involve multiple agents that interact with each other, potentially cooperating, competing, or negotiating to achieve individual or collective goals.",
      explanation: "Multi-agent systems introduce complexities like coordination, communication protocols, and strategic interactions not present in single-agent systems. They can model social dynamics, markets, or distributed problem-solving. Challenges include ensuring system-wide stability, preventing destructive competition, and designing effective coordination mechanisms.",
      category_id: "AI Agents",
      difficulty: 2,
      tags: ["Multi-Agent Systems", "Agent Interaction", "Coordination"]
    }
  ];
  
  // Add more AI Agents flashcards
  aiAgentsFlashcards.push(
    {
      question: "What is the BDI (Belief-Desire-Intention) architecture for intelligent agents?",
      answer: "BDI is an agent architecture that models agents with three mental attitudes: beliefs (information about the world), desires (goals or objectives), and intentions (committed plans of action).",
      explanation: "The BDI model provides a framework for practical reasoning in agents. Beliefs represent the agent's knowledge about its environment, desires represent its motivational state, and intentions represent deliberative states—plans the agent has committed to execute. This architecture balances goal-directed behavior with responsiveness to environmental changes.",
      category_id: "AI Agents",
      difficulty: 4,
      tags: ["Agent Architecture", "Cognitive Models", "Planning"]
    },
    {
      question: "What is reinforcement learning in the context of AI agents?",
      answer: "Reinforcement learning is a training approach where agents learn optimal behavior through trial-and-error interactions with an environment, receiving rewards or penalties based on their actions.",
      explanation: "Unlike supervised learning, reinforcement learning doesn't require labeled examples of correct behavior. Instead, agents discover which actions yield the most reward through exploration. Over time, they develop policies (strategies) that maximize cumulative rewards. This approach has powered breakthroughs in game playing, robotics, and autonomous systems.",
      category_id: "AI Agents",
      difficulty: 2,
      tags: ["Reinforcement Learning", "Training", "Decision Making"]
    },
    {
      question: "What is the role of LLMs in modern AI agents?",
      answer: "LLMs serve as the reasoning engine for modern AI agents, enabling natural language understanding, planning, decision-making, and generating human-like responses based on goals and context.",
      explanation: "LLMs have transformed agent capabilities by providing a general-purpose reasoning layer that can interpret instructions, generate plans, explain decisions, and interact naturally with humans. They allow agents to process unstructured information and leverage world knowledge embedded in their parameters, though they typically need to be augmented with tools and structured components for reliable task execution.",
      category_id: "AI Agents",
      difficulty: 3,
      tags: ["LLM Agents", "Natural Language", "Reasoning"]
    },
    {
      question: "What is tool use in AI agents?",
      answer: "Tool use refers to an agent's ability to leverage external functions, APIs, or systems to extend its capabilities beyond its core model, enabling it to perform specialized tasks or access external information.",
      explanation: "Modern AI agents can be equipped with a toolkit of functions they can call when appropriate, such as web search, code execution, database queries, or external APIs. The agent learns to select the right tool for each subtask, formulate appropriate inputs, and interpret the results to progress toward its goals.",
      category_id: "AI Agents",
      difficulty: 3,
      tags: ["Tool Use", "Function Calling", "Agent Capabilities"]
    },
    {
      question: "What is the ReAct (Reasoning + Acting) framework for LLM agents?",
      answer: "ReAct is an agent framework that interleaves reasoning and acting, having the LLM verbalize its thought process before taking actions and then reflecting on the results to inform subsequent steps.",
      explanation: "ReAct improves agent performance by making reasoning explicit. The agent first thinks about what to do and why (reasoning trace), then executes an action, observes the result, and incorporates this feedback into its next reasoning step. This approach reduces errors, improves planning, and creates more transparent decision-making processes.",
      category_id: "AI Agents",
      difficulty: 3,
      tags: ["Agent Frameworks", "Reasoning", "Decision Making"]
    }
  );
  
  // CTO Skills flashcards
  const ctoSkillsFlashcards = [
    {
      question: "What is the role of a CTO in an AI startup?",
      answer: "A CTO in an AI startup leads technical strategy and execution, balancing innovation with practical implementation, making architectural decisions, building technical teams, and translating business requirements into technical solutions.",
      explanation: "Beyond general CTO responsibilities, AI startup CTOs need deep understanding of ML/AI technologies, data infrastructure, and the rapidly evolving AI landscape. They must evaluate which problems truly require AI solutions, select appropriate technologies, ensure ethical AI development, and create processes for model development, evaluation, and deployment.",
      category_id: "Tech CTO Skills",
      difficulty: 2,
      tags: ["Leadership", "Technical Strategy", "Startup Roles"]
    },
    {
      question: "What is MLOps and why is it important for AI startups?",
      answer: "MLOps (Machine Learning Operations) is a set of practices that combines ML, DevOps, and data engineering to deploy and maintain ML models in production reliably and efficiently.",
      explanation: "MLOps addresses the unique challenges of operationalizing ML systems, including reproducibility, versioning (of data, code, and models), monitoring, and governance. For AI startups, effective MLOps practices reduce time-to-market, improve model quality, enable continuous improvement, and help manage technical debt as the company scales.",
      category_id: "Tech CTO Skills",
      difficulty: 3,
      tags: ["MLOps", "Production AI", "Technical Infrastructure"]
    },
    {
      question: "What is the difference between AI infrastructure for research vs. production?",
      answer: "Research infrastructure prioritizes experimentation, flexibility, and raw computational power, while production infrastructure emphasizes reliability, scalability, latency, cost-efficiency, and operational monitoring.",
      explanation: "Research environments need powerful GPUs/TPUs, flexible frameworks, and tools for rapid iteration. Production requires robust CI/CD pipelines, efficient serving infrastructure, monitoring systems, and often edge deployment capabilities. A CTO must design both systems and create smooth pathways from research to production to avoid the common 'model doesn't work in production' problem.",
      category_id: "Tech CTO Skills",
      difficulty: 4,
      tags: ["Infrastructure", "Production AI", "Research"]
    },
    {
      question: "What is technical debt in AI systems and how should CTOs manage it?",
      answer: "Technical debt in AI systems includes experimental code that becomes production, outdated models, data drift, poor documentation, and infrastructure complexity that accumulates over time, slowing development and increasing maintenance costs.",
      explanation: "CTOs should implement practices like regular refactoring, comprehensive testing, documentation standards, model monitoring, and technical debt sprints. AI-specific strategies include versioning data and models, maintaining reproducible pipelines, monitoring for data/concept drift, and planning for model retraining and updates.",
      category_id: "Tech CTO Skills",
      difficulty: 3,
      tags: ["Technical Debt", "Engineering Practices", "Maintenance"]
    },
    {
      question: "What is the 'build vs. buy' decision framework for AI components?",
      answer: "The 'build vs. buy' framework helps CTOs decide whether to develop AI components in-house or use third-party solutions, considering factors like strategic differentiation, expertise requirements, time-to-market, cost, and control needs.",
      explanation: "CTOs should build in-house when the AI capability is a core competitive advantage, requires proprietary data, or needs deep customization. They should buy or use APIs when the capability is standardized, when specialized expertise is scarce, or when rapid deployment is critical. Many successful AI startups use a hybrid approach, building their core differentiators while leveraging external solutions for non-core components.",
      category_id: "Tech CTO Skills",
      difficulty: 3,
      tags: ["Strategic Decisions", "Resource Allocation", "Technology Selection"]
    }
  ];
  
  // Add more CTO Skills flashcards
  ctoSkillsFlashcards.push(
    {
      question: "What is the role of a data strategy in AI startups?",
      answer: "A data strategy defines how a company collects, stores, manages, and leverages data assets to create value, addressing data sources, quality, governance, infrastructure, and competitive advantages.",
      explanation: "For AI startups, data is often the primary moat. CTOs must develop strategies for data acquisition (build vs. buy vs. partner), quality assurance, annotation, versioning, and governance. The strategy should align with business goals, consider regulatory requirements, and plan for scaling data needs as the company grows.",
      category_id: "Tech CTO Skills",
      difficulty: 3,
      tags: ["Data Strategy", "Competitive Advantage", "Strategic Planning"]
    },
    {
      question: "How should CTOs approach AI model evaluation and benchmarking?",
      answer: "CTOs should establish comprehensive evaluation frameworks that assess models on technical metrics, business KPIs, ethical considerations, and operational requirements, using appropriate benchmarks and testing protocols.",
      explanation: "Effective evaluation goes beyond accuracy to include robustness, fairness, explainability, latency, and resource usage. CTOs should implement A/B testing frameworks, continuous evaluation pipelines, and processes to detect performance degradation. For novel applications without established benchmarks, CTOs must develop custom evaluation methodologies aligned with business objectives.",
      category_id: "Tech CTO Skills",
      difficulty: 4,
      tags: ["Model Evaluation", "Benchmarking", "Quality Assurance"]
    },
    {
      question: "What is responsible AI and why is it important for CTOs?",
      answer: "Responsible AI is the practice of developing and deploying AI systems that are ethical, fair, transparent, accountable, and aligned with human values and societal norms.",
      explanation: "CTOs must establish frameworks for identifying and mitigating bias, ensuring privacy, providing appropriate transparency, and maintaining human oversight. Beyond ethical considerations, responsible AI practices reduce regulatory and reputational risks, build user trust, and create more robust systems. This includes implementing governance structures, impact assessments, and monitoring systems for AI applications.",
      category_id: "Tech CTO Skills",
      difficulty: 3,
      tags: ["Responsible AI", "Ethics", "Governance"]
    },
    {
      question: "How should CTOs approach AI talent acquisition and team building?",
      answer: "CTOs should build balanced teams with diverse skills across ML research, engineering, data science, and domain expertise, using a mix of hiring, training, and partnering strategies.",
      explanation: "Given the competitive AI talent market, successful CTOs develop multi-pronged approaches: creating compelling technical challenges and vision, establishing learning cultures, leveraging academic partnerships, and sometimes acquiring small teams. They balance specialists with generalists and ensure teams have both theoretical knowledge and practical implementation skills.",
      category_id: "Tech CTO Skills",
      difficulty: 3,
      tags: ["Team Building", "Talent Management", "Organizational Development"]
    },
    {
      question: "What is the role of experimentation in AI product development?",
      answer: "Experimentation is central to AI product development, enabling teams to systematically test hypotheses about models, features, and user interactions to drive evidence-based decision making.",
      explanation: "CTOs should establish experimentation frameworks that include hypothesis formation, experimental design, statistical analysis, and feedback loops. This applies not just to model development but to feature selection, user experience, and business models. Effective experimentation cultures balance rapid iteration with rigorous evaluation and learning documentation.",
      category_id: "Tech CTO Skills",
      difficulty: 2,
      tags: ["Product Development", "Experimentation", "Decision Making"]
    }
  );
  
  // Combine all flashcards
  flashcards.push(...aiFundamentalsFlashcards, ...llmFlashcards, ...aiAgentsFlashcards, ...ctoSkillsFlashcards);
  
  // Generate quiz questions from flashcards
  flashcards.forEach(flashcard => {
    // Create a multiple choice question based on the flashcard
    const correctAnswer = flashcard.answer;
    
    // Generate incorrect options based on the category
    let incorrectOptions = [];
    
    if (flashcard.category_id === "AI Fundamentals") {
      incorrectOptions = [
        "A symbolic reasoning system that uses explicit rules and logic to make decisions without learning from data.",
        "A statistical method that identifies correlations without considering causality or underlying patterns.",
        "A hardware architecture specifically designed to accelerate matrix multiplications for graphics processing.",
        "A database system optimized for storing and retrieving high-dimensional vector representations."
      ];
    } else if (flashcard.category_id === "Large Language Models") {
      incorrectOptions = [
        "A technique for compressing text data into minimal token representations to reduce storage requirements.",
        "A method for extracting structured information from unstructured text using rule-based pattern matching.",
        "A specialized architecture that processes text sequentially using only recurrent connections without attention mechanisms.",
        "A framework for converting natural language into formal logic representations for automated reasoning."
      ];
    } else if (flashcard.category_id === "AI Agents") {
      incorrectOptions = [
        "A software system that executes predefined scripts without any ability to adapt or respond to environmental changes.",
        "A virtual assistant limited to answering questions without taking any actions or making decisions.",
        "A data processing pipeline that transforms inputs to outputs without maintaining any internal state.",
        "A user interface component that displays information but cannot interact with external systems."
      ];
    } else if (flashcard.category_id === "Tech CTO Skills") {
      incorrectOptions = [
        "A process focused exclusively on technical implementation without consideration of business strategy or market needs.",
        "A management approach that prioritizes short-term deliverables over long-term architectural planning and scalability.",
        "A development methodology that separates technical and business teams to maintain clear separation of concerns.",
        "A resource allocation strategy that maximizes current productivity at the expense of future flexibility and innovation."
      ];
    }
    
    // Select 3 random incorrect options
    const shuffledIncorrect = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Create options array with correct answer and incorrect options
    const options = [
      { text: correctAnswer, is_correct: true },
      ...shuffledIncorrect.map(opt => ({ text: opt, is_correct: false }))
    ];
    
    // Shuffle options
    const shuffledOptions = options.sort(() => 0.5 - Math.random());
    
    // Create quiz question
    const quizQuestion = {
      question: flashcard.question,
      options: shuffledOptions,
      explanation: flashcard.explanation,
      category_id: flashcard.category_id,
      difficulty: flashcard.difficulty,
      tags: flashcard.tags
    };
    
    quizQuestions.push(quizQuestion);
  });
  
  // Add some additional quiz questions that are specifically designed for quiz format
  
  // AI Fundamentals additional quiz questions
  const aiFundamentalsQuizQuestions = [
    {
      question: "Which of the following is NOT a common activation function used in neural networks?",
      options: [
        { text: "Gaussian Error Linear Unit (GELU)", is_correct: false },
        { text: "Rectified Linear Unit (ReLU)", is_correct: false },
        { text: "Scaled Exponential Linear Unit (SELU)", is_correct: false },
        { text: "Quadratic Activation Function (QAF)", is_correct: true }
      ],
      explanation: "Common activation functions include ReLU, Sigmoid, Tanh, GELU, and SELU. The Quadratic Activation Function (QAF) is a fictitious name and not a standard activation function used in neural networks.",
      category_id: "AI Fundamentals",
      difficulty: 3,
      tags: ["Neural Networks", "Activation Functions", "Deep Learning"]
    },
    {
      question: "Which technique is used to prevent overfitting in machine learning models?",
      options: [
        { text: "Increasing model complexity", is_correct: false },
        { text: "Reducing training data", is_correct: false },
        { text: "Dropout regularization", is_correct: true },
        { text: "Eliminating validation steps", is_correct: false }
      ],
      explanation: "Dropout regularization is a technique used to prevent overfitting by randomly deactivating a percentage of neurons during training, forcing the network to learn redundant representations. Other techniques include L1/L2 regularization, early stopping, and data augmentation.",
      category_id: "AI Fundamentals",
      difficulty: 2,
      tags: ["Regularization", "Overfitting", "Model Training"]
    }
  ];
  
  // LLM additional quiz questions
  const llmQuizQuestions = [
    {
      question: "Which of the following is NOT a key component of the transformer architecture used in LLMs?",
      options: [
        { text: "Multi-head attention mechanism", is_correct: false },
        { text: "Positional encoding", is_correct: false },
        { text: "Feed-forward neural networks", is_correct: false },
        { text: "Convolutional layers", is_correct: true }
      ],
      explanation: "Transformer architectures primarily use self-attention mechanisms, positional encoding, and feed-forward neural networks. Convolutional layers are more commonly found in CNN architectures, not transformers. While some hybrid models exist, standard transformers do not use convolutions.",
      category_id: "Large Language Models",
      difficulty: 3,
      tags: ["Transformers", "Architecture", "NLP"]
    },
    {
      question: "What is the primary difference between GPT (Generative Pre-trained Transformer) and BERT (Bidirectional Encoder Representations from Transformers)?",
      options: [
        { text: "GPT uses a decoder-only architecture trained to predict the next token, while BERT uses an encoder-only architecture trained to predict masked tokens in context", is_correct: true },
        { text: "GPT is trained on code, while BERT is trained only on natural language", is_correct: false },
        { text: "GPT requires fine-tuning for specific tasks, while BERT can be used without any task-specific training", is_correct: false },
        { text: "GPT uses reinforcement learning, while BERT uses only supervised learning", is_correct: false }
      ],
      explanation: "The fundamental architectural difference is that GPT models are decoder-only and trained autoregressively (predicting the next token given previous tokens), making them well-suited for text generation. BERT models are encoder-only and trained bidirectionally (considering context from both directions) using masked language modeling, making them better for understanding tasks.",
      category_id: "Large Language Models",
      difficulty: 3,
      tags: ["Model Architecture", "GPT", "BERT"]
    }
  ];
  
  // AI Agents additional quiz questions
  const aiAgentsQuizQuestions = [
    {
      question: "Which of the following best describes the 'alignment problem' in AI agents?",
      options: [
        { text: "The challenge of ensuring AI systems act in accordance with human values and intentions", is_correct: true },
        { text: "The technical difficulty of aligning neural network layers for optimal performance", is_correct: false },
        { text: "The process of aligning an agent's internal clock with external time systems", is_correct: false },
        { text: "The challenge of aligning multiple agents to work together efficiently", is_correct: false }
      ],
      explanation: "The alignment problem refers to the challenge of ensuring that AI systems, especially advanced ones, pursue goals that are aligned with human values and intentions. This includes preventing harmful behaviors, avoiding unintended consequences, and ensuring AI systems remain beneficial even as they become more capable.",
      category_id: "AI Agents",
      difficulty: 3,
      tags: ["AI Safety", "Alignment", "Ethics"]
    },
    {
      question: "In the context of AI agents, what is the 'exploration-exploitation tradeoff'?",
      options: [
        { text: "Balancing time spent searching for new solutions versus leveraging known good solutions", is_correct: true },
        { text: "Deciding whether to develop in-house AI or use third-party services", is_correct: false },
        { text: "Choosing between exploring new markets or exploiting existing customer bases", is_correct: false },
        { text: "Trading off between model size and inference speed", is_correct: false }
      ],
      explanation: "The exploration-exploitation tradeoff is a fundamental dilemma in reinforcement learning and decision-making systems. Agents must balance exploring new actions (which might lead to better long-term rewards but with uncertainty) versus exploiting known good actions (which provide reliable immediate rewards but might miss better opportunities).",
      category_id: "AI Agents",
      difficulty: 2,
      tags: ["Reinforcement Learning", "Decision Making", "Agent Behavior"]
    }
  ];
  
  // CTO Skills additional quiz questions
  const ctoSkillsQuizQuestions = [
    {
      question: "Which approach to AI implementation is most appropriate for a startup with limited AI expertise but needing to quickly add AI capabilities to their product?",
      options: [
        { text: "Build a custom foundation model from scratch", is_correct: false },
        { text: "Use AI APIs and services from established providers", is_correct: true },
        { text: "Hire a large team of ML researchers", is_correct: false },
        { text: "Develop a proprietary training infrastructure", is_correct: false }
      ],
      explanation: "For startups with limited AI expertise needing quick implementation, using existing AI APIs and services (like OpenAI, Google Cloud AI, or Hugging Face) provides the fastest path to market with minimal technical risk. This approach allows the startup to focus on their core value proposition while leveraging proven AI capabilities.",
      category_id: "Tech CTO Skills",
      difficulty: 2,
      tags: ["Build vs Buy", "Implementation Strategy", "Resource Management"]
    },
    {
      question: "What is the most effective approach for a CTO to evaluate whether an AI project is delivering business value?",
      options: [
        { text: "Focus exclusively on technical metrics like model accuracy", is_correct: false },
        { text: "Measure improvements in developer productivity", is_correct: false },
        { text: "Track research papers published by the AI team", is_correct: false },
        { text: "Define and measure business KPIs directly impacted by the AI system", is_correct: true }
      ],
      explanation: "While technical metrics are important for system optimization, the ultimate measure of AI project success is its impact on business KPIs. Effective CTOs establish clear connections between AI capabilities and business outcomes (e.g., conversion rates, customer retention, operational efficiency) and implement measurement systems to track these relationships.",
      category_id: "Tech CTO Skills",
      difficulty: 3,
      tags: ["Business Value", "Metrics", "Project Evaluation"]
    }
  ];
  
  // Add additional quiz questions
  quizQuestions.push(
    ...aiFundamentalsQuizQuestions,
    ...llmQuizQuestions,
    ...aiAgentsQuizQuestions,
    ...ctoSkillsQuizQuestions
  );
  
  return {
    flashcards,
    quizQuestions
  };
};

// Generate content
const content = generateContent();

// Write to files
fs.writeFileSync(
  path.join(__dirname, '..', '..', 'data', 'generated_flashcards.json'),
  JSON.stringify(content.flashcards, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, '..', '..', 'data', 'generated_quiz_questions.json'),
  JSON.stringify(content.quizQuestions, null, 2)
);

console.log(`Generated ${content.flashcards.length} flashcards and ${content.quizQuestions.length} quiz questions.`);
