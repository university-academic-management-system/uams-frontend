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
        const { data } = await axiosClient.get("/audit-logs", {
            params: { page, limit, search, action, entity, startDate, endDate }
        });
        return data;
    },
}
