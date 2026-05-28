import axiosClient from "@configs/axios.config"
import type { Course, CreateCourseData, CoursesApiResponse } from "@type/course.type"

export const CourseServices = {
    getCourses: async (filters?: { level?: string; semester?: string }): Promise<CoursesApiResponse> => {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters || {}).filter(([, v]) => v !== "" && v !== undefined && v !== null)
        );
        const { data } = await axiosClient.get<CoursesApiResponse>("/courses", { params: cleanFilters });
        return data;
    },

    createCourse: async (courseData: CreateCourseData): Promise<Course> => {
        const { data } = await axiosClient.post<Course>("/courses", courseData);
        return data;
    },

    deleteCourse: async (courseId: string): Promise<void> => {
        await axiosClient.delete(`/courses/${courseId}`);
    },

    updateCourse: async (courseId: string, courseData: Record<string, unknown>): Promise<Course> => {
        const { data } = await axiosClient.patch<Course>(`/courses/${courseId}`, courseData);
        return data;
    },

    updateCourseStatus: async (courseId: string, isActive: boolean): Promise<Course> => {
        const { data } = await axiosClient.put<Course>(`/courses/${courseId}`, { isActive });
        return data;
    },

    bulkUploadCourses: async (formData: FormData): Promise<unknown> => {
        const { data } = await axiosClient.post("/courses/bulk-upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },
}
