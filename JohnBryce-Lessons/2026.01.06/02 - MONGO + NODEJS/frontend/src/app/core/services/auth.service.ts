import { Injectable, signal, computed } from '@angular/core';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // State signals
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Computed signals
  readonly userName = computed(() => this.currentUser()?.name || 'Guest');

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('current_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  private generateMockToken(): string {
    return 'mock_token_' + Math.random().toString(36).substring(2, 15);
  }

  private generateMockUserId(): string {
    return 'user_' + Math.random().toString(36).substring(2, 10);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      if (credentials.password.length < 6) {
        throw new Error('Invalid credentials');
      }

      // Mock successful response
      const mockUser: User = {
        id: this.generateMockUserId(),
        name: credentials.email.split('@')[0],
        email: credentials.email,
      };

      const mockToken = this.generateMockToken();

      // Store in localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('current_user', JSON.stringify(mockUser));

      // Update state
      this.currentUser.set(mockUser);
      this.isAuthenticated.set(true);

      return {
        token: mockToken,
        user: mockUser,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      this.error.set(message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock validation
      if (!data.name || !data.email || !data.password) {
        throw new Error('All fields are required');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!data.email.includes('@')) {
        throw new Error('Invalid email format');
      }

      // Mock successful response
      const mockUser: User = {
        id: this.generateMockUserId(),
        name: data.name,
        email: data.email,
      };

      const mockToken = this.generateMockToken();

      // Store in localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('current_user', JSON.stringify(mockUser));

      // Update state
      this.currentUser.set(mockUser);
      this.isAuthenticated.set(true);

      return {
        token: mockToken,
        user: mockUser,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      this.error.set(message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.clearStorage();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.error.set(null);
  }

  clearError(): void {
    this.error.set(null);
  }
}
