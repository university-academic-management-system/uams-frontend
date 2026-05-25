import { useEffect } from "react";
import { Flex, ScrollArea, Stack } from "@chakra-ui/react";
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
                bg="bg.subtle"
                w="full"
                overflow="hidden"
            >
                {/* sidebar */}
                <Sidebar />

                <Stack flex="1" h="100vh" gap="0" bg="bg" overflow="hidden">
                    {/* header */}
                    <Navbar />

                    {/* main */}
                    <ScrollArea.Root size="xs" h="calc(100vh - 64px)" bg="bg.subtle" border="xs" borderColor="border.muted" rounded="md" >
                        <ScrollArea.Viewport>
                            <ScrollArea.Content p="4">
                                <Outlet />
                            </ScrollArea.Content>
                        </ScrollArea.Viewport>
                        <ScrollArea.Scrollbar>
                            <ScrollArea.Thumb />
                        </ScrollArea.Scrollbar>
                        <ScrollArea.Corner />
                    </ScrollArea.Root>
                </Stack>
            </Flex>
            <Toaster /> {/* global */}
            <ToasterReseter /> {/* reset toast notifications */}
        </>
    );
};

export default DashboardLayout;
