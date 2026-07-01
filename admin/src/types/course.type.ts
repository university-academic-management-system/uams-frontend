export interface Course {
    id: string;
    code: string;
    title: string;
    description: string;
    units: number;
    level: string;
    semester: "FIRST" | "SECOND" | "SUMMER";
    courseType: "CORE" | "ELECTIVE";
    programTypeId: string;
    isCarryoverAllowed: boolean;
    isAssigned: boolean;
    createdAt: string;
    updatedAt: string;
    resultUpload: ResultUpload | null;
}

export interface ResultUpload {
    id: string,
    level: string,
    session: string,
    semester: string,
    courseId: string,
    draftFile: {
        key: string,
        size: number,
        filename: string,
        mimeType: string,
        studentCount: number
    },
    finalFile: null,
    status: string,
    uploadedById: string,
    uploadedAt: string,
    reviewedById: string | null,
    reviewedAt: string | null,
    reviewComments: string | null,
    approvedById: string | null,
    approvedAt: string | null,
    rejectedAt: string | null,
    rejectionReason: string | null,
    createdAt: string,
    updatedAt: string
}

export interface CreateCourseData {
    code: string;
    title: string;
    description: string;
    units: number;
    semester: "FIRST" | "SECOND" | "SUMMER";
    level: string;
    programmeId: string;
    isElective: boolean;
}

export interface CoursesApiResponse {
    status: string;
    count?: number;
    data?: Course | Course[];
    courses?: Course[];
    message?: string;
}

export interface AssignCoursePayload {
    courseId: string;
    lecturerId: string;
    session: string;
}
