import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query"
import { getNotificationsApi, getMyAuditLogsApi, markAllNotificationsReadApi, markNotificationReadApi } from "@apis/notification.api"
import type { GetNotificationsResponse, GetAuditLogsResponse, MarkAllReadResponse, MarkReadResponse } from "@type/notification.type"

export const useNotifications = (options?: Partial<UseQueryOptions<GetNotificationsResponse, Error>>) => useQuery<GetNotificationsResponse, Error>({
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

export const useMyAuditLogs = (params?: {
    action?: string;
    entity?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}, options?: Partial<UseQueryOptions<GetAuditLogsResponse, Error>>) => useQuery<GetAuditLogsResponse, Error>({
    queryKey: ["audit-logs", params],
    queryFn: () => getMyAuditLogsApi(params),
    ...options
})
