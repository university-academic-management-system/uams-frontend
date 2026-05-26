import { Flex, ScrollArea, Stack } from "@chakra-ui/react";
import Header from "@components/shared/header";
import Sidebar from "@components/shared/sidebar";
import ToasterReseter from "@components/shared/ToasterReseter";
import { Toaster } from "@components/ui/toaster";
import { lazy, Suspense } from "react";
import { Outlet } from "react-router";

const ReceiptTemplate = lazy(() => import("@components/shared/reciept"));


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

            <Stack flex="1" h="vh" gap="0" bg="bg" overflow="hidden">
                {/* header */}
                <Header />

                {/* main */}
                <ScrollArea.Root size="xs" h="calc(100vh - 64px)" bg="bg.subtle" border="xs" borderColor="border.muted" rounded="md" >
                    <ScrollArea.Viewport>
                        <ScrollArea.Content p="4">
                            <Outlet />
                            <Suspense>
                                <ReceiptTemplate />
                            </Suspense>
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