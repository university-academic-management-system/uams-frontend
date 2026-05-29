import { Box, Flex, Stack } from "@chakra-ui/react";
import Header from "@components/shared/Header";
import Sidebar from "@components/shared/Sidebar";
import ToasterReseter from "@components/shared/ToasterReseter";
import { Toaster } from "@components/ui/toaster";
import { Outlet } from "react-router";

const RootLayout = () => {
    return <>

        <Flex
            h="100vh"
            bg="bg.subtle"
            w="full"
            overflow="hidden"

        >
            {/* sidebar */}
            <Sidebar />

            <Stack flex="1" h="100vh" gap="0" bg="bg" overflow="hidden" minW="0">
                {/* header */}
                <Header />

                {/* main */}
                <Box
                    overflowY="auto"
                    overflowX="hidden"
                    h="calc(100vh - 64px)"
                    bg="bg.subtle"
                    border="xs"
                    borderColor="border.muted"
                    rounded="md"
                    css={{
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-track": { background: "transparent" },
                        "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "3px" },
                        "&::-webkit-scrollbar-thumb:hover": { background: "#94a3b8" },
                        scrollbarWidth: "thin",
                        scrollbarColor: "#cbd5e1 transparent",
                    }}
                >
                    <Box p="4">
                        <Outlet />
                    </Box>
                </Box>
            </Stack>
        </Flex>
        <Toaster /> {/* global */}
        <ToasterReseter /> {/* reset toast notifications */}

    </>

}

export default RootLayout;
