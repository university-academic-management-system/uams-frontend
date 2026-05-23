import { Avatar, Button, Flex, HStack, Icon, IconButton, Image, ScrollArea, Separator, Stack, Text } from "@chakra-ui/react";
import { sidebarStore } from "@stores/ui.store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { LuBanknote, LuCalendarDays, LuFolderKanban, LuHouse, LuLibrary, LuLogOut, LuUser } from "react-icons/lu";
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

    const [isScrollable, setIsScrollable] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (viewportRef.current) {
                const { scrollHeight, clientHeight } = viewportRef.current;
                setIsScrollable(scrollHeight > clientHeight);
            }
        };

        checkOverflow();

        const observer = new ResizeObserver(checkOverflow);
        if (viewportRef.current) {
            observer.observe(viewportRef.current);
            // Observe the content inside the viewport
            const content = viewportRef.current.querySelector('[data-part="content"]');
            if (content) observer.observe(content);
        }

        return () => observer.disconnect();
    }, [isCollapsed]);

    const isActive = useCallback((href: string) => {
        return path.endsWith(href);
    }, [path]);

    return (
        <Stack
            h="full"
            bg="bg"
            align="center"
            gap="4"
            hideBelow={"md"}
            transition="width 0.3s ease-in-out"
            w={isCollapsed ? "74px" : "240px"}>
            <Flex align="center" h="16" p="6" transition="transform 0.3s ease-in-out">
                {/* logo */}
                {!isCollapsed ? <Image src="/students/uphcsc-logo.png" alt="UPHCSC Logo" h="auto" w="auto" /> : <Image src="/students/sidebar-collapsed-logo.png" alt="UPHCSC Logo" w={12} h={"auto"} />}
            </Flex>

            <ScrollArea.Root h="full" size="xs">
                <ScrollArea.Viewport ref={viewportRef}>
                    <ScrollArea.Content>
                        <Stack align={isCollapsed ? "center" : "stretch"} gap="2" w="full" p="4" pt="0">
                            {links.map((link) => !isCollapsed ? (
                                <LinkButton
                                    key={link.href}
                                    to={link.href}
                                    w="full"
                                    variant="ghost"
                                    size="xl"
                                    pl="2"
                                    justifyContent={"start"}
                                    color={isActive(link.href) ? "accent" : "fg.muted"}
                                    fontWeight={"600"}
                                >
                                    <Icon as={link.icon} size="md" color={isActive(link.href) ? "accent" : "fg.muted"} />
                                    {link.label}
                                </LinkButton>
                            ) :
                                (
                                    <Link key={link.href} to={link.href}>
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
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar hidden={!isScrollable}>
                    <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
            </ScrollArea.Root>



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
            <IconButton hideBelow={"md"} size={"md"} variant="ghost" onClick={() => setIsCollapsed(!isCollapsed)}>
                <Icon as={isCollapsed ? GoSidebarCollapse : GoSidebarExpand} size="md" color="fg.muted" />
            </IconButton>
        </Tooltip>
    )
}

export const UserPersona = () => {
    const { user } = useAuthStore();
    const { isCollapsed } = sidebarStore();
    return (
        <HStack key={user?.email} gap="2" justify={isCollapsed ? "center" : "start"}>
            <Avatar.Root size="xs">
                <Avatar.Fallback name={user?.name} />
            </Avatar.Root>
            {!isCollapsed && <Stack gap="0" w="80%" >
                <Text fontWeight="md" textStyle="sm">{user?.name || ""}</Text>
                <Text color="fg.muted" textStyle="xs">
                    {user?.email || ""}
                </Text>
            </Stack>}
        </HStack >
    )
}


export const LogoutButton = () => {
    const { clearAuth } = useAuthStore();
    const { isCollapsed } = sidebarStore();
    const navigate = useNavigate();

    return !isCollapsed ? <Button justifyContent="start" pl="2" size={"xl"} colorPalette={"red"} color="red.500" variant="ghost" onClick={() => clearAuth()}>
        <Icon as={LuLogOut} size="md" /> Logout
    </Button> :
        <Tooltip content={"Logout"} positioning={{ placement: "right" }}>
            <IconButton
                size={"xl"}
                variant="ghost"
                width="fit"
                colorPalette={"red"}
                color="red.500"
                onClick={() => { clearAuth(); navigate("/auth/login") }}
            >
                <Icon as={LuLogOut} size="md" />
            </IconButton>
        </Tooltip>
}
export default Sidebar;