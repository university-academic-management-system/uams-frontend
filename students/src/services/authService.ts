import apiClient from './api';
import type { LoginRequest, LoginResponse } from './types';
import { AxiosError } from 'axios';

/**
 * Login student
 * @param credentials - Email and password
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/login', credentials);
    
    if (response.data.status === 'success' && response.data.token) {
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Login failed. Please try again.');
  }
};

/**
 * Verify student by matriculation number
 * @param studentId - Matriculation Number
 */
export const verifyStudent = async (studentId: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/activate-student/login', { studentId });

    if (response.data.status === 'success' && response.data.token) {
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    }

    throw new Error(response.data.message || 'Verification failed');
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Verification failed. Please try again.');
  }
};

interface ActivateAccountRequest {
  email: string;
  password: string;
}

interface ActivateAccountResponse {
  status: string;
  message: string;
}

/**
 * Activate student account with email and password
 * @param data - Email and password for activation
 */
export const activateAccount = async (data: ActivateAccountRequest): Promise<ActivateAccountResponse> => {
  try {
    const response = await apiClient.patch<ActivateAccountResponse>('/activate-student/update', data);

    if (response.data.status === 'success') {
      return response.data;
    }

    throw new Error(response.data.message || 'Account activation failed');
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Account activation failed. Please try again.');
  }
};

interface InitializePaymentResponse {
  success: boolean;
  message: string;
  data: {
    authorizationUrl: string;
    reference: string;
    transactionId: string;
  };
}

/**
 * Initialize payment for annual access fee
 * Redirects to Paystack checkout page
 */
export const initializePayment = async (): Promise<InitializePaymentResponse> => {
  try {
    const callbackUrl = import.meta.env.VITE_CALLBACK_URL;
    const response = await apiClient.post<InitializePaymentResponse>('/annual-access-fee/initialize', { callbackUrl });

    if (response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message || 'Payment initialization failed');
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Payment initialization failed. Please try again.');
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
  verifyStudent,
  activateAccount,
  initializePayment,
};

export default authService;
