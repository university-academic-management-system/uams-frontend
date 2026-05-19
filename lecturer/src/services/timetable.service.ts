import axiosClient from "@configs/axios.config";
import type { ApiResponse, TimetableEntry } from "@type/timetable.type";

export const TimetableService = {
  getTimetable: async (filters?: { session?: string; semester?: string }): Promise<ApiResponse<TimetableEntry []>> => {
    const { data } = await axiosClient.get<ApiResponse<TimetableEntry[]>>("/timetables", { params: filters });
    return data;
  },
};