export type StudentRole = 'Class Rep' | 'Dept Rep' | 'None' | 'Bachelors' | 'PGD' | 'Masters';

export type StudentStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type StudentLevel = 'L100' | 'L200' | 'L300' | 'L400' | 'L500' | 'L600' | 'L700' | 'L800';

export interface StudentFilters {
    status?: StudentStatus;
    level?: StudentLevel;
    session?: string;
}

export interface Student {
    id: string;
    email: string;
    role: string;
    status: string;
    fullName: string;
    firstName: string;
    surname: string;
    otherName?: string;
    matricNumber?: string;
    registrationNo?: string;
    phone?: string | null;
    gender?: string;
    level?: string;
    department?: string;
    faculty?: string;
    admissionMode?: string;
    admissionYear?: number;
    admissionSession?: string;
    entryQualification?: string;
    degreeCourse?: string;
    courseDuration?: string;
    degreeDuration?: string;
    degreeAwarded?: string;
    degreeAwardedCode?: string;
    registrationStatus?: string;
    cgpa?: number | null;
    createdAt: string;
    studentProfile?: any;
}

export interface CreateStudentPayload {
    type: "STUDENT";
    firstName: string;
    surname: string;
    otherName?: string;
    email: string;
    gender: string;
    matricNumber: string;
    registrationNo?: string;
    phone?: string;
    level: string;
    faculty: string;
    department: string;
    admissionYear?: number;
    admissionSession?: string;
    admissionMode?: string;
    entryQualification?: string;
    degreeAwardedCode?: string;
    degreeCourse?: string;
    degreeDuration?: string;
    password?: string;
}

export interface StudentProfile {
    id: string;
    universityId: string;
    departmentId: string;
    programId: string;
    userId: string;
    studentId: string;
    level: string;
    levelId: string;
    sessionId: string;
    isActive: boolean;
    academicStanding: string;
    probationStartDate: string | null;
    probationEndDate: string | null;
    totalCreditsEarned: number;
    currentGPA: string;
    createdAt: string;
    updatedAt: string;
    idCard: string | null;
    Department: {
        name: string;
        code: string;
        type: string;
        description: string | null;
    };
    Level: {
        id: string;
        name: string;
    };
    Program: {
        id: string;
        name: string;
        programTypeId: string;
        programType: {
            id: string;
            name: string;
            type: string;
            code: string;
        };
    };
    user: {
        fullName: string;
        email: string;
        phone: string;
        avatar: string | null;
        Roles: Array<{
            name: string;
            description: string;
        }>;
    };
    session: {
        id: string;
        name: string;
        isActive: boolean;
    };
    activeSemester: Array<{
        id: string;
        name: string;
        startDate: string;
        endDate: string;
    }>;
}

export interface StudentInfo {
    studentId: string;
    registrationNo: string | null;
    fullName: string;
    email: string;
}
