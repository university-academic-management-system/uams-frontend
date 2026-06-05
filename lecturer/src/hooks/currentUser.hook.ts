import useAuthStore from "@stores/auth.store";
import type { AuthUser } from "@type/user.type";

export const useCurrentUser = () => {
    const user = useAuthStore((state) => state.user) as AuthUser | null;
    const roles = [
        ...(user?.role ? [user.role.toUpperCase()] : []),
        ...(user?.roles ? user.roles.map((r) => r.toUpperCase()) : []),
    ];
    const isHOD = roles.includes("HOD");
    const isERO = roles.includes("ERO");
    const isLecturer = roles.includes("LECTURER") || roles.includes("LECTURERS");
    return { user, isHOD, isERO, isLecturer };
};