export interface Notification {
    id: string;
    userId: string;
    recipientType: string;
    targetRole: string;
    title: string;
    message: string;
    read: boolean;
    type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
    link: string | null;
    expiresAt: string | null;
    createdAt: string;
}

export interface GetNotificationsResponse {
    status: string;
    message: string;
    data: Notification[];
}

export interface MarkAllReadResponse {
    status: string;
    message: string;
    data: {
        updatedCount: number;
    };
}

export interface MarkReadResponse {
    status: string;
    message: string;
    data: Notification;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    details: Record<string, string>;
    ipAddress: string;
    createdAt: string;
    user: {
        email: string;
        role: string;
    };
}

export interface GetAuditLogsResponse {
    status: string;
    message: string;
    data: {
        data: AuditLog[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}
