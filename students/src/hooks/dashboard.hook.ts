import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { getDashboardStatsApi, getTimetableApi } from "@apis/dashboard.api"
import type { DashboardResponse, TimetableResponse } from "@type/dashboard.type"

export const useDashboardStats = (options?: Partial<UseQueryOptions<DashboardResponse, Error>>) => useQuery<DashboardResponse, Error>({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStatsApi(),
    ...options
})

export const useTimetable = (params?: { session?: string; semester?: string; level?: string }, options?: Partial<UseQueryOptions<TimetableResponse, Error>>) => useQuery<TimetableResponse, Error>({
    queryKey: ["timetable", params],
    queryFn: () => getTimetableApi(params),
    ...options
})
