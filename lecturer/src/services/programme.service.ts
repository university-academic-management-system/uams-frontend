// @services/programme.service.ts
import axiosClient from "@configs/axios.config";
import type { Programme, ProgrammeFilters } from "@type/programme.type";

export const getAllProgrammes = async (filters?: ProgrammeFilters): Promise<Programme[]> => {
  const params = filters || {};
  const response = await axiosClient.get<{ data: Programme[] }>("/programmes", { params });
  return response.data.data;
};

export const getProgrammeById = async (id: string): Promise<Programme> => {
  const response = await axiosClient.get<{ data: Programme }>(`/programmes/${id}`);
  return response.data.data;
};