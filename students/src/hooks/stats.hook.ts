import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { getDashboardStatsApi } from "@services/stats.api"
import type { DashboardResponse } from "@type/dashboard.type"

export const useDashboardStats = (options?: Partial<UseQueryOptions<DashboardResponse, Error>>) => useQuery<DashboardResponse, Error>({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStatsApi(),
    ...options
})
