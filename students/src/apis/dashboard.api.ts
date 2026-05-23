import axiosClient from "@configs/axios.config"
import type { DashboardResponse, TimetableResponse } from "@type/dashboard.type"

export const getDashboardStatsApi = async (): Promise<DashboardResponse> => {
    const { data } = await axiosClient.get<DashboardResponse>("/stats/dashboard");
    return data;
}

export const getTimetableApi = async (params?: { session?: string; semester?: string; level?: string }): Promise<TimetableResponse> => {
    const { data } = await axiosClient.get<TimetableResponse>("/timetables", { params });
    return data;
}
