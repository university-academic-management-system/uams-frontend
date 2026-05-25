export interface Course {
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
    isRegistered: boolean;
    isCarryover: boolean;
}

export interface CoursesData {
    courses: Course[];
    carryOverCourses: Course[];
    registeredCreditUnit: number;
    maxCreditUnit: number;
}

export interface CoursesResponse {
    status: string;
    message: string;
    data: CoursesData;
}

export interface CoursesQueryParams {
    level?: string;
    semester?: string;
}

export interface RegisterCoursesData {
    courses: string[];
}

export interface RegisterCoursesResponse {
    status: string;
    message: string;
    data: {
        registeredCount: number;
        failedCount: number;
    };
}
