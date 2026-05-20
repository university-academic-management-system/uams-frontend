import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activateAccountSchema, type ActivateAccountSchema } from "@/schemas/auth/activate-account.schema";

export const useActivateAccountForm = () => {
    return useForm<ActivateAccountSchema>({
        resolver: zodResolver(activateAccountSchema),
        defaultValues: {
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });
};
