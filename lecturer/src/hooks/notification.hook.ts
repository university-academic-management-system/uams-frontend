import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { getMyAuditLogsApi, getNotificationsApi, markAllNotificationsReadApi, markNotificationReadApi } from "@services/notification.service";
import type { MarkAllReadResponse, MarkReadResponse, NotificationsResponse } from "@type/notification.type";
import type { GetAuditLogsResponse } from "@type/notification.type"; 

export const useNotifications = (options?: Partial<UseQueryOptions<NotificationsResponse, Error>>) => useQuery<NotificationsResponse, Error>({
    queryKey: ["notifications"],
    queryFn: () => getNotificationsApi(),
    ...options
})

export const useMarkAllNotificationsRead = (options?: UseMutationOptions<MarkAllReadResponse, Error, void>) => useMutation<MarkAllReadResponse, Error, void>({
    mutationFn: () => markAllNotificationsReadApi(),
    ...options
})

export const useMarkNotificationRead = (options?: UseMutationOptions<MarkReadResponse, Error, string>) => useMutation<MarkReadResponse, Error, string>({
    mutationFn: (id: string) => markNotificationReadApi(id),
    ...options
})

export const useMyAuditLogs = (
  params?: {
    action?: string;
    entity?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  },
  options?: Partial<UseQueryOptions<GetAuditLogsResponse, Error>>
) =>
  useQuery<GetAuditLogsResponse, Error>({
    queryKey: ["audit-logs", params],
    queryFn: () => getMyAuditLogsApi(params),
    ...options,
  });