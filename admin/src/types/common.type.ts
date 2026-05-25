export type ViewType =
    | 'Dashboard'
    | 'Programmes'
    | 'Students'
    | 'Lecturers'
    | 'Payments'
    | 'ID Card Management'
    | 'Timetable'
    | 'Announcements'
    | 'Settings'
    | 'Notifications'
    | 'Profile';

export interface Permission {
    id: string;
    name: string;
    key: string;
}

export interface Role {
    id: string;
    idNo: string;
    name: string;
    status: 'Student' | 'Staff';
    office: string;
    permissions: {
        createProgram: boolean;
        createCourses: boolean;
        createBilling: boolean;
        viewPayments: boolean;
        createTest: boolean;
    };
}

export interface Announcement {
    id: string;
    title: string;
    description: string;
    date: string;
    isFor?: string;
    isRead?: boolean;
}

export interface ChartDataItem {
    year: string;
    value: number;
}

export interface TransactionData {
    id: string;
    reference: string;
    amount: number;
    status: "success" | "pending" | "failed";
    paymentType: string;
    paymentMethod: string | null;
    currency: string;
    createdAt: string;
    paidAt: string | null;
    studentInfo: import("./student.type").StudentInfo | null;
}

export interface TransactionStatistics {
    totalTransactions: number;
    totalAmount: number;
}

export interface ApiResponse<T> {
    status: string;
    count?: number;
    data?: T;
    message?: string;
}
