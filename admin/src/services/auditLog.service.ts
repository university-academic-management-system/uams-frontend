import type { AuditLogsResponse } from "@type/audit.type"
import axiosClient from "@configs/axios.config"

export const AuditLogServices = {
    getAuditLogs: async (
        page = 1, 
        limit = 20, 
        search = "", 
        action = "", 
        entity = "", 
        startDate = "", 
        endDate = ""
    ): Promise<AuditLogsResponse> => {
        const params = Object.fromEntries(
            Object.entries({ page, limit, search, action, entity, startDate, endDate })
                .filter(([, v]) => v !== "" && v !== undefined && v !== null)
        );
        const { data } = await axiosClient.get("/audit-logs", { params });
        return data;
    },
}
