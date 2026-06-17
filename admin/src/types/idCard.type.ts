export interface Student {
    id: string;
    idNo: string;
    name: string;
    matric: string;
    faculty: string;
    department: string;
    level: string;
    graduationDate: string;
    hasPaidIDCardFee: boolean;
    avatar: string;
}

export interface IDCardSettings {
    backTemplate?: string;
    frontTemplate?: string;
    backDescription?: string;
    backDisclaimer?: string;
    signature?: string;
}

export type IDCardRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface IDCardStudent {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    otherName: string;
    matricNumber: string;
    registrationNo: string;
    phone: string;
    level: string;
    admissionYear: number;
    admissionSession: string;
    currentSession: string;
    registrationStatus: string;
    academicStanding: string;
    totalCreditsEarned: number;
    totalCreditsAttempted: number;
    cgpa: number;
    gpa: number;
    sgpa: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDCardRequest {
    id: string;
    studentId: string;
    status: IDCardRequestStatus;
    file: Record<string, unknown>;
    paymentRef: string;
    remarks: string;
    student: IDCardStudent;
    createdAt: string;
    updatedAt: string;
}

export interface IDCardRequestsQuery {
    status?: IDCardRequestStatus;
    studentId?: string;
    department?: string;
}
