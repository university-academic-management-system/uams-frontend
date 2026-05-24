import { StudentServices } from "@services/student.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@components/ui/toaster";
import type { CreateStudentPayload, Student, StudentFilters } from "@type/student.type";

export const StudentHook = {
    useStudents: (filters?: StudentFilters) =>
        useQuery({
            queryKey: ["students", filters],
            queryFn: async () => {
                const response = await StudentServices.getDepartmentStudents(filters);
                const data = response?.data || [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return data.map((item: any) => ({
                    ...item,
                    id: item.id,
                    email: item.email,
                    role: item.role,
                    status: item.status,
                    fullName: `${item.studentProfile?.firstName || ""} ${item.studentProfile?.surname || ""}`.trim() || "—",
                    firstName: item.studentProfile?.firstName || "",
                    surname: item.studentProfile?.surname || "",
                    otherName: item.studentProfile?.otherName || "",
                    matricNumber: item.studentProfile?.matricNumber || "—",
                    registrationNo: item.studentProfile?.registrationNo || "—",
                    phone: item.studentProfile?.phone || "—",
                    gender: item.studentProfile?.gender || "—",
                    level: item.studentProfile?.level || "—",
                    department: item.studentProfile?.department || "—",
                    faculty: item.studentProfile?.faculty || "—",
                    admissionMode: item.studentProfile?.admissionMode || "—",
                    entryQualification: item.studentProfile?.entryQualification || "—",
                    degreeCourse: item.studentProfile?.degreeCourse || "—",
                    courseDuration: item.studentProfile?.courseDuration || item.studentProfile?.degreeDuration || "—",
                    degreeAwarded: item.studentProfile?.degreeAwarded || "—",
                    registrationStatus: item.studentProfile?.registrationStatus || "—",
                    cgpa: item.studentProfile?.cgpa || null,
                    createdAt: item.createdAt,
                })) as Student[];
            },
        }),

    useAddStudent: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (payload: CreateStudentPayload) => StudentServices.addStudent(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["students"] });
                toaster.success({ title: "Student added successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useUpdateStudent: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateStudentPayload> }) =>
                StudentServices.updateStudent(id, payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["students"] });
                toaster.success({ title: "Student updated successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useDeleteStudent: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => StudentServices.deleteStudent(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["students"] });
                toaster.success({ title: "Student deleted successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useBulkUploadStudents: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (file: File) => StudentServices.bulkUploadStudents(file),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["students"] });
                toaster.success({ title: "Students uploaded successfully!" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useBulkDeleteStudents: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ ids, reason }: { ids: string[]; reason: string }) =>
                StudentServices.bulkDeleteStudents(ids, reason),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["students"] });
                toaster.success({ title: "Selected students deleted successfully" });
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },

    useBulkDownloadStudents: () => {
        return useMutation({
            mutationFn: (ids: string[]) => StudentServices.bulkDownloadStudents(ids),
            onSuccess: () => {
                // Success is handled in the component for the blob download, but we can keep this empty or add a toast.
            },
            onError: () => {
                // Error toast handled by axios interceptor
            },
        });
    },
};
