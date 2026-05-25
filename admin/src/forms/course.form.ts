import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseSchema, type CourseFormData } from "../schemas/program.schema";

export const defaultCourseFormData: CourseFormData = {
    title: "",
    code: "",
    units: "3",
    description: "",
    semester: "FIRST",
    level: "100",
    programTypeId: "",
    courseType: "CORE",
    allowCarryover: true,
};

const useCourseForm = (defaultValues?: Partial<CourseFormData>) => {
    return useForm<CourseFormData>({
        mode: "onChange",
        resolver: zodResolver(CourseSchema),
        defaultValues: {
            ...defaultCourseFormData,
            ...defaultValues
        }
    });
};

export default useCourseForm;
