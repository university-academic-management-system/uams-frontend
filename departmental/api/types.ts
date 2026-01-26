export type ProgramType = "UG" | "PGD" | "Masters" | "PhD";

/** PROGRAMS **/

export interface Program {
  id: string;
  name: string;
  code: string | null;
  type: string;
  duration: number;
  description: string | null;
  universityId: string;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramTypeResponse {
  id: string;
  name: string;
  type: string;
  code: string;
  description: string;
  isActive: boolean;
  universityId: string;
}

/**
 * ✅ Program creation payload
 * ❗ IDs are derived from JWT — NOT sent from frontend
 */
export interface CreateProgramData {
  name: string;
  code: string;
  type: string;
  duration: number;
  description: string;
}

/** COURSES **/

export interface Course {
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

export interface CreateCourseData {
  universityId: string;
  departmentId: string;
  semesterId: string;
  code: string;
  title: string;
  creditUnits: number;
  creditHours: number;
  contactHoursPerWeek: number;
  levelId?: string;
  programTypeId: string;
}

export interface CoursesApiResponse {
  status: string;
  count: number;
  courses: Course[];
  message?: string;
}
export interface CourseAssignment {
  courseId: string;
  role: "MAIN" | "ASSISTANT" | "LAB_ASSISTANT";
}

export interface AssignCoursePayload {
  courseAssignments: CourseAssignment[];
}
