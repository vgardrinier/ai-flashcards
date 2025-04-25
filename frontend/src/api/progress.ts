import { AxiosResponse } from 'axios';
import api from './index';
import { ApiResponse, UserProgress } from '../types/api';

// API endpoints for user progress
export const progressAPI = {
  getAll: (userId: number): Promise<AxiosResponse<ApiResponse<UserProgress[]>>> => 
    api.get(`/progress/${userId}`),
  
  getDueCards: (userId: number): Promise<AxiosResponse<ApiResponse<UserProgress[]>>> => 
    api.get(`/progress/due/${userId}`),
  
  updateProgress: (progressId: number, progressData: Partial<UserProgress>): Promise<AxiosResponse<ApiResponse<UserProgress>>> => 
    api.put(`/progress/${progressId}`, { progress: progressData }),
    
  getStats: (userId: number): Promise<AxiosResponse<any>> => {
    console.log(`Calling progress stats API for user ${userId}`);
    return api.get(`/progress/stats/${userId}`);
  }
};

export default progressAPI;