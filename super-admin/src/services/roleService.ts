import apiClient from './api';
import { RolePermission } from '../../types';

export const roleService = {
  getAll: async () => {
    const response = await apiClient.get<RolePermission[]>('/roles');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<RolePermission>(`/roles/${id}`);
    return response.data;
  },

  create: async (role: Omit<RolePermission, 'id'>) => {
    const response = await apiClient.post<RolePermission>('/roles', role);
    return response.data;
  },

  update: async (id: string, role: Partial<RolePermission>) => {
    const response = await apiClient.put<RolePermission>(`/roles/${id}`, role);
    return response.data;
  },

  delete: async (id: string) => {
    return apiClient.delete(`/roles/${id}`);
  },
};