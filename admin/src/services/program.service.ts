import axiosClient from "@configs/axios.config"
import type { ProgramTypeResponse } from "@type/program.type"

interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export const ProgramServices = {
    getProgramTypes: async (): Promise<ProgramTypeResponse[]> => {
        const { data } = await axiosClient.get<ApiResponse<ProgramTypeResponse[]>>("/programmes");
        return data.data;
    },

    getProgramTypeById: async (id: string): Promise<ProgramTypeResponse> => {
        const { data } = await axiosClient.get<ApiResponse<ProgramTypeResponse>>(`/programmes/${id}`);
        return data.data;
    },

    createProgramType: async (payload: Record<string, unknown>): Promise<ProgramTypeResponse> => {
        const { data } = await axiosClient.post<ApiResponse<ProgramTypeResponse>>("/programmes", payload);
        return data.data;
    },

    updateProgramType: async (id: string, payload: Record<string, unknown>): Promise<ProgramTypeResponse> => {
        const { data } = await axiosClient.patch<ApiResponse<ProgramTypeResponse>>(`/programmes/${id}`, payload);
        return data.data;
    },

    deleteProgramType: async (id: string): Promise<void> => {
        await axiosClient.delete(`/programmes/${id}`);
    }
};
