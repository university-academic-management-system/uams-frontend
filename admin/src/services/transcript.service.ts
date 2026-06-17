import axiosClient from "@configs/axios.config";
import type { TranscriptQueryParams, TranscriptStatus } from "@type/transcript.type";

export const TranscriptServices = {
    // Get all transcript applications (paginated, filterable)
    getTranscripts: async (params?: TranscriptQueryParams) => {
        const { data } = await axiosClient.get("/transcripts", {
            params: {
                status: params?.status,
                deliveryMethod: params?.deliveryMethod,
                page: params?.page ?? 1,
                limit: params?.limit ?? 10,
            },
        });
        return data;
    },

    // Update transcript application status
    updateTranscriptStatus: async (id: string, status: TranscriptStatus) => {
        const { data } = await axiosClient.patch(`/transcripts/${id}`, { status });
        return data;
    },
};
