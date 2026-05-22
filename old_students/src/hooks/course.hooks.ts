import CourseServices from "@/services/course.service";
import { useQuery } from "@tanstack/react-query";

const CourseHooks = {
    useCourses: () => {
        return useQuery({
            queryKey: ['courses'],
            queryFn: CourseServices.getCourses,
        })
    }
}

export default CourseHooks;