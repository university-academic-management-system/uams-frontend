import { LuHouse, LuLibrary, LuUser, LuBanknote, LuCalendarDays, LuFolderKanban, LuSettings } from "react-icons/lu";
import { PiAddressBook } from "react-icons/pi";
import type { ElementType } from "react";

export interface NavigationLink {
    label: string;
    href: string;
    icon: ElementType;
}

export const navigationLinks: NavigationLink[] = [
    { label: "Dashboard", href: "/", icon: LuHouse },
    { label: "Programmes", href: "/programmes", icon: LuLibrary },
    { label: "Lecturers", href: "/staff", icon: PiAddressBook },
    { label: "Students", href: "/students", icon: LuUser },
    { label: "Payments", href: "/payments", icon: LuBanknote },
    { label: "ID Cards", href: "/id-card", icon: PiAddressBook },
    { label: "Timetable", href: "/timetable", icon: LuCalendarDays },
    { label: "Announcements", href: "/announcements", icon: LuFolderKanban },
    { label: "Settings", href: "/settings", icon: LuSettings },
    { label: "Profile", href: "/profile", icon: LuUser }
];
