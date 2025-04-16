import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../types/api';

export class BaseApiService {
  protected api: AxiosInstance;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for adding auth token
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor for handling errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access (e.g., redirect to login)
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  protected async request<T>(config: InternalAxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.request<T>(config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  protected handleError(error: AxiosError): ApiError {
    if (error.response?.data) {
      const responseData = error.response.data as { message?: string; errors?: Record<string, string[]> };
      return {
        message: responseData.message || 'An error occurred',
        status: error.response.status,
        errors: responseData.errors,
      };
    }
    return {
      message: error.message || 'An error occurred',
      status: 500,
    };
  }
} 