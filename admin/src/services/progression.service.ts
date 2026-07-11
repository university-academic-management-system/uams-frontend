import axiosClient from "@configs/axios.config";
import type { ApiResponse } from "@type/common.type";

export interface ProgressionResult {
    processed: number;
    total: number;
    failed: number;
    failedIds: string[];
}

export interface ProgressionJob {
    jobId: string;
    session: string;
    newSession: string;
    status: string;
    processed: number;
    total: number;
    failed: number;
    percent: number;
    result?: ProgressionResult;
    createdAt: number;
    finishedAt: number;
}

export interface ProgressionStartResponse {
    jobId: string;
    session: string;
    newSession: string;
}

export interface ProgressionRetryResponse {
    jobId: string;
    status: string;
}

export const ProgressionServices = {
    startProgression: async (payload: { session?: string; newSession?: string; level?: string }) => {
        const { data } = await axiosClient.post<ApiResponse<ProgressionStartResponse>>(
            "/api/progression",
            payload,
        );
        return data;
    },
    getProgressionStatus: async (jobId: string) => {
        const { data } = await axiosClient.get<ApiResponse<ProgressionJob>>(
            `/api/progression/${jobId}`,
        );
        return data;
    },
    retryProgression: async (jobId: string) => {
        const { data } = await axiosClient.post<ApiResponse<ProgressionRetryResponse>>(
            `/api/progression/${jobId}/retry`,
        );
        return data;
    },
};
