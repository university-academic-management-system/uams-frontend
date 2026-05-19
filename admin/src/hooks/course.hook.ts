import { CourseServices } from "@services/course.service";
import { ProgramServices } from "@services/program.service";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toaster } from "@components/ui/toaster";

export const CourseHook = {
    useCourses: (filters: { level?: string; semester?: string }) =>
        useQuery({
            queryKey: ["courses", filters],
            queryFn: async () => {
                const response = await CourseServices.getCourses(filters);
                const data = Array.isArray(response)
                    ? response
                    : (response as any)?.data || (response as any)?.courses || [];
                return data;
            },
            placeholderData: keepPreviousData,
        }),

    useProgramTypes: () =>
        useQuery({
            queryKey: ["program-types"],
            queryFn: async () => {
                const response = await ProgramServices.getProgramTypes();
                const data = Array.isArray(response)
                    ? response
                    : (response as any)?.data || [];
                return data;
            },
        }),

    useCreateCourse: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (formData: any) => {
                return await CourseServices.createCourse({
                    ...formData,
                    units: Number(formData.units),
                    isElective: formData.courseType === "ELECTIVE",
                    programmeTypeId: formData.programTypeId,
                    isCarryoverAllowed: formData.allowCarryover,
                } as any);
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
            mutationFn: async ({ id, data }: { id: string; data: any }) => {
                return await CourseServices.updateCourse(id, {
                    ...data,
                    units: Number(data.units),
                    isElective: data.courseType === "ELECTIVE",
                    programmeTypeId: data.programTypeId,
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
