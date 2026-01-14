// API Response Types for Registration Module

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

// Academic Types
export interface Level {
  id: string;
  name: string;
  code: string;
}

export interface Semester {
  id: string;
  name: string;   
  isActive: boolean;
}

export interface Session {
  id: string;
  name: string;      // e.g., "2024/2025"
  isActive: boolean;
}

// Student Profile
export interface StudentLevel {
  id: string;
  name: string;
  code: string;
}

export interface StudentProfile {
  id: string;
  universityId: string;
  departmentId: string;
  programId: string;
  userId: string;
  studentId: string; // e.g., "MAT/2025/001"
  level: string; // e.g., "500"
  levelId: string;
  sessionId: string;
  isActive: boolean;
  academicStanding: 'GOOD' | 'PROBATION' | 'SUSPENDED' | string;
  probationStartDate: string | null;
  probationEndDate: string | null;
  totalCreditsEarned: number;
  currentGPA: number;
  createdAt: string;
  updatedAt: string;
  idCard: string | null;
  Level: StudentLevel;
}


// Course Types
export interface Lecturer {
  id: string;
  name: string;
  email?: string;
}

export interface CourseSchedule {
  day: string;
  time: string;
  venue: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  type: 'departmental' | 'general' | 'elective';
  isCompulsory: boolean;
  lecturer: Lecturer | string;
  schedule?: CourseSchedule;
  maxCapacity?: number;
  enrolledCount?: number;
  isRegistered?: boolean;
}

// Department Course (from /courses/my-department endpoint)
export interface DepartmentCourse {
  id: string;
  universityId: string;
  departmentId: string;
  levelId: string;
  semesterId: string;
  code: string;
  title: string;
  creditUnits: number;
  creditHours: number;
  contactHoursPerWeek: number;
  createdAt: string;
  updatedAt: string;
  semester: {
    name: string;
    isActive: boolean;
  };
  level: {
    name: string;
  };
}

export interface DepartmentCoursesResponse {
  status: string;
  count: number;
  courses: DepartmentCourse[];
}

// Registration Types
export interface RegisteredCourse {
  id: string;
  courseId: string;
  code: string;
  title: string;
  creditUnits: number;
  type: string;
  lecturer: string;
  status: 'registered' | 'pending' | 'dropped';
  registeredAt: string;
}

export interface RegistrationData {
  session: string;
  semester: string;
  totalUnits: number;
  maxAllowedUnits: number;
  registrationStatus: 'open' | 'closed';
  registrationDeadline?: string;
  courses: RegisteredCourse[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profile: StudentProfile;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user: LoginUser;
}

// Request Types
export interface RegisterCoursesRequest {
  courseIds: string[];
  semester: string;
  session: string;
}

export interface AddCourseToCartRequest {
  courseId: string;
}

// Transcript Types
export interface DeliveryMode {
  id: string;
  label: string;
  description: string;
  baseFee: number;
  estimatedDays: number;
}

export interface TranscriptRequest {
  recipientInstitution: string;
  recipientAddress: string;
  deliveryMode: string;
  destinationType?: 'local' | 'international';
  contactEmail?: string;
  contactPhone?: string;
  copies?: number;
  additionalNotes?: string;
}

export interface TranscriptRequestResponse {
  requestId: string;
  status: string;
  totalFee: number;
  paymentReference: string;
  paymentUrl: string;
  createdAt: string;
}
