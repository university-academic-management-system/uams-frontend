import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentSchema, type StudentFormData } from "../schemas/student.schema";

const useStudentForm = () => {
    return useForm<StudentFormData>({
        mode: "onChange",
        // @ts-expect-error - Zod coercion type mismatch with RHF
        resolver: zodResolver(StudentSchema),
        defaultValues: {
            registrationNo: "",
            matricNumber: "",
            firstName: "",
            surname: "",
            otherName: "",
            email: "",
            gender: "",
            level: "",
            admissionMode: "",
            entryQualification: "",
            faculty: "",
            department: "",
            degreeCourse: "",
            degreeAwardedCode: "",
            degreeDuration: "4 Years",
            admissionYear: 2026,
            admissionSession: "2025/2026",
        }
    });
};

export default useStudentForm;
