import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
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
  login: (email, password) => api.post('/login', { email, password }),
  register: (userData) => api.post('/users', { user: userData }),
  getCurrentUser: () => api.get('/me'),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, { user: userData }),
};

// API endpoints for flashcards
export const flashcardAPI = {
  getAll: (categoryId = null) => {
    const params = categoryId ? { category_id: categoryId } : {};
    return api.get('/flashcards', { params });
  },
  getById: (id) => api.get(`/flashcards/${id}`),
};

// API endpoints for quiz questions
export const quizAPI = {
  getAll: (categoryId = null, difficulty = null) => {
    const params = {};
    if (categoryId) params.category_id = categoryId;
    if (difficulty) params.difficulty = difficulty;
    return api.get('/quiz_questions', { params });
  },
  getById: (id) => api.get(`/quiz_questions/${id}`),
  submitAnswer: (questionId, userId, selectedOption) => 
    api.post(`/quiz_questions/${questionId}/attempt`, { 
      user_id: userId, 
      selected_option: selectedOption 
    }),
};

// API endpoints for user progress
export const progressAPI = {
  getAll: (userId) => api.get(`/progress/${userId}`),
  getDueCards: (userId) => api.get(`/progress/due/${userId}`),
  updateProgress: (progressId, progressData) => api.put(`/progress/${progressId}`, { progress: progressData }),
};

// API endpoints for ELO scores
export const eloAPI = {
  getScore: (userId) => api.get(`/elo_scores/${userId}`),
  getHistory: (userId) => api.get(`/elo_scores/${userId}/history`),
  getLevels: () => api.get('/elo_scores/levels'),
};

// API endpoints for categories
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

export default api;
