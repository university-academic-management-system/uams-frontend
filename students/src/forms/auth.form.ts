import { useForm } from "react-hook-form";
import type { SignupFormData } from "@schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@schemas/auth.schema";

export const useSignupForm = () => {
    return useForm<SignupFormData>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
}