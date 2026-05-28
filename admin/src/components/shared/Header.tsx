import { AbsoluteCenter, ButtonGroup, Flex, Group, Heading, Icon, Image } from "@chakra-ui/react";
import { SidebarToggleButton } from "./Sidebar";
import { useSidebarStore } from "@stores/ui.store";
import { useLocation } from "react-router";
import { useCallback, useMemo, lazy, Suspense } from "react";
import { navigationLinks, type NavigationLink } from "@constants/navigation";
import MobileSideDrawer from "./mobile-side-drawer";
import { ErrorBoundary } from "react-error-boundary";

const NotificationDrawer = lazy(() => import("./notification-drawer"));
const AuditLogs = lazy(() => import("./audit-log"));

const Header = () => {
    const { isCollapsed } = useSidebarStore();
    const path = useLocation().pathname;
    const links = useMemo(() => navigationLinks, []);

    const isActive = useCallback((href: string) => {
        return path.endsWith(href);
    }, [path]);

    const activeLink = links.find((link: NavigationLink) => isActive(link.href));

    return <>
        <Flex
            bg="bg"
            p="6"
            pl={{ base: 6, md: 0 }}
            align={"center"}
            justify={"space-between"}
            h="16"
            w="full"
            shadow={{ base: "xs", md: "none" }}
            pos="relative"
        >
            <Group>
                <SidebarToggleButton />
                {activeLink?.icon && <Icon hideFrom={"md"} as={activeLink.icon} size="md" color="fg.muted" />}
                <Heading hideFrom={!isCollapsed ? "md" : undefined} size={{base: "sm", md: "md"}}>{activeLink?.label}</Heading>
            </Group>

            <AbsoluteCenter hideFrom={"md"}>
                <Image src="/admin/assets/sidebar-collapsed-logo.png" alt="UPHCSC Logo" w={7} h={"auto"} />
            </AbsoluteCenter>

            <ButtonGroup gap="2">
                <Suspense fallback={null}>
                    <NotificationDrawer />
                </Suspense>

                <ErrorBoundary fallback={<></>}>
                    <Suspense fallback={null}>
                        <AuditLogs />
                    </Suspense>
                </ErrorBoundary>
                <MobileSideDrawer />
            </ButtonGroup>
        </Flex>
    </>
}

export default Header;
