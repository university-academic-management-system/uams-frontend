import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { Sidebar } from "@components/shared/Sidebar";
import { Header } from "@components/shared/Header";
import type { ViewType } from "@type/common.type";
import useAuthStore from "@stores/auth.store";
import { Toaster } from "@components/ui/toaster";
import { Box, Flex } from "@chakra-ui/react";

const DashboardLayout = () => {
    const { user, clearAuth } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getActiveViewFromPath = (pathname: string): ViewType => {
        const routeMap: Record<string, ViewType> = {
            "/dashboard": "Dashboard",
            "/program-courses": "Programs & Courses",
            "/students": "Students",
            "/staff": "Lecturers",
            "/payments": "Payments",
            "/id-card": "ID Card Management",
            "/announcements": "Announcements",
            "/settings": "Settings",
            "/notifications": "Notifications",
            "/profile": "Profile",
            "/timetable": "Timetable",
        };

        for (const [route, view] of Object.entries(routeMap)) {
            if (pathname === route || pathname.startsWith(route + "/")) {
                return view;
            }
        }

        return "Dashboard";
    };

    const activeView = getActiveViewFromPath(location.pathname);

    const handleViewChange = (view: ViewType) => {
        const routeMap: Record<ViewType, string> = {
            Dashboard: "/dashboard",
            "Programs & Courses": "/program-courses",
            Students: "/students",
            Lecturers: "/staff",
            Payments: "/payments",
            "ID Card Management": "/id-card",
            Announcements: "/announcements",
            Settings: "/settings",
            Notifications: "/notifications",
            Profile: "/profile",
            Timetable: "/timetable",
        };
        navigate(routeMap[view] || "/dashboard");
    };

    const handleLogout = () => { 
        clearAuth();
        window.location.href = "/auth/login";
    };

    return (
        <Flex minH="100vh">
            <Sidebar
                activeView={activeView}
                onViewChange={handleViewChange}
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentUser={user?.name || "N/A"}
                email={user?.email || "N/A"}
            />
            <Box as="main" flex="1" ml={{ base: "0", lg: "64" }} bg="bg.subtle" transition="margin-left 0.2s">
                <Toaster />
                <Header
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <Box p={{ base: "4", md: "8" }}>
                    <Outlet />
                </Box>
            </Box>
        </Flex>
    );
};

export default DashboardLayout;
