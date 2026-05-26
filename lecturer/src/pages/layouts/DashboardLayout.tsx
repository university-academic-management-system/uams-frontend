import { useEffect } from "react";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Sidebar from "@components/shared/Sidebar";
import Navbar from "@components/shared/Navbar";
import ToasterReseter from "@components/shared/ToasterReseter";
import { Toaster } from "@components/ui/toaster";
import { AuthServices } from "@services/auth.service";
import useAuthStore from "@stores/auth.store";

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
        <>
            <Flex
                h="100vh"
                w="100vw"
                overflow="hidden"
                bg="bg.subtle"
                position="fixed"
                top="0"
                left="0"
                right="0"
                bottom="0"
            >
                {/* sidebar – assumes fixed width internally */}
                <Sidebar />

                <Stack
                    flex="1"
                    h="100%"
                    gap="0"
                    bg="bg"
                    overflow="hidden"
                    minW="0"       // prevents flex item from overflowing
                    maxW="100%"
                >
                    {/* header */}
                    <Navbar />

                    {/* main content – scrolls vertically, no horizontal overflow */}
                    <Box
                        flex="1"
                        overflowY="auto"
                        overflowX="auto"   // allow horizontal scroll inside if needed, but page won't overflow
                        bg="bg.subtle"
                        p="4"
                        minW="0"
                        maxW="100%"
                        position="relative"
                    >
                        {/* Outlet content must also be constrained */}
                        <Box minW="0" maxW="100%" overflowX="auto">
                            <Outlet />
                        </Box>
                    </Box>
                </Stack>
            </Flex>
            <Toaster />
            <ToasterReseter />
        </>
    );
};

export default DashboardLayout;