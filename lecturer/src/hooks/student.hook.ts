import { StudentServices } from "@services/student.service";
import { useQuery } from "@tanstack/react-query";
import type { Student } from "@type/student.type";

export const StudentHook = {
    useStudents: () =>
        useQuery({
            queryKey: ["students"],
            queryFn: async () => {
                const response = await StudentServices.getDepartmentStudents();
                return (response?.data || []) as Student[];
            },
        }),
}