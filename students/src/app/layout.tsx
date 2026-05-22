import { Flex, ScrollArea, Stack } from "@chakra-ui/react";
import Header from "@components/shared/header";
import Sidebar from "@components/shared/sidebar";
import ToasterReseter from "@components/shared/ToasterReseter";
import { Toaster } from "@components/ui/toaster";
import { Outlet } from "react-router";

const RootLayout = () => {
    return <>
        <Flex
            h="vh"
            bg="bg.subtle"
            w="full"
            overflow="hidden"
        >
            {/* siderbar */}
            <Sidebar />

            <Stack flex="1" h="full" gap="0" bg="bg" overflow="hidden">
                {/* header */}
                <Header />

                {/* main */}
                <ScrollArea.Root size="xs" h="full">
                    <ScrollArea.Viewport>
                        <ScrollArea.Content h="full" border="xs" borderColor="border.muted" p="4" rounded="md" bg="bg.subtle">
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

}

export default RootLayout;