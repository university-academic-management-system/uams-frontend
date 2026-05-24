import { AbsoluteCenter, ButtonGroup, Flex, Group, Heading, Icon } from "@chakra-ui/react";
import { SidebarToggleButton } from "./sidebar";
import NotificationDrawer from "./notification-drawer";
import AuditLogs from "./audit-log";
import { sidebarStore } from "@stores/ui.store";
import { useLocation } from "react-router";
import { useCallback, useMemo } from "react";
import { LuBanknote, LuCalendarDays, LuFolderKanban, LuHouse, LuLibrary, LuUser } from "react-icons/lu";
import { PiAddressBook } from "react-icons/pi";
import MobileSideDrawer from "./mobile-side-drawer";
import { Image } from "@chakra-ui/react";



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
            label: "Registrations",
            href: "/registrations",
            icon: PiAddressBook
        },
        {
            label: "Courses",
            href: "/courses",
            icon: LuLibrary
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
            label: "Announcements",
            href: "/announcements",
            icon: LuFolderKanban
        },
        {
            label: "Profile",
            href: "/profile",
            icon: LuUser
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
                <Icon hideFrom={"md"} as={activeLink?.icon} size="md" color="fg.muted" />
                {isCollapsed && <Heading size={{base: "sm", md: "md"}}>{activeLink?.label}</Heading>}
            </Group>

            <AbsoluteCenter hideFrom={"md"}>
                <Image src="/students/sidebar-collapsed-logo.png" alt="UPHCSC Logo" w={7} h={"auto"} />
            </AbsoluteCenter>

            <ButtonGroup gap="2">
                <NotificationDrawer />.
                <AuditLogs />
                <MobileSideDrawer />
            </ButtonGroup>
        </Flex>
    </>
}



export default Header;