// Common API response wrapper (adjust if your backend uses a different shape)
export interface ApiResponse<T> {
  status: string;       // "success" | "error"
  message: string;
  data: T;
}

// A single result upload record (pending or approved)
export interface ResultUpload {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  session: string;          // e.g., "2024/2025"
  semester: string;         // "FIRST" | "SECOND"
  level: string;            // e.g., "100", "200"
  uploaderId: string;
  uploaderName: string;
  status: "DRAFT" | "REJECTED" | "APPROVED";
  rejectionReason?: string;
  fileUrl?: string;         // available after final upload
  createdAt: string;
  updatedAt: string;
}

// Response for endpoints that return a list of ResultUpload
export type ResultUploadsResponse = ApiResponse<ResultUpload[]>;

// Payload for uploading draft results (Lecturer)
export interface UploadDraftPayload {
  courseId: string;
  session: string;
  file: File;
}

// Payload for rejecting draft results
export interface RejectPayload {
  reason: string;
}


export interface TranscriptResponse {
  studentId: string;
  studentName: string;
  program: string;
  sessionResults: Array<{
    session: string;
    semester: string;
    gpa: number;
    cgpa: number;
    courses: Array<{
      code: string;
      title: string;
      creditUnit: number;
      grade: string;
      gradePoint: number;
    }>;
  }>;
}

export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  session: string;
  semester: string;
  level: string;
  ca: number | null;
  examScore: number | null;
  totalScore: number | null;
  grade: string | null;
  gradePoint: number;
  status: string;
  isCarryover: boolean;
  retakeCount: number;
  previousAttemptGrade: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    firstName: string;
    surname: string;
    otherName: string;
    matricNumber: string;
  };
  course: {
    code: string;
    title: string;
    units: number;
    courseType: string;
  };
  gradePointCredit: number;
}

export interface CourseResultsResponse {
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