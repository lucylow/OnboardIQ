// Authentication Service for user management
import { faker } from '@faker-js/faker';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  companyName?: string;
  planTier: 'free' | 'premium' | 'enterprise';
  avatar?: string;
  isAuthenticated: boolean;
  lastLogin: Date;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phoneNumber?: string;
}

class AuthService {
  private currentUser: User | null = null;
  private isAuthenticated = false;
  private isLoading = false;
  private error: string | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    try {
      const storedUser = localStorage.getItem('onboardiq_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUser = { ...user, lastLogin: new Date(user.lastLogin) };
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    }
  }

  private saveUserToStorage(user: User) {
    try {
      localStorage.setItem('onboardiq_user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  }

  private clearUserFromStorage() {
    try {
      localStorage.removeItem('onboardiq_user');
    } catch (error) {
      console.error('Failed to clear user from storage:', error);
    }
  }

  // Simulate API delay
  private async simulateApiDelay(min: number = 500, max: number = 2000): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    this.isLoading = true;
    this.error = null;

    try {
      await this.simulateApiDelay();

      // Simulate backend validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Simulate successful login
      const user: User = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        companyName: faker.company.name(),
        planTier: faker.helpers.arrayElement(['free', 'premium', 'enterprise']),
        avatar: faker.image.avatar(),
        isAuthenticated: true,
        lastLogin: new Date(),
        createdAt: faker.date.past()
      };

      this.currentUser = user;
      this.isAuthenticated = true;
      this.saveUserToStorage(user);

      return { success: true, user };
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  // Signup user
  async signup(data: SignupData): Promise<{ success: boolean; user?: User; error?: string }> {
    this.isLoading = true;
    this.error = null;

    try {
      await this.simulateApiDelay();

      // Simulate backend validation
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        throw new Error('All required fields must be filled');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Simulate successful signup
      const user: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
        planTier: 'free',
        avatar: faker.image.avatar(),
        isAuthenticated: true,
        lastLogin: new Date(),
        createdAt: new Date()
      };

      this.currentUser = user;
      this.isAuthenticated = true;
      this.saveUserToStorage(user);

      return { success: true, user };
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Signup failed';
      return { success: false, error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  // Logout user
  async logout(): Promise<{ success: boolean }> {
    try {
      await this.simulateApiDelay(200, 500);
      
      this.currentUser = null;
      this.isAuthenticated = false;
      this.error = null;
      this.clearUserFromStorage();

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  // Get authentication state
  getAuthState(): AuthState {
    return {
      user: this.currentUser,
      isAuthenticated: this.isAuthenticated,
      isLoading: this.isLoading,
      error: this.error
    };
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      await this.simulateApiDelay();

      const updatedUser = { ...this.currentUser, ...updates };
      this.currentUser = updatedUser;
      this.saveUserToStorage(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Profile update failed';
      return { success: false, error: this.error };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.simulateApiDelay();

      if (!email) {
        throw new Error('Email is required');
      }

      // Simulate password reset email sent
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Password reset failed' };
    }
  }

  // Check backend connectivity
  async checkBackendHealth(): Promise<{ connected: boolean; error?: string }> {
    try {
      // Simulate backend health check
      await this.simulateApiDelay(100, 500);
      
      // Simulate 95% success rate
      if (Math.random() < 0.95) {
        return { connected: true };
      } else {
        throw new Error('Backend service temporarily unavailable');
      }
    } catch (error) {
      return { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Backend connection failed' 
      };
    }
  }

  // Refresh user session
  async refreshSession(): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'No user session to refresh' };
    }

    try {
      await this.simulateApiDelay(200, 800);

      // Update last login time
      this.currentUser.lastLogin = new Date();
      this.saveUserToStorage(this.currentUser);

      return { success: true, user: this.currentUser };
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Session refresh failed';
      return { success: false, error: this.error };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
