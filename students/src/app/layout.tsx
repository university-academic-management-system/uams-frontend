import { Flex, Stack } from "@chakra-ui/react";
import Header from "@components/shared/header";
import ToasterReseter from "@components/shared/ToasterReseter";
import { Toaster } from "@components/ui/toaster";
import { Outlet } from "react-router";

const RootLayout = () => {
    return <>
        <Flex
            h="vh"
            bg="bg.subtle"
            w="full"
        >
            {/* siderbar */}

            <Stack w="full" h="full" >
                {/* header */}
                <Header />

                {/* main */}
                <Outlet />
            </Stack>
        </Flex>
        <Toaster /> {/* global */}
        <ToasterReseter /> {/* reset toast notifications */}

    </>


}

export default RootLayout;