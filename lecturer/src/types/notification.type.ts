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

export type CreateRecipientType = "ALL" | "ROLE";

export interface CreateNotificationPayload {
    recipientType: CreateRecipientType;
    targetRole?: string;
    title: string;
    message: string;
    type: NotificationType;
}