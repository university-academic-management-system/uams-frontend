import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { getDashboardStatsApi, getTimetableApi } from "@apis/dashboard.api"
import type { StudentDashboardData, TimetableResponse } from "@type/dashboard.type"

export const useDashboardStats = (options?: Partial<UseQueryOptions<StudentDashboardData, Error>>) => useQuery<StudentDashboardData, Error>({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStatsApi(),
    ...options
})

export const useTimetable = (params?: { session?: string; semester?: string; level?: string }, options?: Partial<UseQueryOptions<TimetableResponse["data"], Error>>) => useQuery<TimetableResponse["data"], Error>({
    queryKey: ["timetable", params],
    queryFn: () => getTimetableApi(params),
    ...options
})
