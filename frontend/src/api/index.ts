import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  UserLoginRequest, 
  UserRegisterRequest, 
  QuizQuestion, 
  QuizAttemptRequest, 
  QuizAttemptResponse,
  EloScore,
  EloLevel,
  Category,
  Flashcard,
  UserProgress,
  ApiResponse
} from '../types/api';

// Create an axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints for users
export const userAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> => 
    api.post('/login', { email, password }),
  
  register: (userData: UserRegisterRequest): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.post('/users', { user: userData }),
  
  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.get('/me'),
  
  updateUser: (userId: number, userData: Partial<UserRegisterRequest>): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.put(`/users/${userId}`, { user: userData }),
};

// API endpoints for quiz questions
export const quizAPI = {
  getAll: (categoryId?: number, difficulty?: number): Promise<AxiosResponse<ApiResponse<QuizQuestion[]>>> => {
    const params: Record<string, any> = {};
    if (categoryId) params.category_id = categoryId;
    if (difficulty) params.difficulty = difficulty;
    return api.get('/quiz_questions', { params });
  },
  
  getById: (id: number): Promise<AxiosResponse<ApiResponse<QuizQuestion>>> => 
    api.get(`/quiz_questions/${id}`),
  
  submitAnswer: (questionId: number, userId: number, selectedOption: 'a' | 'b' | 'c' | 'd'): Promise<AxiosResponse<ApiResponse<QuizAttemptResponse>>> => {
    console.log('API layer - submitAnswer called with:', {
      questionId,
      userId,
      selectedOption,
      typeof_questionId: typeof questionId,
      typeof_userId: typeof userId,
      typeof_selectedOption: typeof selectedOption
    });
    
    const data = {
      user_id: userId,
      selected_option: selectedOption
    };
    
    console.log('API layer - Request data:', JSON.stringify(data));
    
    return api.post(`/quiz_questions/${questionId}/attempt`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
};

// API endpoints for ELO scores
export const eloAPI = {
  getScore: (userId: number): Promise<AxiosResponse<ApiResponse<EloScore>>> => 
    api.get(`/elo_scores/${userId}`),
  
  getHistory: (userId: number): Promise<AxiosResponse<ApiResponse<EloScore[]>>> => 
    api.get(`/elo_scores/${userId}/history`),
  
  getLevels: (): Promise<AxiosResponse<ApiResponse<EloLevel[]>>> => 
    api.get('/elo_scores/levels'),
};

// API endpoints for categories
export const categoryAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Category[]>>> => 
    api.get('/categories'),
  
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Category>>> => 
    api.get(`/categories/${id}`),
};

// API endpoints for flashcards
export const flashcardAPI = {
  getAll: (categoryId?: number): Promise<AxiosResponse<ApiResponse<Flashcard[]>>> => {
    const params = categoryId ? { category_id: categoryId } : {};
    return api.get('/flashcards', { params });
  },
  
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Flashcard>>> => 
    api.get(`/flashcards/${id}`),
};

// API endpoints for user progress
export const progressAPI = {
  getAll: (userId: number): Promise<AxiosResponse<ApiResponse<UserProgress[]>>> => 
    api.get(`/progress/${userId}`),
  
  getDueCards: (userId: number): Promise<AxiosResponse<ApiResponse<UserProgress[]>>> => 
    api.get(`/progress/due/${userId}`),
  
  updateProgress: (progressId: number, progressData: Partial<UserProgress>): Promise<AxiosResponse<ApiResponse<UserProgress>>> => 
    api.put(`/progress/${progressId}`, { progress: progressData }),
};

export default api; 