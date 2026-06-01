import axiosClient from "@configs/axios.config"
import type { GetNotificationsResponse, GetAuditLogsResponse, MarkAllReadResponse, MarkReadResponse } from "@type/notification.type"

export const getNotificationsApi = async (): Promise<GetNotificationsResponse> => {
    const { data } = await axiosClient.get<GetNotificationsResponse>("/notifications");
    return data;
}

export const markAllNotificationsReadApi = async (): Promise<MarkAllReadResponse> => {
    const { data } = await axiosClient.patch<MarkAllReadResponse>("/notifications/read-all");
    return data;
}

export const markNotificationReadApi = async (id: string): Promise<MarkReadResponse> => {
    const { data } = await axiosClient.patch<MarkReadResponse>(`/notifications/${id}/read`);
    return data;
}

export const getMyAuditLogsApi = async (params?: {
    action?: string;
    entity?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}): Promise<GetAuditLogsResponse> => {
    const { data } = await axiosClient.get<GetAuditLogsResponse>("/audit-logs/me", { params });
    return data;
}
