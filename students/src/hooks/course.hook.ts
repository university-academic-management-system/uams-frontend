import { fetchAttendanceApi, fetchCoursesApi, fetchResultsApi, registerCoursesApi } from "@apis/course.api"
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query"
import type { Attendance, CoursesData, CoursesQueryParams, RegisterCoursesData, RegisterCoursesResponse, ResultsData } from "@type/course.type"

export const useCourses = (
    params?: CoursesQueryParams,
    options?: UseQueryOptions<CoursesData, Error>
) => useQuery<CoursesData, Error>({
    queryKey: ["courses", params],
    queryFn: () => fetchCoursesApi(params),
    ...options
})

export const useResults = (
    params?: CoursesQueryParams,
    options?: UseQueryOptions<ResultsData, Error>
) => useQuery<ResultsData, Error>({
    queryKey: ["results", params],
    queryFn: () => fetchResultsApi(params),
    ...options
})

export const useRegisterCourses = (
    options?: UseMutationOptions<RegisterCoursesResponse["data"], Error, RegisterCoursesData>
) => useMutation<RegisterCoursesResponse["data"], Error, RegisterCoursesData>({
    mutationFn: (payload: RegisterCoursesData) => registerCoursesApi(payload),
    ...options
})

export const useAttendance = (
    courseId: string,
    options?: UseQueryOptions<Attendance[], Error>
) => useQuery<Attendance[], Error>({
    queryKey: ["attendance", courseId],
    queryFn: () => fetchAttendanceApi(courseId),
    enabled: !!courseId,
    ...options
})
