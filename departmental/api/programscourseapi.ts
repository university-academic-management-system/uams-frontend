import api from "./axios";
import { getCurrentDepartmentId, getCurrentUniversityId } from "../utils/auth";
import {
  Program,
  Course,
  CreateCourseData,
  CoursesApiResponse,
  CreateProgramData,
} from "./types";

export const programsCoursesApi = {
  /** PROGRAMS **/

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
      type: formData.type,
      duration: Number(formData.duration),
      description: formData.description?.trim() || null,
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
