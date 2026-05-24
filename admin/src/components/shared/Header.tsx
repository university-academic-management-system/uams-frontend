import { ButtonGroup, Flex, Group, Heading } from "@chakra-ui/react";
import { SidebarToggleButton } from "./Sidebar";
import NotificationDrawer from "./notification-drawer";
import AuditLogs from "./audit-log";
import { useSidebarStore } from "@stores/ui.store";
import { useLocation } from "react-router";
import { useCallback, useMemo } from "react";
import { navigationLinks, type NavigationLink } from "@constants/navigation";

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
            pl="0"
            align={"center"}
            justify={"space-between"}
            h="16"
            w="full"
        >
            <Group>
                <SidebarToggleButton />
                {isCollapsed && <Heading>{activeLink?.label}</Heading>}
            </Group>


            <ButtonGroup gap="2">
                <NotificationDrawer />
                <AuditLogs />
            </ButtonGroup>
        </Flex>
    </>
}

export default Header;
