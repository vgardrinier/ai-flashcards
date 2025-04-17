import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
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

  protected async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.request<T>(config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  protected handleError(error: AxiosError): Error {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      return new Error(`Request failed with status ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      return new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      return error;
    }
  }
} 