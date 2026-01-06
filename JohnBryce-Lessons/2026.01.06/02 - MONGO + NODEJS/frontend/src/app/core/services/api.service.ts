import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { environment } from '../../../environments/environment';

export interface ApiError {
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl,
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors globally
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status || 500,
        };

        if (error.response) {
          const data = error.response.data as Record<string, unknown>;
          apiError.message = (data['detail'] as string) || (data['message'] as string) || apiError.message;

          // Handle 401 - unauthorized
          if (error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
            window.location.href = '/login';
          }
        } else if (error.request) {
          apiError.message = 'Network error. Please check your connection.';
        }

        return Promise.reject(apiError);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.axiosInstance;
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.get<T>(url);
    return response.data;
  }

  async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data);
    return response.data;
  }

  async put<T, D = unknown>(url: string, data?: D): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data);
    return response.data;
  }

  async patch<T, D = unknown>(url: string, data?: D): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url);
    return response.data;
  }
}
