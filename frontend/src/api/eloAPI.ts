import { AxiosResponse } from 'axios';
import { EloScore, EloLevel, ApiResponse } from '../types/api';
import api from './index';

export const eloAPI = {
  getScore: async (userId: number): Promise<AxiosResponse<EloScore>> => {
    console.log('ELO API - getScore called with userId:', userId);
    const response = await api.get(`/elo_scores/${userId}`);
    console.log('ELO API - getScore response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  
  getHistory: (userId: number): Promise<AxiosResponse<EloScore[]>> => 
    api.get(`/elo_scores/${userId}/history`),
  
  getLevels: (): Promise<AxiosResponse<EloLevel[]>> => 
    api.get('/elo_scores/levels'),

  updateScore: async (userId: number, categoryId: number, score: number) => {
    console.log('ELO API - updateScore called with:', { userId, categoryId, score });
    try {
      const response = await api.put(`/elo_scores/${userId}`, { elo_score: { score } });
      console.log('ELO API - updateScore response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      
      if (response.status >= 200 && response.status < 300) {
        if (response.data && response.data.score !== undefined) {
          console.log('ELO API - Successfully updated score:', response.data);
          return response;
        } else {
          console.error('ELO API - Invalid response structure:', response.data);
          throw new Error('Invalid response structure');
        }
      } else {
        console.error('ELO API - Update failed:', response.status, response.statusText);
        throw new Error(`Update failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('ELO API - updateScore error:', error);
      throw error;
    }
  }
}; 