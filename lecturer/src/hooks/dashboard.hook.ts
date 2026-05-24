// @hooks/dashboard.hook.ts
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { DashboardService } from "@services/dashboard.service";
import type { DashboardTotals } from "@type/dashboard.type";

export const DashboardHook = {
  useTotals: (options?: Partial<UseQueryOptions<DashboardTotals>>) =>
    useQuery<DashboardTotals>({
      queryKey: ["dashboard", "totals"],
      queryFn: () => DashboardService.getTotals(),
      staleTime: 5 * 60 * 1000, 
      ...options,
    }),
};