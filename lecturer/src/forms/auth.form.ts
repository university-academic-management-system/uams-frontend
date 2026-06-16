import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema, UpdateContactSchema } from "@schemas/auth.schema";
import type { ChangePasswordFormData, UpdateContactFormData } from "@schemas/auth.schema";


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