import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    forgotPasswordSchema,
    resetPasswordSchema,
    type ForgotPasswordSchema,
    type ResetPasswordSchema
} from "@/schemas/auth/forgot-password.schema";

export const useForgotPasswordForm = () => {
    return useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });
};

export const useResetPasswordForm = () => {
    return useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });
};
