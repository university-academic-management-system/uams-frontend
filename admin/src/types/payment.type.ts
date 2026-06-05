export interface TransactionsListProps {
    onBack: () => void;
    programTypeId?: string | null;
    programTypeName?: string;
}

export interface TransactionItem {
    transactionReference: string;
    transactionId: string;
    paymentFrom: string;
    studentName: string;
    studentRegNumber: string;
    paymentFor: string;
    paymentType: string;
    amount: string;
    currency: string;
    date: string;
    status: string;
    sessionId: string;
    sessionName: string;
    statusBadge: string;
}

export interface ProgramPayments {
    programInfo: { id: string; name: string; code: string };
    accessFee: TransactionItem[];
    idCardFee: TransactionItem[];
    transcriptFee: TransactionItem[];
    otherPayments: TransactionItem[];
}

export interface ProgramTypeSummary {
    id: string;
    name: string;
    code: string;
    accessFee: { amount: number };
    idCardFee: { amount: number };
    transcriptFee: { amount: number };
}

// Updated to match actual backend response
export interface TranscriptApplication {
    id: string;
    status: string;
    paymentStatus: string;
    recipientName: string;
    recipientEmail: string;
    deliveryMethod: string;
    purpose: string;
    feeAmount: string;
    institutionName: string;
    createdAt: string;
    paidAt: string | null;
    student: {
        id: string;
        fullName: string;
        email: string;
        registrationNo: string;
        studentId: string;
        department: string;
    };
}

export interface PaymentMetadata {
    userId: string;
    studentId: string;
    paymentType: string;
    session: string;
    level: string;
    semester: string;
    redirectUrl: string;
    transcriptRequestId?: string;
    transcriptRequestReference?: string;
    deliveryMethod?: string;
}

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
    status: string;
    metadata: PaymentMetadata;
    createdAt: string;
    updatedAt: string;
    student?: {
        matricNumber: string;
        registrationNo: string;
        userId: string;
        firstName: string;
        surname: string;
        otherName: string;
        degreeAwarded: string;
        degreeAwardedCode: string;
    };
}

export interface PaymentPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaymentsResponse {
    status: string;
    message: string;
    data: Payment[];
    pagination: PaymentPagination;
}

export interface PaymentSummaryItem {
    title: string;
    code: string;
    paymentSummaries: Record<string, number>;
}

export interface PaymentsSummaryResponse {
    status: string;
    message: string;
    data: Record<string, PaymentSummaryItem>;
}