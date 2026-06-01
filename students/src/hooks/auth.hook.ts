import { changePasswordApi, meApi, updateContactApi } from "@apis/auth.api"
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query"
import type { ChangePasswordPayload, ChangePasswordResponse, MeResponse, UpdateContactPayload, UpdateContactResponse } from "@type/auth.type"


// auth hook
export const useMe = (options?: UseQueryOptions<MeResponse["data"], Error>) => useQuery<MeResponse["data"], Error>({
    queryKey: ["me"],
    queryFn: () => meApi(),
    ...options
})

export const useUpdateContact = (options?: UseMutationOptions<UpdateContactResponse, Error, UpdateContactPayload>) => useMutation<UpdateContactResponse, Error, UpdateContactPayload>({
    mutationFn: (payload: UpdateContactPayload) => updateContactApi(payload),
    ...options
})

export const useChangePassword = (options?: UseMutationOptions<ChangePasswordResponse, Error, ChangePasswordPayload>) => useMutation<ChangePasswordResponse, Error, ChangePasswordPayload>({
    mutationFn: (payload: ChangePasswordPayload) => changePasswordApi(payload),
    ...options
})