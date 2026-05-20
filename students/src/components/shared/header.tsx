import { ButtonGroup, Flex, Group, Heading } from "@chakra-ui/react";
import { SidebarToggleButton } from "./sidebar";
import NotificationDrawer from "./notification-drawer";
import AuditLogs from "./audit-log";
import { sidebarStore } from "@stores/ui.store";
import { useLocation } from "react-router";
import { useCallback, useMemo } from "react";
import { LuHouse, LuLibrary, LuFolderKanban, LuCalendarDays, LuBanknote } from "react-icons/lu";
import { PiAddressBook } from "react-icons/pi";

const Header = () => {
    const { isCollapsed } = sidebarStore();
    const path = useLocation().pathname;
    const links = useMemo(() => [
        {
            label: "Dashboard",
            href: "/",
            icon: LuHouse
        },
        {
            label: "Courses",
            href: "/courses",
            icon: LuLibrary
        },
        {
            label: "Registrations",
            href: "/registrations",
            icon: PiAddressBook
        },
        {
            label: "Project",
            href: "/projects",
            icon: LuFolderKanban
        },
        {
            label: "Timetable",
            href: "/timetable",
            icon: LuCalendarDays
        },
        {
            label: "Payments",
            href: "/payments",
            icon: LuBanknote
        },
        {
            label: "Project",
            href: "/projects",
            icon: LuFolderKanban
        },
        {
            label: "Timetable",
            href: "/timetable",
            icon: LuCalendarDays
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