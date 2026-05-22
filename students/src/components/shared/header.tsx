import { ButtonGroup, Flex, Group, Heading } from "@chakra-ui/react";
import { SidebarToggleButton } from "./sidebar";
import NotificationDrawer from "./notification-drawer";
import AuditLogs from "./audit-log";
import { sidebarStore } from "@stores/ui.store";
import { useLocation } from "react-router";
import { useCallback, useMemo } from "react";

const Header = () => {
    const { isCollapsed } = sidebarStore();
    const path = useLocation().pathname;
    const links = useMemo(() => [
        {
            label: "Dashboard",
            href: "/",
        },
        {
            label: "Courses",
            href: "/courses",
        },
        {
            label: "Registrations",
            href: "/registrations",
        },
        {
            label: "Project",
            href: "/projects",
        },
        {
            label: "Timetable",
            href: "/timetable",
        },
        {
            label: "Payments",
            href: "/payments",
        },
        {
            label: "Announcements",
            href: "/announcements",
        },
        {
            label: "Profile",
            href: "/profile",
        }
    ], []);

    const isActive = useCallback((href: string) => {
        return path.endsWith(href);
    }, [path]);

    const activeLink = links.find((link) => isActive(link.href));

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
                <NotificationDrawer />.
                <AuditLogs />
            </ButtonGroup>
        </Flex>
    </>
}



export default Header;