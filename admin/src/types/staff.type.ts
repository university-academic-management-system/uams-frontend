export interface Staff {
    id: string;
    email: string;
    role?: string;
    status?: string;
    createdAt?: string;
    studentProfile: null;
    staffProfile?: {
        id: string;
        userId: string;
        surname: string;
        firstName: string;
        otherName: string;
        staffNumber: string;
        phone: string;
        department: string;
        faculty: string;
        staffRoles: string[];
        title: string;
        gender: string;
        createdAt: string;
        updatedAt: string;
        lecturedCourses: Array<{
            id: string;
            courseId: string;
            lecturerId: string;
            session: string;
            course: {
                id: string;
                code: string;
                title: string;
                description: string;
                units: number;
                level: string;
                semester: string;
                courseType: string;
                status: string;
                programmeId: string;
                isCarryoverAllowed: boolean;
                courseRepId: string | null;
                assistantCourseRepId: string | null;
                classRepId: string | null;
                assistantClassRepId: string | null;
                progressionRuleId: string | null;
                createdAt: string;
                updatedAt: string;
            };
        }>;
    };
}

export interface CreateLecturerPayload {
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
    password?: string;
}
