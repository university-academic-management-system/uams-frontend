export type TranscriptStatus = "PENDING" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED" | "READY";

export type DeliveryMethod = "DIGITAL_DELIVERY" | "PHYSICAL_PICKUP";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface TranscriptStudent {
    id: string;
    userId: string;
    firstName: string;
    surname: string;
    otherName: string;
    matricNumber: string;
    registrationNo: string;
    phone?: string;
    level: string;
    department: string;
    faculty: string;
    admissionYear?: number;
    admissionSession?: string;
    currentSession?: string;
    registrationStatus?: string;
    academicStanding?: string;
    totalCreditsEarned?: number;
    totalCreditsAttempted?: number;
    cgpa?: number;
    gpa?: number;
    sgpa?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface TranscriptApplication {
    id: string;
    reference: string;
    studentId: string;
    address: string;
    purpose: string;
    deliveryMethod: DeliveryMethod;
    status: TranscriptStatus;
    paymentReference: string;
    createdAt: string;
    updatedAt: string;
    student: TranscriptStudent;
    paymentStatus: PaymentStatus;
}

export interface TranscriptQueryParams {
    status?: TranscriptStatus;
    deliveryMethod?: DeliveryMethod;
    page?: number;
    limit?: number;
}

export interface TranscriptListResponse {
    status: string;
    message: string;
    data: {
        transcripts: TranscriptApplication[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
