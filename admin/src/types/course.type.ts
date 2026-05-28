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
    createdAt: string;
    updatedAt: string;
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
