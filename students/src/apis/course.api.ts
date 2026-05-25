import axiosClient from "@configs/axios.config"
import type { CoursesResponse, CoursesQueryParams, RegisterCoursesData, RegisterCoursesResponse } from "@type/course.type"

export const fetchCoursesApi = async (params?: CoursesQueryParams) => {
    const { data } = await axiosClient.get<CoursesResponse>("/courses", { params });
    return data.data;
}

export const registerCoursesApi = async (payload: RegisterCoursesData) => {
    const { data } = await axiosClient.post<RegisterCoursesResponse>("/courses/register", payload);
    return data.data;
}
