import { AuthServices } from "@services/auth.service"
import { UserServices } from "@services/user.service"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import type { LoginData, LoginResponse } from "@type/auth.type"


// auth hook
export const AuthHooks = {
    useLogin: (options?: UseMutationOptions<LoginResponse, Error, LoginData, unknown>) => useMutation<LoginResponse, Error, LoginData, unknown>({
        mutationFn: (payload: LoginData) => AuthServices.login(payload),
        ...options
    }),
    useChangePassword: (options?: UseMutationOptions<import("@type/auth.type").ChangePasswordResponse, Error, import("@type/auth.type").ChangePasswordData, unknown>) => useMutation<import("@type/auth.type").ChangePasswordResponse, Error, import("@type/auth.type").ChangePasswordData, unknown>({
        mutationFn: (payload: import("@type/auth.type").ChangePasswordData) => AuthServices.changePassword(payload),
        ...options
    }),
    useUpdateContact: (options?: UseMutationOptions<import("@type/auth.type").UpdateContactResponse, Error, import("@type/auth.type").UpdateContactPayload, unknown>) => useMutation<import("@type/auth.type").UpdateContactResponse, Error, import("@type/auth.type").UpdateContactPayload, unknown>({
        mutationFn: (payload: import("@type/auth.type").UpdateContactPayload) => UserServices.updateContact(payload),
        ...options
    }),
}