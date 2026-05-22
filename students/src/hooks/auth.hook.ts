import { loginApi, signupApi } from "@services/auth.api"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import type { LoginData, LoginResponse, SignupData, SignupResponse } from "@type/auth.type"


// auth hook
export const useLogin = (options?: UseMutationOptions<LoginResponse, Error, LoginData, unknown>) => useMutation<LoginResponse, Error, LoginData, unknown>({
    mutationFn: (payload: LoginData) => loginApi(payload),
    ...options
})

export const useSignup = (options?: UseMutationOptions<SignupResponse, Error, SignupData, unknown>) => useMutation<SignupResponse, Error, SignupData, unknown>({
    mutationFn: (payload: SignupData) => signupApi(payload),
    ...options
})  