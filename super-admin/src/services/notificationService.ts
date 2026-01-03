<<<<<<< HEAD
import apiClient from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

export const notificationService = {
  getAll: async () => {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  getUnread: async () => {
    const response = await apiClient.get<Notification[]>('/notifications/unread');
    return response.data;
  },

  markAsRead: async (id: string) => {
    return apiClient.put(`/notifications/${id}/read`, {});
  },

  delete: async (id: string) => {
    return apiClient.delete(`/notifications/${id}`);
  },

  clearAll: async () => {
    return apiClient.delete('/notifications');
  },
=======
import apiClient from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

export const notificationService = {
  getAll: async () => {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  getUnread: async () => {
    const response = await apiClient.get<Notification[]>('/notifications/unread');
    return response.data;
  },

  markAsRead: async (id: string) => {
    return apiClient.put(`/notifications/${id}/read`, {});
  },

  delete: async (id: string) => {
    return apiClient.delete(`/notifications/${id}`);
  },

  clearAll: async () => {
    return apiClient.delete('/notifications');
  },
>>>>>>> 657324b6ca899feed2eb7425d11a81542d49269b
};