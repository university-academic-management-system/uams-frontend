import { CourseServices } from "@services/course.service";
import { ProgramServices } from "@services/program.service";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery, keepPreviousData } from "@tanstack/react-query";
import { toaster } from "@components/ui/toaster";
import type { CreateCourseData } from "@type/course.type";
import type { CourseFormData } from "@schemas/program.schema";

export const CourseHook = {
    useCourses: (filters: { level?: string; semester?: string }) =>
        useQuery({
            queryKey: ["courses", filters],
            queryFn: async () => {
                const response = await CourseServices.getCourses(filters);
                const data = Array.isArray(response)
                    ? response
                    : (response as { data?: unknown[] })?.data || [];
                return data;
            },
            placeholderData: keepPreviousData,
        }),

    useProgramTypes: () =>
        useSuspenseQuery({
            queryKey: ["program-types"],
            queryFn: async () => {
                const response = await ProgramServices.getProgramTypes();
                const data = Array.isArray(response)
                    ? response
                    : (response as { data?: unknown[] })?.data || [];
                return data;
            },
        }),

    useCreateCourse: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (formData: CourseFormData) => {
                const payload: CreateCourseData = {
                    title: formData.title,
                    code: formData.code,
                    description: formData.description || "",
                    units: Number(formData.units),
                    semester: formData.semester as "FIRST" | "SECOND" | "SUMMER",
                    level: formData.level,
                    programmeId: formData.programTypeId,
                    isElective: formData.courseType === "ELECTIVE",
                };
                return await CourseServices.createCourse(payload);
            },
            onSuccess: () => {
                toaster.success({ title: "Course created successfully" });
                queryClient.invalidateQueries({ queryKey: ["courses"] });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useUpdateCourse: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async ({ id, data }: { id: string; data: CourseFormData }) => {
                return await CourseServices.updateCourse(id, {
                    title: data.title,
                    code: data.code,
                    description: data.description || "",
                    units: Number(data.units),
                    semester: data.semester,
                    level: data.level,
                    programmeId: data.programTypeId,
                    courseType: data.courseType,
                    isCarryoverAllowed: data.allowCarryover,
                });
            },
            onSuccess: () => {
                toaster.success({ title: "Course updated successfully" });
                queryClient.invalidateQueries({ queryKey: ["courses"] });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useDeleteCourse: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (id: string) => {
                return await CourseServices.deleteCourse(id);
            },
            onSuccess: () => {
                toaster.success({ title: "Course deleted successfully" });
                queryClient.invalidateQueries({ queryKey: ["courses"] });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useBulkUploadCourses: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (formData: FormData) => {
                return await CourseServices.bulkUploadCourses(formData);
            },
            onSuccess: () => {
                toaster.success({ title: "Courses uploaded successfully!" });
                queryClient.invalidateQueries({ queryKey: ["courses"] });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },
};
