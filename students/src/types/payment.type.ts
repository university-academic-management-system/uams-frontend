import type { PaymentType } from "./registration.type";

export interface Payment {
    id: string;
    studentId: string;
    amount: number;
    reference: string;
    paymentChannel: string;
    type: string;
    session: string;
    level: string;
    semester: string;
    status: "PAID" | "PENDING" | "FAILED";
    metadata: any;
    createdAt: string;
    updatedAt: string;
}

export interface GetPaymentsResponse {
    status: string;
    message: string;
    data: Payment[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface PaymentResponse {
    status: string;
    message: string;
    data: Payment;
}
