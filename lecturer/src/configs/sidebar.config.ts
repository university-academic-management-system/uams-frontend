import {
    LayoutDashboard,
    GraduationCap,
    Users,
    BookOpen,
    ClipboardList,
    CalendarDays,
    // CreditCard,
    Megaphone,
    type LucideIcon,
    ChartColumn,
} from "lucide-react";

export interface SidebarItem {
    label: string;
    icon: LucideIcon;
    path: string;
    accessLevel: ("ALL" | "LECTURER" | "ERO" | "HOD") | string[];
}


const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", accessLevel: "ALL" },
    { label: "Students", icon: GraduationCap, path: "/students", accessLevel: ["HOD", "ERO"] },
    { label: "Lecturers", icon: Users, path: "/lecturers", accessLevel: ["HOD", "ERO"] },
    { label: "Courses", icon: BookOpen, path: "/courses", accessLevel: "ALL" },
    { label: "Results", icon: ClipboardList, path: "/results", accessLevel: "ALL" },
    { label: "Projects", icon: ChartColumn, path: "/projects", accessLevel: ["HOD", "LECTURER", "ERO"] },
    { label: "Timetable", icon: CalendarDays, path: "/timetable", accessLevel: "ALL" },
    // { label: "Payments", icon: CreditCard, path: "/payments" },
    { label: "Announcement", icon: Megaphone, path: "/announcement", accessLevel: "ALL" },
];

export default sidebarItems;
