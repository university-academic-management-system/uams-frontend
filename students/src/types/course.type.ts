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
    session?: string;
    page?: number;
    limit?: number;
}

export interface Result {
    id: string;
    studentId: string;
    courseId: string;
    session: string;
    semester: string;
    level: string;
    ca: number;
    examScore: number;
    totalScore: number;
    grade: string;
    gradePoint: number;
    gradePointCredit: number;
    status: string;
    isCarryover: boolean;
    createdAt: string;
    updatedAt: string;
    course: Course;
    lecturer: {
        title: string;
        firstName: string;
        surname: string;
        otherName: string;
        email: string;
        faculty: string;
        department: string;
    }
}

export interface ResultsData {
    gpa: number;
    cgpa: number;
    results: Result[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface ResultsResponse {
    status: string;
    message: string;
    data: ResultsData;
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

export interface Attendance {
    id: string;
    enrollmentId: string;
    lecturerId: string;
    date: string;
    startTime: string;
    endTime: string;
    session: string;
    semester: string;
    level: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    markedById: string;
    markedAt: string;
    remarks: string | null;
    createdAt: string;
    updatedAt: string;
    enrollment?: {
        student: {
            id: string;
            firstName: string;
            surname: string;
            otherName: string;
            matricNumber: string;
        };
        course: {
            id: string;
            code: string;
            title: string;
        };
    };
    lecturer?: {
        id: string;
        firstName: string;
        surname: string;
        otherName: string;
    };
}

export interface AttendanceResponse {
    status: string;
    message: string;
    data: Attendance[];
}
