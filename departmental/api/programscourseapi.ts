import api from "./axios";
import { getCurrentDepartmentId, getCurrentUniversityId } from "../utils/auth";
import {
  Program,
  Course,
  CreateCourseData,
  CoursesApiResponse,
  CreateProgramData,
  ProgramTypeResponse,
} from "./types";

export const programsCoursesApi = {
  /** PROGRAMS **/
  
  // ✅ New Endpoint: Get Program Types (Diploma, BSc, etc.)
  getProgramTypes: async (): Promise<ProgramTypeResponse[]> => {
    // This endpoint seems to be public or just authenticated; no specific param needed per user request
    const response = await api.get<ProgramTypeResponse[]>("/program-types");
    return response.data;
  },

  getProgramsByDepartment: async (): Promise<Program[]> => {
    const departmentId = getCurrentDepartmentId();
    if (!departmentId) {
      throw new Error("No department ID found in token");
    }

    const response = await api.get<Program[]>(
      `/program/department/${departmentId}`
    );
    return response.data;
  },

  createProgram: async (formData: CreateProgramData): Promise<Program> => {
    // 🔐 Ensure user is authenticated
    const departmentId = getCurrentDepartmentId();
    const universityId = getCurrentUniversityId();

    if (!departmentId || !universityId) {
      throw new Error("Missing required IDs from authentication token");
    }

    // ❗ Payload MUST match Postman (IDs come from JWT, not body)
    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      programTypeId: formData.type, // Map the selected ID to programTypeId
      duration: Number(formData.duration),
      description: formData.description?.trim() || "",
    };

    console.log("🚀 Payload sent to Program Service:");

    const response = await api.post<Program>(`/program`, payload);
    return response.data;
  },

  /** COURSES **/
  /** GET COURSES FOR LOGGED-IN DEPARTMENT */
  getCoursesByDepartment: async (): Promise<CoursesApiResponse> => {
    const departmentId = getCurrentDepartmentId();
    if (!departmentId) {
      throw new Error("No department ID found in token");
    }

    const response = await api.get<CoursesApiResponse>(
      "/courses/my-department"
    );

    return response.data;
  },

  /** CREATE COURSE */
  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    const payload = {
      ...courseData,
      universityId: getCurrentUniversityId(),
      departmentId: getCurrentDepartmentId(),
    };

    const response = await api.post<Course>("/courses", payload);
    return response.data;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}`);
  },
};
