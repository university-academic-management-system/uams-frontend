import axiosClient from "@configs/axios.config";
import type { NotificationsResponse, CreateNotificationPayload } from "@type/notification.type";

export const NotificationServices = {
    getNotifications: async (): Promise<NotificationsResponse> => {
        const { data } = await axiosClient.get("/notifications");
        return data;
    },

    createNotification: async (payload: CreateNotificationPayload) => {
        const { data } = await axiosClient.post("/notifications", payload);
        return data;
    },

    markAsRead: async (id: string) => {
        const { data } = await axiosClient.patch(`/notifications/${id}/read`);
        return data;
    },

    markAllAsRead: async () => {
        const { data } = await axiosClient.patch("/notifications/read-all");
        return data;
    },
};
