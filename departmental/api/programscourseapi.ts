import api from "./axios";
import {
  getCurrentDepartmentId,
  getCurrentUniversityId,
  getCurrentTenantId,
} from "../utils/auth";
import {
  Program,
  CreateProgramData,
  Course,
  CreateCourseData,
  CoursesApiResponse,
} from "./types"; // Import from types file

export const programsCoursesApi = {
  // Programs - GET programs for current department (from token)
  getProgramsByDepartment: async (): Promise<Program[]> => {
    const departmentId = getCurrentDepartmentId();
    if (!departmentId) throw new Error("No department ID found in token");

    const response = await api.get<Program[]>(
      `/api/program/department/${departmentId}`
    );
    return response.data;
  },

  createProgram: async (programData: CreateProgramData): Promise<Program> => {
    console.log("Creating program with data:", programData);

    // Add missing fields from token if not provided
    const dataToSend = {
      ...programData,
      tenantId: getCurrentTenantId(), // Add tenantId from token
    };

    const response = await api.post<Program>(
      `/api/university-admin/programs`,
      dataToSend
    );
    return response.data;
  },

  // Courses - GET courses for current department (from token)
  getCoursesByDepartment: async (): Promise<CoursesApiResponse> => {
    const departmentId = getCurrentDepartmentId();
    if (!departmentId) throw new Error("No department ID found in token");

    // First try the my-department endpoint
    try {
      const response = await api.get<CoursesApiResponse>(
        `/api/courses/my-department`
      );
      return response.data;
    } catch (error) {
      // If my-department fails, try with department ID
      console.log("my-department endpoint failed, trying with department ID");
      const response = await api.post<CoursesApiResponse>(
        `/api/courses/department`,
        { departmentId }
      );
      return response.data;
    }
  },

  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    console.log("Creating course with data:", courseData);

    // Get IDs from token as fallbacks
    const universityId = getCurrentUniversityId();
    const departmentId = getCurrentDepartmentId();

    // Add missing fields from token if not provided
    const dataToSend = {
      ...courseData,
      universityId: courseData.universityId || universityId,
      departmentId: courseData.departmentId || departmentId,
    };

    const response = await api.post<Course>(`/api/courses`, dataToSend);
    return response.data;
  },
};
