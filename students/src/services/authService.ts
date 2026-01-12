import apiClient from './api';
import type { LoginRequest, LoginResponse } from './types';
import { AxiosError } from 'axios';

// Flag to enable mock authentication when backend is not available
const MOCK_AUTH_ENABLED = true;

/**
 * Login student
 * @param credentials - Email and password
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    // If mock auth is enabled, allow any login without backend
    if (MOCK_AUTH_ENABLED) {
      // Create a mock response
      const mockToken = 'mock_token_' + Date.now();
      const mockUser = {
        id: 'student_' + Date.now(),
        email: credentials.email,
        fullName: credentials.email.split('@')[0],
        role: 'STUDENT',
        profile: {
          id: 'profile_' + Date.now(),
          universityId: 'uni_123',
          departmentId: 'dept_123',
          programId: 'prog_123',
          userId: 'student_' + Date.now(),
          studentId: 'STU/2026/001',
          level: '100',
          levelId: 'level_100',
          sessionId: 'session_2025_2026',
          isActive: true,
          academicStanding: 'GOOD',
          probationStartDate: null,
          probationEndDate: null,
          totalCreditsEarned: 0,
          currentGPA: 5.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          idCard: null,
          Level: { id: 'level_100', name: '100 Level', code: '100' }
        }
      };

      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      return {
        status: 'success',
        message: 'Mock login successful',
        token: mockToken,
        user: mockUser,
      };
    }

    // Original backend login
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    
    if (response.data.status === 'success' && response.data.token) {
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    // If mock auth is enabled and we get an error, still allow login
    if (MOCK_AUTH_ENABLED && (error instanceof AxiosError)) {
      const mockToken = 'mock_token_' + Date.now();
      const mockUser = {
        id: 'student_' + Date.now(),
        email: credentials.email,
        fullName: credentials.email.split('@')[0],
        role: 'STUDENT',
        profile: {
          id: 'profile_' + Date.now(),
          universityId: 'uni_123',
          departmentId: 'dept_123',
          programId: 'prog_123',
          userId: 'student_' + Date.now(),
          studentId: 'STU/2026/001',
          level: '100',
          levelId: 'level_100',
          sessionId: 'session_2025_2026',
          isActive: true,
          academicStanding: 'GOOD',
          probationStartDate: null,
          probationEndDate: null,
          totalCreditsEarned: 0,
          currentGPA: 5.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          idCard: null,
          Level: { id: 'level_100', name: '100 Level', code: '100' }
        }
      };

      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      return {
        status: 'success',
        message: 'Mock login successful',
        token: mockToken,
        user: mockUser,
      };
    }

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
