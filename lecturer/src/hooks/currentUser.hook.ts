import useAuthStore from "@stores/auth.store";
import type { AuthState } from "@type/auth.type";

export const useCurrentUser = () => {
    const user = useAuthStore((state) => state.user) as AuthState['user'] | null;
    const roles = [
        ...(user?.role ? [user.role.toUpperCase()] : []),
    ];
    const isHOD = roles.includes("HOD");
    const isERO = roles.includes("ERO");
    const isLecturer = roles.includes("LECTURER") || roles.includes("LECTURERS");
    return { user, isHOD, isERO, isLecturer };
};