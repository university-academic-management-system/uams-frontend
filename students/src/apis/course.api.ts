import axiosClient from "@configs/axios.config"
import type { CoursesResponse, CoursesQueryParams, RegisterCoursesData, RegisterCoursesResponse, ResultsResponse, AttendanceResponse } from "@type/course.type"

export const fetchCoursesApi = async (params?: CoursesQueryParams) => {
    const { data } = await axiosClient.get<CoursesResponse>("/courses", { params });
    return data.data;
}

export const fetchResultsApi = async (params?: CoursesQueryParams) => {
    const { data } = await axiosClient.get<ResultsResponse>("/results", { params });
    return data.data;
}

export const registerCoursesApi = async (payload: RegisterCoursesData) => {
    const { data } = await axiosClient.post<RegisterCoursesResponse>("/courses/register", payload);
    return data.data;
}

export const fetchAttendanceApi = async (courseId: string) => {
    const { data } = await axiosClient.get<AttendanceResponse>(`/attendance/courses/${courseId}`);
    return data.data;
}
