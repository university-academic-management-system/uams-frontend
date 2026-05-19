export type CourseLevel = "100" | "200" | "300" | "400";
export type Semester = "FIRST" | "SECOND" | "THIRD";
export type CourseType = "CORE" | "ELECTIVE" | "GST" | "SIWES" | "PROJECT";

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  units: number;
  level: CourseLevel;
  semester: Semester;
  session?: string;
  courseType: CourseType;
  programmeTypeId: string;
  isCarryoverAllowed: boolean;
  createdAt: string;
  updatedAt: string;
}

// API response wrapper
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}