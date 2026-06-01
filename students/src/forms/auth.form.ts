import { useForm } from "react-hook-form";
import type { ChangePasswordFormData, SignupFormData, UpdateContactFormData } from "@schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema, SignupSchema, UpdateContactSchema } from "@schemas/auth.schema";

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

export const useChangePasswordForm = () => {
    return useForm<ChangePasswordFormData>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });
}

export const useUpdateContactForm = (defaultValues?: Partial<UpdateContactFormData>) => {
    return useForm<UpdateContactFormData>({
        resolver: zodResolver(UpdateContactSchema),
        defaultValues
    });
}