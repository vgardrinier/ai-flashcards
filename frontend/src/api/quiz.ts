import { BaseApiService } from './base';
import { QuizQuestion, QuizAttemptRequest, QuizAttemptResponse, ApiResponse } from '../types/api';
import { InternalAxiosRequestConfig } from 'axios';

export class QuizApiService extends BaseApiService {
  async getQuestions(categoryId?: number, difficulty?: number): Promise<ApiResponse<QuizQuestion[]>> {
    const params: Record<string, any> = {};
    if (categoryId) params.category_id = categoryId;
    if (difficulty) params.difficulty = difficulty;

    return this.request<QuizQuestion[]>({
      method: 'GET',
      url: '/quiz_questions',
      params,
      headers: {},
    } as InternalAxiosRequestConfig);
  }

  async getQuestionById(id: number): Promise<ApiResponse<QuizQuestion>> {
    return this.request<QuizQuestion>({
      method: 'GET',
      url: `/quiz_questions/${id}`,
      headers: {},
    } as InternalAxiosRequestConfig);
  }

  async submitAnswer(
    questionId: number, 
    userId: number, 
    selectedOption: string, 
    difficulty: number,
    quizSessionId?: string
  ): Promise<ApiResponse<QuizAttemptResponse>> {
    return this.request<QuizAttemptResponse>({
      method: 'POST',
      url: `/quiz_questions/${questionId}/attempt`,
      data: {
        user_id: userId,
        selected_option: selectedOption,
        difficulty: difficulty,
        quiz_session_id: quizSessionId
      },
      headers: {},
    } as InternalAxiosRequestConfig);
  }
} 