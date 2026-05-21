import { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Sidebar from "@components/shared/Sidebar";
import Navbar from "@components/shared/Navbar";
import ToasterReseter from "@components/shared/ToasterReseter";
import { AuthServices } from "@services/auth.service";
import useAuthStore from "@stores/auth.store";

const SIDEBAR_WIDTH = "255px";

const DashboardLayout = () => {
    const { user, setAuth } = useAuthStore();

    useEffect(() => {
        const syncProfile = async () => {
            try {
                const res = await AuthServices.getProfile();
                if (res.status === "success" && res.data) {
                    const sp = res.data.staffProfile;
                    const staffRoles = sp?.staffRoles ?? [];
                    const name = [sp?.firstName, sp?.otherName, sp?.surname]
                        .filter(Boolean)
                        .join(" ");
                    setAuth({
                        user: {
                            ...user,
                            ...res.data,
                            name: name || user?.name,
                            roles: staffRoles,
                            role: staffRoles[0],
                        },
                    });
                }
            } catch {
            }
        };

        syncProfile();
    }, []);

    return (
        <Flex minH="100vh">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <Box
                ml={SIDEBAR_WIDTH}
                flex="1"
                bg="#f8fafc"
                h="100vh"
                display="flex"
                flexDirection="column"
                position="relative"
                overflow="hidden"
            >
                {/* Top Navbar — sticky */}
                <Box
                    position="sticky"
                    top="0"
                    zIndex="10"
                    flexShrink={0}
                >
                    <Navbar />
                </Box>

                {/* Page Content */}
                <Box flex="1" px="10" py="8" overflow="auto" minW="0">
                    <Outlet />
                    <ToasterReseter />
                </Box>
            </Box>
        </Flex>
    );
};

export default DashboardLayout;
