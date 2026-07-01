export interface Attendance {
    id: string;
    date: string;
    matricNo: string;
    fullName: string;
    createdAt: string;
    updatedAt: string;
}

export interface AttendanceStudentEntry {
    studentId: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
}

export interface CreateAttendancePayload {
    courseId: string;
    date: string;
    session: string;
    students: AttendanceStudentEntry[];
}

export interface RecordAttendanceResult {
    id: string;
    enrollmentId: string;
    lecturerId: string;
    date: string;
    session: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    markedById: string;
    markedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface AttendanceResponse {
    success: boolean;
    count: number;
    data: Attendance[];
}

export interface CourseAttendanceRecord {
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
    enrollment: {
        student: {
            id: string;
            firstName: string;
            surname: string;
            otherName: string | null;
            matricNumber: string;
        };
        course: {
            id: string;
            code: string;
            title: string;
        };
    };
    lecturer: {
        id: string;
        firstName: string;
        surname: string;
        otherName: string | null;
    } | null;
}

