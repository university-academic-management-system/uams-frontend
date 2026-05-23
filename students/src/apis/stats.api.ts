import axiosClient from "@configs/axios.config"
import type { DashboardResponse } from "@type/dashboard.type"

export const getDashboardStatsApi = async (): Promise<DashboardResponse> => {
    const { data } = await axiosClient.get<DashboardResponse>("/stats/dashboard");
    return data;
}
