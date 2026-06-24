// @type/student.type.ts

export type StudentLevel = 
  | "L100" | "L200" | "L300" | "L400" 
  | "L500" | "L600" | "L700" | "L800";

export const STUDENT_LEVELS: StudentLevel[] = ["L100", "L200", "L300", "L400", "L500", "L600", "L700", "L800"];

export type RegistrationStatus = "PENDING" | "REGISTERED" | "INCOMPLETE" | "CLEARED";
export type AcademicStanding = "GOOD_STANDING" | "PROBATION" | "SUSPENDED" | "WARNING" | "WITHDRAWN";
export type ProgrammeType = "DIPLOMA" | "UNDERGRADUATE" | "POSTGRADUATE" | "SANDWICH";
export type degreeAwarded = "BS.c" | "MS.c" | "Ph.D" | "POSTGRADUATE";

export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  surname:string;
  otherName: string;
  matricNumber: string;
  gender: string;
  registrationNo: string;
  phone: string;
  level: StudentLevel;
  admissionYear: number;
  admissionSession: string;
  currentSession: string;
  degreeAwarded: degreeAwarded;
  registrationStatus: RegistrationStatus;
  academicStanding: AcademicStanding;
  totalCreditsEarned: number;
  totalCreditsAttempted: number;
  carryoverCourses: number;
  cgpa: number;
  gpa: number;
  sgpa: number;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;              
  email: string;
  role: string;              
  status: string;           
  studentProfile: StudentProfile;
  programmeType: ProgrammeType;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export type StudentsResponse = ApiResponse<Student>;