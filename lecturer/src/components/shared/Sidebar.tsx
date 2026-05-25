import { Avatar, Button, Flex, HStack, Icon, IconButton, Image, ScrollArea, Separator, Stack, Text } from "@chakra-ui/react";
import { sidebarStore } from "@stores/ui.store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import LinkButton from "@components/ui/LinkButton";
import { Link, useLocation, useNavigate } from "react-router";
import { Tooltip } from "@components/ui/tooltip";
import useAuthStore from "@stores/auth.store";
import sidebarItems from "@configs/sidebar.config";
import { LuLogOut } from "react-icons/lu";

const Sidebar = () => {
    const { isCollapsed } = sidebarStore();
    const path = useLocation().pathname;
    const { user } = useAuthStore();

    const userRoles = useMemo(() => {
        const roles: string[] = [];
        if (user?.role) roles.push(user.role);
        if (user?.roles) roles.push(...user.roles);
        return roles;
    }, [user]);

    const filteredItems = useMemo(() => {
        if (userRoles.includes("ADMIN")) return sidebarItems;
        return sidebarItems.filter((item) => {
            if (item.accessLevel === "ALL") return true;
            if (Array.isArray(item.accessLevel)) {
                return item.accessLevel.some((level) => userRoles.includes(level));
            }
            return userRoles.includes(item.accessLevel);
        });
    }, [userRoles]);

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
        return path === href || path.startsWith(href + "/");
    }, [path]);

    return (
        <Stack
            h="full"
            bg="bg"
            align="center"
            gap="4"
            transition="width 0.3s ease-in-out"
            w={isCollapsed ? "74px" : "240px"}>
            <Flex align="center" h="16" p="6" transition="transform 0.3s ease-in-out">
                {/* logo */}
                {!isCollapsed ? <Image src="public/assets/sidebar-image.png" alt="UPHCSC Logo" h="auto" w="auto" /> : <Image src="public/assets/sidebar-collapsed-logo.png" alt="UPHCSC Logo" w={12} h={"auto"} />}
            </Flex>

            <ScrollArea.Root h="full" size="xs">
                <ScrollArea.Viewport ref={viewportRef}>
                    <ScrollArea.Content>
                        <Stack align={isCollapsed ? "center" : "stretch"} gap="2" w="full" p="4" pt="0">
                            {filteredItems.map((link) => !isCollapsed ? (
                                <LinkButton
                                    key={link.path}
                                    to={link.path}
                                    w="full"
                                    variant="ghost"
                                    size="xl"
                                    pl="2"
                                    justifyContent={"start"}
                                    color={isActive(link.path) ? "accent" : "fg.muted"}
                                    fontWeight={"600"}
                                >
                                    <Icon as={link.icon} size="md" color={isActive(link.path) ? "accent" : "fg.muted"} />
                                    {link.label}
                                </LinkButton>
                            ) :
                                (
                                    <Link key={link.path} to={link.path}>
                                        <Tooltip content={link.label} positioning={{ placement: "right" }}>
                                            <IconButton
                                                size={"xl"}
                                                variant="ghost"
                                                width="fit"
                                            >
                                                <Icon as={link.icon} size="md" color={isActive(link.path) ? "accent" : "fg.muted"} />
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
            <IconButton size={"md"} variant="ghost" onClick={() => setIsCollapsed(!isCollapsed)}>
                <Icon as={isCollapsed ? GoSidebarCollapse : GoSidebarExpand} size="md" color="fg.muted" />
            </IconButton>
        </Tooltip>
    )
}

const UserPersona = () => {
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


const LogoutButton = () => {
    const { clearAuth } = useAuthStore();
    const { isCollapsed } = sidebarStore();

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
                onClick={() => { clearAuth(); location.replace("/auth/login") }}
            >
                <Icon as={LuLogOut} size="md" />
            </IconButton>
        </Tooltip>
}
export default Sidebar;