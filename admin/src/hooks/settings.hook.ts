import { SystemServices } from "@services/system.service";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { DepartmentSettings } from "@type/settings.type";
import type { ApiResponse } from "@type/common.type";

export const SettingsHooks = {
    useDepartmentSettings: (options?: Partial<UseQueryOptions<ApiResponse<DepartmentSettings>>>) => 
        useQuery<ApiResponse<DepartmentSettings>>({
            queryKey: ["department-settings"],
            queryFn: SystemServices.getDepartmentSettings,
            ...options,
        }),
};
