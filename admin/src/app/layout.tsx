import { Flex, ScrollArea, Stack } from "@chakra-ui/react";
import Header from "@components/shared/Header";
import Sidebar from "@components/shared/Sidebar";
import ToasterReseter from "@components/shared/ToasterReseter";
import { Toaster } from "@components/ui/toaster";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <>
      <Flex h="100vh" bg="bg.subtle" w="full" overflow="hidden">
        {/* siderbar */}
        <Sidebar />

        <Stack flex="1" h="100vh" gap="0" bg="bg" overflow="hidden">
          {/* header */}
          <Header />

          {/* main */}
          <ScrollArea.Root
            size="xs"
            h="calc(100vh - 64px)"
            bg="bg.subtle"
            border="xs"
            borderColor="border.muted"
            rounded="md"
          >
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

export default RootLayout;
