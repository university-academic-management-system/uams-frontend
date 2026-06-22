import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { changePasswordSchema, type ChangePasswordInput } from "@schemas/auth/changePassword.schema";

export const useChangePasswordForm = (options?: Omit<UseFormProps<ChangePasswordInput>, "resolver">) => {
    return useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        ...options,
    });
};
