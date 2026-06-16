// hooks/auth.hook.ts
import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { AuthServices } from "@services/auth.service";
import { UserServices } from "@services/user.service";
import type {
  ProfileResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  UpdateContactPayload,
  UpdateContactResponse,
} from "@type/auth.type";

export const useMe = (options?: UseQueryOptions<ProfileResponse>) => {
  return useQuery<ProfileResponse>({
    queryKey: ["me"],
    queryFn: () => AuthServices.getProfile(),
    ...options,
  });
};

export const useChangePassword = (
  options?: UseMutationOptions<ChangePasswordResponse, Error, ChangePasswordPayload>
) => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordPayload>({
    mutationFn: (payload) => UserServices.changePassword(payload),
    ...options,
  });
};

export const useUpdateContact = (
  options?: UseMutationOptions<UpdateContactResponse, Error, UpdateContactPayload>
) => {
  return useMutation<UpdateContactResponse, Error, UpdateContactPayload>({
    mutationFn: (payload) => UserServices.updateProfile(payload),
    ...options,
  });
};