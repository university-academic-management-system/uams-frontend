import apiClient from './api';
import { University } from '../../types';

export const universityService = {
  getAll: async () => {
    const response = await apiClient.get<University[]>('/super-admin/universities');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<University>(`/super-admin/universities/${id}`);
    return response.data;
  },

  create: async (university: {
    slug: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    status: string;
  }) => {
    const response = await apiClient.post<University>('/super-admin/universities', university);
    return response.data;
  },

  update: async (id: string, university: Partial<University>) => {
    const response = await apiClient.put<University>(`/super-admin/universities/${id}`, university);
    return response.data;
  },

  delete: async (id: string) => {
    return apiClient.delete(`/super-admin/universities/${id}`);
  },

  search: async (query: string) => {
    const response = await apiClient.get<University[]>('/super-admin/universities/search', {
      params: { q: query },
    });
    return response.data;
  },
};