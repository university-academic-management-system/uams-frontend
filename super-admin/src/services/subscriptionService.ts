import apiClient from './api';
import { Subscription } from '../../types';

export const subscriptionService = {
  getAll: async () => {
    const response = await apiClient.get<Subscription[]>('/subscriptions');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Subscription>(`/subscriptions/${id}`);
    return response.data;
  },

  getByStatus: async (status: string) => {
    const response = await apiClient.get<Subscription[]>('/subscriptions', {
      params: { status },
    });
    return response.data;
  },

  create: async (subscription: Omit<Subscription, 'id'>) => {
    const response = await apiClient.post<Subscription>('/subscriptions', subscription);
    return response.data;
  },

  update: async (id: string, subscription: Partial<Subscription>) => {
    const response = await apiClient.put<Subscription>(`/subscriptions/${id}`, subscription);
    return response.data;
  },

  delete: async (id: string) => {
    return apiClient.delete(`/subscriptions/${id}`);
  },
};
