import apiClient from './api';
import type { LoginRequest, LoginResponse } from './types';
import { AxiosError } from 'axios';

/**
 * Login student
 * @param credentials - Email and password
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    
    if (response.data.status === 'success' && response.data.token) {
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    // Handle Axios error - extract message from response body
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    // Re-throw if it's already an Error with a message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Login failed. Please try again.');
  }
};

/**
 * Logout student
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

/**
 * Get stored user from localStorage
 */
export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const authService = {
  login,
  logout,
  isAuthenticated,
  getStoredUser,
};

export default authService;
