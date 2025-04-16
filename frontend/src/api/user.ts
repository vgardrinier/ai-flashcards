import { BaseApiService } from './base';
import { User, UserLoginRequest, UserRegisterRequest, ApiResponse } from '../types/api';
import { InternalAxiosRequestConfig } from 'axios';

export class UserApiService extends BaseApiService {
  async login(credentials: UserLoginRequest): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.request<{ token: string; user: User }>({
      method: 'POST',
      url: '/login',
      data: credentials,
      headers: {},
    } as InternalAxiosRequestConfig);
  }

  async register(userData: UserRegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>({
      method: 'POST',
      url: '/users',
      data: { user: userData },
      headers: {},
    } as InternalAxiosRequestConfig);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>({
      method: 'GET',
      url: '/me',
      headers: {},
    } as InternalAxiosRequestConfig);
  }

  async updateUser(userId: number, userData: Partial<UserRegisterRequest>): Promise<ApiResponse<User>> {
    return this.request<User>({
      method: 'PUT',
      url: `/users/${userId}`,
      data: { user: userData },
      headers: {},
    } as InternalAxiosRequestConfig);
  }
} 