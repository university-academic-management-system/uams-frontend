import { DashboardServices } from "@services/dashboard.service";
import { AnnouncementServices } from "@services/announcement.service";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Announcement, ChartDataItem } from "@type/common.type";

// ── Hooks ────────────────────────────────────────────────────────────

export const DashboardHook = {
    useRevenueStats: (
        options?: Partial<UseQueryOptions<ChartDataItem[]>>
    ) =>
        useQuery<ChartDataItem[]>({
            queryKey: ["dashboard", "revenue"],
            queryFn: async () => {
                const response = await DashboardServices.getAnnualRevenueStats();
                const data = response?.data || [];
                return data.map((item: any) => ({
                    year: `${Number(item.year) - 1}/${item.year}`,
                    value: item.revenue,
                }));
            },
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useEnrollmentGrowth: (
        options?: Partial<UseQueryOptions<ChartDataItem[]>>
    ) =>
        useQuery<ChartDataItem[]>({
            queryKey: ["dashboard", "enrollment"],
            queryFn: async () => {
                const response = await DashboardServices.getRegistrationGrowthStats();
                const data = response?.data || [];
                return data.map((item: any) => ({
                    year: item.year.toString(),
                    value: item.count,
                }));
            },
            staleTime: 5 * 60 * 1000,
            ...options,
        }),

    useAnnouncements: (
        options?: Partial<UseQueryOptions<Announcement[]>>
    ) =>
        useQuery<Announcement[]>({
            queryKey: ["dashboard", "announcements"],
            queryFn: async () => {
                const response = await AnnouncementServices.getAnnouncements();
                const data = response?.data || [];
                return data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    description: item.body,
                    date: new Date(item.createdAt).toLocaleDateString("en-CA"),
                    isFor: item.isFor,
                    isRead: item.isRead,
                }));
            },
            staleTime: 5 * 60 * 1000,
            ...options,
        }),
};
