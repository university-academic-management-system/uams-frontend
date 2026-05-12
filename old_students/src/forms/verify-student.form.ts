import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyStudentSchema, type VerifyStudentSchema } from "@/schemas/auth/verify-student.schema";

export const useVerifyStudentForm = () => {
    return useForm<VerifyStudentSchema>({
        resolver: zodResolver(verifyStudentSchema),
        defaultValues: {
            matricNumber: "",
        },
    });
};
