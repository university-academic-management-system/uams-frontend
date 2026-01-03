<<<<<<< HEAD
import apiClient from './api';

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  description: string;
  status: 'success' | 'error' | 'info';
}

export const activityLogService = {
  getAll: async (limit?: number) => {
    const response = await apiClient.get<ActivityLog[]>('/activity-logs', {
      params: { limit },
    });
    return response.data;
  },

  getByUser: async (userId: string) => {
    const response = await apiClient.get<ActivityLog[]>(`/activity-logs/user/${userId}`);
    return response.data;
  },

  getByAction: async (action: string) => {
    const response = await apiClient.get<ActivityLog[]>(`/activity-logs/action/${action}`);
    return response.data;
  },
=======
import apiClient from './api';

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  description: string;
  status: 'success' | 'error' | 'info';
}

export const activityLogService = {
  getAll: async (limit?: number) => {
    const response = await apiClient.get<ActivityLog[]>('/activity-logs', {
      params: { limit },
    });
    return response.data;
  },

  getByUser: async (userId: string) => {
    const response = await apiClient.get<ActivityLog[]>(`/activity-logs/user/${userId}`);
    return response.data;
  },

  getByAction: async (action: string) => {
    const response = await apiClient.get<ActivityLog[]>(`/activity-logs/action/${action}`);
    return response.data;
  },
>>>>>>> 657324b6ca899feed2eb7425d11a81542d49269b
};