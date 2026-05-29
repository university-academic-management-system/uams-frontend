export interface Staff {
    id: string;
    staffNumber: string;
    fullName: string;
    firstName?: string;
    surname?: string;
    otherName?: string;
    email: string;
    phone?: string | null;
    gender?: string;
    department?: string;
    level?: string;
    courses?: string;
    role?: string;
    staffRoles?: string[];
    status?: string;
    totalAssignedCourses?: number;
    activeFeatures?: {
        results: boolean;
        finance: boolean;
        timetable: boolean;
    };
}

export interface CreateLecturerPayload {
    type: string;
    firstName: string;
    surname: string;
    otherName: string;
    email: string;
    gender: string;
    staffNumber: string;
    title: string;
    phone: string;
    staffRoles: string[];
    faculty: string;
    department: string;
    // Keep these for backward compatibility or extra data if needed
    highestDegree?: string;
    category?: string;
    password?: string;
    departmentId?: string;
    universityId?: string;
}
