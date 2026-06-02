export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";
export type RecipientType = "SINGLE" | "ROLE";

export interface Notification {
    id: string;
    userId: string;
    recipientType: RecipientType;
    targetRole: string;
    title: string;
    message: string;
    read: boolean;
    type: NotificationType;
    link: string;
    expiresAt: string;
    createdAt: string;
}

export interface NotificationsResponse {
    status: string;
    message: string;
    data: Notification[];
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

export type CreateRecipientType = "ALL" | "ROLE";

export interface CreateNotificationPayload {
    recipientType: CreateRecipientType;
    targetRole?: string;
    title: string;
    message: string;
    type: NotificationType;
}