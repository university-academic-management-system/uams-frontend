import apiClient from './api';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  superAdmin: {
    id: string;
    full_name: string;
    email: string;
    status: string;
  };
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>('/super-admin/signin', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.superAdmin));
      localStorage.setItem('role', 'SUPER_ADMIN');
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await apiClient.post('/super-admin/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiClient.post('/super-admin/reset-password', data);
    return response.data;
  },

  verifyCode: async (email: string, code: string) => {
    const response = await apiClient.post('/super-admin/verify-code', { email, code });
    return response.data;
  },

  resendCode: async (email: string) => {
    const response = await apiClient.post('/super-admin/resend-code', { email });
    return response.data;
  },

  getAuthToken: () => localStorage.getItem('authToken'),

  isAuthenticated: () => !!localStorage.getItem('authToken'),
};