import { CourseData } from "@/types/course.type";
import apiClient from "./api";


const CourseServices = {
    getCourses: async () => {
        const response = await apiClient.get<CourseData>('/students/courses');
        return response.data.data;
    }
}

export default CourseServices;