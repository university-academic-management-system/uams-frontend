// @services/dashboard.service.ts
import axiosClient from "@configs/axios.config";
import type { DashboardTotals } from "@type/dashboard.type";

export const DashboardService = {
  getTotals: async (): Promise<DashboardTotals> => {
    const { data } = await axiosClient.get<{ data: DashboardTotals }>("/stats/dashboard");
    return data.data;
  },
};