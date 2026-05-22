import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { NotificationServices } from "@services/notification.service";
import type { Notification } from "@type/notification.type";

export const NotificationHook = {
    useNotifications: (
        options?: Partial<UseQueryOptions<Notification[]>>
    ) =>
        useQuery<Notification[]>({
            queryKey: ["notifications"],
            queryFn: async () => {
                const response = await NotificationServices.getNotifications();
                return response?.data || [];
            },
            staleTime: 2 * 60 * 1000,
            ...options,
        }),

    useMarkAllAsRead: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: () => NotificationServices.markAllAsRead(),
            onSuccess: () => {
                queryClient.setQueryData<Notification[]>(["notifications"], (old) =>
                    old?.map((n) => ({ ...n, read: true })) ?? []
                );
            },
        });
    },

    useMarkAsRead: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => NotificationServices.markAsRead(id),
            onSuccess: (_data, id) => {
                queryClient.setQueryData<Notification[]>(["notifications"], (old) =>
                    old?.map((n) => (n.id === id ? { ...n, read: true } : n)) ?? []
                );
            },
        });
    },
};