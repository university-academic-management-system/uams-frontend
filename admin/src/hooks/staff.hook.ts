import { StaffServices } from "@services/staff.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@components/ui/toaster";
import type { CreateLecturerPayload, StaffFilters } from "@type/staff.type";

export const StaffHook = {
    useStaff: (filters?: StaffFilters) =>
        useQuery({
            queryKey: ["staff", filters],
            queryFn: async () => {
                const response = await StaffServices.getDepartmentLecturers(filters);
                const data = response?.data || [];
                const pagination = response?.pagination || { page: 1, limit: 50, total: data.length, totalPages: 1, hasNext: false, hasPrev: false };
                return { staff: data, pagination };
            },
        }),

    useAddStaff: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (payload: CreateLecturerPayload) => StaffServices.addLecturer(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["staff"] });
                toaster.success({ title: "Lecturer added successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useUpdateStaff: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateLecturerPayload> }) =>
                StaffServices.updateLecturer(id, payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["staff"] });
                toaster.success({ title: "Lecturer updated successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useDeleteStaff: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => StaffServices.deleteLecturer(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["staff"] });
                toaster.success({ title: "Lecturer deleted successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useBulkDeleteStaff: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (ids: string[]) => StaffServices.bulkDeleteStaff(ids),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["staff"] });
                toaster.success({ title: "Selected lecturers deleted successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useBulkUploadStaff: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (formData: FormData) => StaffServices.bulkUploadLecturers(formData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["staff"] });
                toaster.success({ title: "Lecturers uploaded successfully!" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useAssignCourse: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (payload: { courseIds: string[]; lecturerId: string; session: string }) =>
                StaffServices.assignCourse(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["staff"] });
                toaster.success({ title: "Course assigned successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useUnassignCourse: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (assignmentId: string) => StaffServices.unassignCourse(assignmentId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["staff"] });
                toaster.success({ title: "Course unassigned successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },
};
