import axiosClient from "@configs/axios.config";
import type { Session } from "@type/academic.type";

export const AcademicService = {
    getSessions: async (): Promise<Session[]> => {
        const { data } = await axiosClient.get<Session[]>("/accademics/sessions");
        return data;
    },
};

export const getSystemSettings = async () => {
    const { data } = await axiosClient.get("/settings");
    return data.data;
};