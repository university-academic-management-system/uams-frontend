import { Avatar, Button, Flex, HStack, Icon, IconButton, Image, Separator, Stack, Text } from "@chakra-ui/react";
import { sidebarStore } from "@stores/ui.store";
import { useCallback, useMemo } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { LuBanknote, LuCalendarDays, LuFolderKanban, LuHouse, LuLibrary, LuLogOut } from "react-icons/lu";
import LinkButton from "./buttons/LinkButton";
import { Link, useLocation, useNavigate } from "react-router";
import { PiAddressBook } from "react-icons/pi";
import { Tooltip } from "@components/ui/tooltip";
import useAuthStore from "@stores/auth.store";

const Sidebar = () => {
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

    return (
        <Stack
            h="full"
            bg="bg"
            align="center"
            gap="4"
            w={isCollapsed ? "74px" : "240px"}>
            <Flex align="center" h="16" p="6">
                {/* logo */}
                {!isCollapsed ? <Image src="/students/uphcsc-logo.png" alt="UPHCSC Logo" className="h-12" /> : <Image src="/students/sidebar-collapsed-logo.png" alt="UPHCSC Logo" className="h-12" />}
            </Flex>

            <Stack align={isCollapsed ? "center" : "stretch"} gap="2" w="full" p="2" pt="0">
                {links.map((link) => !isCollapsed ? (
                    <LinkButton
                        to={link.href}
                        w="full"
                        variant="ghost"
                        size="xl"
                        justifyContent={"start"}
                        color={isActive(link.href) ? "accent" : "fg.muted"}
                        fontWeight={"600"}
                    >
                        <Icon as={link.icon} size="md" color={isActive(link.href) ? "accent" : "fg.muted"} />
                        {link.label}
                    </LinkButton>
                ) :
                    (
                        <Link to={link.href}>
                            <Tooltip content={link.label} positioning={{ placement: "right" }}>
                                <IconButton
                                    size={"xl"}
                                    variant="ghost"
                                    width="fit"
                                >
                                    <Icon as={link.icon} size="md" color={isActive(link.href) ? "accent" : "fg.muted"} />
                                </IconButton>
                            </Tooltip>
                        </Link>
                    ))}
            </Stack>

            <Stack flex="1" justify={"end"} p="4">
                <LogoutButton />
                <Separator borderColor="border.muted" />
                <UserPersona />
            </Stack>
        </Stack>
    )

}



export const SidebarToggleButton = () => {
    const { isCollapsed, setIsCollapsed } = sidebarStore();
    return (
        <Tooltip content={isCollapsed ? "Expand" : "Collapse"}>
            <IconButton size={"md"} variant="ghost">
                <Icon onClick={() => setIsCollapsed(!isCollapsed)} as={isCollapsed ? GoSidebarCollapse : GoSidebarExpand} size="md" color="fg.muted" />
            </IconButton>
        </Tooltip>
    )
}

const UserPersona = () => {
    const { user } = useAuthStore();
    const { isCollapsed } = sidebarStore();
    return (
        <HStack key={user?.email} gap="2" justify="center">
            <Avatar.Root size="xs">
                <Avatar.Fallback name={user?.name} />
            </Avatar.Root>
            {!isCollapsed && <Stack gap="0" w="60%">
                <Text fontWeight="md" textStyle="sm">{user?.name || ""}</Text>
                <Text color="fg.muted" textStyle="xs">
                    {user?.email || ""}
                </Text>
            </Stack>}
        </HStack >
    )
}


const LogoutButton = () => {
    const { clearAuth } = useAuthStore();
    const { isCollapsed } = sidebarStore();
    const navigate = useNavigate();

    return !isCollapsed ? <Button justifyContent="start" size={"xl"} colorPalette={"red"} variant="ghost" onClick={() => clearAuth()}>
        <Icon as={LuLogOut} size="md" /> Logout
    </Button> :
        <Tooltip content={"Logout"} positioning={{ placement: "right" }}>
            <IconButton
                size={"xl"}
                variant="ghost"
                width="fit"
                colorPalette={"red"}
                onClick={() => { clearAuth(); navigate("/auth/login") }}
            >
                <Icon as={LuLogOut} size="md" />
            </IconButton>
        </Tooltip>
}
export default Sidebar;