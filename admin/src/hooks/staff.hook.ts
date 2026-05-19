import { StaffServices } from "@services/staff.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@components/ui/toaster";
import type { CreateLecturerPayload, Staff } from "@type/staff.type";

export const StaffHook = {
    useStaff: () =>
        useQuery({
            queryKey: ["staff"],
            queryFn: async () => {
                const response = await StaffServices.getDepartmentLecturers();
                const data = response?.lecturers || response?.data || [];
                return data.map((item: any) => ({
                    ...item,
                    id: item.id,
                    staffNumber: item.staffProfile?.staffNumber || "—",
                    fullName: `${item.staffProfile?.firstName || ""} ${item.staffProfile?.surname || ""}`.trim() || "—",
                    firstName: item.staffProfile?.firstName || "",
                    surname: item.staffProfile?.surname || "",
                    otherName: item.staffProfile?.otherName || "",
                    email: item.email || "—",
                    phone: item.staffProfile?.phone || "—",
                    gender: item.staffProfile?.gender || "—",
                    department: item.staffProfile?.department || "—",
                    level: item.staffProfile?.title || "—",
                    courses: item.courses?.map((course: any) => course.code).join(", ") || "—",
                })) as Staff[];
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
            mutationFn: (payload: { courseId: string; lecturerId: string; session: string }) =>
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
};
