import axiosClient from "@configs/axios.config";
import type { DepartmentSettings } from "@type/settings.type";
import type { ApiResponse } from "@type/common.type";

export const SystemServices = {
    getSystemSettings: async () => {
        const { data } = await axiosClient.get("/settings");
        return data;
    },
    updateSystemSettings: async (payload: any) => {
        const { data } = await axiosClient.patch("/settings", payload);
        return data;
    },
    getDepartmentSettings: async (): Promise<ApiResponse<DepartmentSettings>> => {
        const { data } = await axiosClient.get("/settings");
        return data;
    },
};
