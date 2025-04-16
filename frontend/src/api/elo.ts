import { BaseApiService } from './base';
import { EloScore, EloLevel, ApiResponse } from '../types/api';
import { InternalAxiosRequestConfig } from 'axios';

export class EloApiService extends BaseApiService {
  async getScore(userId: number): Promise<ApiResponse<EloScore>> {
    return this.request<EloScore>({
      method: 'GET',
      url: `/elo_scores/${userId}`,
      headers: {},
    } as InternalAxiosRequestConfig);
  }

  async getHistory(userId: number): Promise<ApiResponse<EloScore[]>> {
    return this.request<EloScore[]>({
      method: 'GET',
      url: `/elo_scores/${userId}/history`,
      headers: {},
    } as InternalAxiosRequestConfig);
  }

  async getLevels(): Promise<ApiResponse<EloLevel[]>> {
    return this.request<EloLevel[]>({
      method: 'GET',
      url: '/elo_scores/levels',
      headers: {},
    } as InternalAxiosRequestConfig);
  }
} 