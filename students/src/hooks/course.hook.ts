import { fetchCoursesApi, registerCoursesApi } from "@apis/course.api"
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query"
import type { CoursesData, CoursesQueryParams, RegisterCoursesData, RegisterCoursesResponse } from "@type/course.type"

export const useCourses = (
    params?: CoursesQueryParams,
    options?: UseQueryOptions<CoursesData, Error>
) => useQuery<CoursesData, Error>({
    queryKey: ["courses", params],
    queryFn: () => fetchCoursesApi(params),
    ...options
})

export const useRegisterCourses = (
    options?: UseMutationOptions<RegisterCoursesResponse["data"], Error, RegisterCoursesData>
) => useMutation<RegisterCoursesResponse["data"], Error, RegisterCoursesData>({
    mutationFn: (payload: RegisterCoursesData) => registerCoursesApi(payload),
    ...options
})
