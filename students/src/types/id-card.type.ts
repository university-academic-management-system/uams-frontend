export type IdCardStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface IdCardStudent {
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

export interface IdCardRequest {
    id: string;
    studentId: string;
    status: IdCardStatus;
    file: any;
    paymentRef: string;
    remarks: string;
    student: IdCardStudent;
    createdAt: string;
    updatedAt: string;
}

export interface GetIdCardsResponse {
    status: string;
    message: string;
    data: IdCardRequest[];
}

export interface IdCardQueryParams {
    status?: IdCardStatus;
    studentId?: string;
    department?: string;
}
