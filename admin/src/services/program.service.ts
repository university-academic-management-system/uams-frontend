import axiosClient from "@configs/axios.config"
import type { ProgramTypeResponse } from "@type/program.type"

export const ProgramServices = {
    getProgramTypes: async (): Promise<ProgramTypeResponse[]> => {
        const { data } = await axiosClient.get<{ status: string; message: string; data: ProgramTypeResponse[] }>("/programmes");
        return data.data;
    },

    getProgramTypeById: async (id: string): Promise<ProgramTypeResponse> => {
        const { data } = await axiosClient.get<{ status: string; message: string; data: ProgramTypeResponse }>(`/programmes/${id}`);
        return data.data;
    },

    createProgramType: async (payload: Record<string, unknown>): Promise<ProgramTypeResponse> => {
        const { data } = await axiosClient.post<{ status: string; message: string; data: ProgramTypeResponse }>("/programmes", payload);
        return data.data;
    },

    updateProgramType: async (id: string, payload: Record<string, unknown>): Promise<ProgramTypeResponse> => {
        const { data } = await axiosClient.patch<{ status: string; message: string; data: ProgramTypeResponse }>(`/programmes/${id}`, payload);
        return data.data;
    },

    deleteProgramType: async (id: string): Promise<void> => {
        await axiosClient.delete(`/programmes/${id}`);
    }
};
