export type CourseLevel = "L100" | "L200" | "L300" | "L400";
export type Semester = "FIRST" | "SECOND" | "THIRD";
export type CourseType = "CORE" | "ELECTIVE" | "GST" | "SIWES" | "PROJECT";

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
  isOwn?: boolean;
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

// API response wrapper
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface CourseStudentProfile {
  id: string;
  firstName: string;
  surname: string;
  otherName: string;
  matricNumber: string;
  email: string;
  passportS3Key:string | null;
  registrationNo: string;
  level: string;
  admissionSession: string;
  admissionYear: number;
  gender: string;
  phone: string;
  registrationStatus: string;
  academicStanding: string;
  cgpa: number | null;
  department: string;
  faculty: string;
}

export interface CourseEnrollment {
  enrollmentId: string;
  session: string;
  semester: string;
  level: string;
  status: string;
  isCarryover: boolean;
  ca: number | null;
  examScore: number | null;
  totalScore: number | null;
  grade: string | null;
  gradePoint: number | null;
  student: CourseStudentProfile;
}