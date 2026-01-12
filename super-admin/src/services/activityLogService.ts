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
    const response = await apiClient.get<ActivityLog[]>('super-admin/dashboard/activity-logs', {
      params: { limit },
    });
    return response.data;
  },

  getByUser: async (userId: string) => {
    const response = await apiClient.get<ActivityLog[]>(`super-admin/dashboard/activity-logs/user/${userId}`);
    return response.data;
  },

  getByAction: async (action: string) => {
    const response = await apiClient.get<ActivityLog[]>(`super-admin/dashboard/activity-logs/action/${action}`);
    return response.data;
  },
};