// User types
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Quiz types
export interface QuizQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'a' | 'b' | 'c' | 'd';
  difficulty: number;
  category: {
    id: number;
    name: string;
  };
  explanation: string;
}

export interface QuizAttemptRequest {
  user_id: number;
  selected_option: 'a' | 'b' | 'c' | 'd';
  difficulty: number;
  quiz_session_id?: string;
}

export interface QuizAttemptResponse {
  correct: boolean;
  score_change: number;
  message?: string;
  explanation?: string;
  quiz_session_id?: string;
  elo_score_after?: number;
}

// ELO Score types
export interface EloScore {
  id: number;
  user_id: number;
  score: number;
  level: string;
  created_at: string;
  updated_at: string;
}

export interface EloLevel {
  name: string;
  min_score: number;
  max_score: number;
  description: string;
  icon?: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Flashcard types
export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

// Progress types
export interface UserProgress {
  id: number;
  user_id: number;
  flashcard_id: number;
  times_reviewed: number;
  ease_factor: number;
  last_reviewed: string;
  next_review: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface QuizResults {
  categoryId: number;
  userId: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  totalEloChange: number;
  answers: Array<{
    questionId: number;
    selectedOption: string;
    correct: boolean;
    explanation: string;
    scoreChange: number;
  }>;
} 