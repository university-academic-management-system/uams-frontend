import axiosClient from "@configs/axios.config";
import type { ApiResponse, Course, CourseEnrollment } from "@type/course.type";

export const CourseService = {
  getAllCourses: async (filters?: { level?: string; semester?: string; session?: string }): Promise<ApiResponse<Course[]>> => {
    const { data } = await axiosClient.get<ApiResponse<Course[]>>("/courses", { params: filters });
    return data;
  },

  getStudentsForCourse: async (courseId: string, session?: string): Promise<ApiResponse<CourseEnrollment[]>> => {
    const { data } = await axiosClient.get<ApiResponse<CourseEnrollment[]>>(`/courses/${courseId}/students`, {
      params: session ? { session } : undefined,
    });
    return data;
  },
};