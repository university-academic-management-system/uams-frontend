import axiosClient from "@configs/axios.config";
import type { ApiResponse, Course } from "@type/course.type";

export const CourseService = {
  getAllCourses: async (filters?: { level?: string; semester?: string; session?: string }): Promise<ApiResponse<Course[]>> => {
    const { data } = await axiosClient.get<ApiResponse<Course[]>>("/courses", { params: filters });
    return data;
  },
};