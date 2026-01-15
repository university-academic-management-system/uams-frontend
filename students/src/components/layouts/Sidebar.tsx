import { useSidebarStore } from "@/stores/useSidebarStore";
import { Flex, Heading, Icon, IconButton, Stack, Text } from "@chakra-ui/react";
import { CiGrid31 } from "react-icons/ci";
import { LuSettings, LuWallet } from "react-icons/lu";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { Link, useLocation } from "react-router";
import { Tooltip } from "../ui/tooltip";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const { collapsed, toggleSidebar, _hasHydrated } = useSidebarStore();
    const pathname = useLocation().pathname;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        (() => {
            setIsMounted(true);
        })();
    }, []);

    if (!isMounted) {
        return null;
    }
    const mainLinks = [
        {
            title: "General",
            links: [
                {
                    label: "Dashboard",
                    to: "/",
                    icon: <CiGrid31 strokeWidth="1" />,
                },
                {
                    label: "Payments",
                    to: "/payments",
                    icon: <LuWallet />,
                },
            ],
        },
        {
            title: "Support",
            links: [
                {
                    label: "Seeting",
                    to: "/settings",
                    icon: <LuSettings />,
                },

            ],
        },
    ]
    const c = _hasHydrated ? collapsed : true;

    return <Stack
        borderRight={pathname === "/" ? "sm" : "none"}
        borderRightColor={pathname === "/" ? "border" : "none"}
        bg="bg"
        as="aside" w={c ? "78px" : "250px"} onKeyDown={(e) => {
            const container = e.currentTarget as HTMLElement;
            const links = Array.from(container.querySelectorAll('a')) as HTMLElement[];
            const idx = links.findIndex(el => el === document.activeElement);
            if (e.key === 'ArrowDown') {
                const next = links[Math.min(idx + 1, links.length - 1)];
                next?.focus();
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                const prev = links[Math.max(idx - 1, 0)];
                prev?.focus();
                e.preventDefault();
            }
        }}>

        <Flex px="4" h="49px" justify={collapsed ? "center" : "space-between"} align={"center"} borderBottom={"sm"} borderBottomColor={"border"}>
            {!collapsed && <Heading>Nexus</Heading>}
            <Tooltip
                positioning={{ placement: "right" }}
                showArrow
                content={collapsed ? "Expand Portals menu" : "Collapse Portals menu"}>
                <IconButton
                    bg="bg"
                    size="xs"
                    _hover={{ bg: "bg.muted" }}
                    onClick={toggleSidebar} variant="outline" aria-label="Collapse Portals menu">
                    <Icon size="xs">
                        {collapsed ? <TbLayoutSidebarRightCollapse /> : <TbLayoutSidebarLeftCollapse />}
                    </Icon>
                </IconButton>
            </Tooltip>
        </Flex>

        <Stack gap="2">
            {mainLinks.map((link) => {
                return <>
                    <Stack key={link.title} px="4" py="2" gap="1">
                        <Heading size="xs" color="fg.subtle">{link.title}</Heading>
                        {link.links.map((link) => {
                            const normalize = (p: string) => {
                                const trimmed = p.replace(/\/+$/, "");
                                return trimmed === "" ? "/" : trimmed;
                            };
                            const current = normalize(pathname || "/");
                            const base = normalize(link.to);
                            const isActive = base === "/" ? current === "/" : current === base || current.startsWith(base + "/");
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}>
                                    <Tooltip disabled={!collapsed} positioning={{ placement: "right" }} showArrow content={link.label}>
                                        <Flex
                                            gap={3}
                                            rounded="md"
                                            align={"center"}
                                            transition="all 0.2s"
                                            p={"2"}
                                            w={collapsed ? "fit" : "full"}
                                            justify={"flex-start"}
                                            _hover={{ color: isActive ? "fg" : "fg.muted", bg: "bg.muted" }}
                                            bg={isActive ? "bg.muted" : "transparent"}
                                            color={isActive ? "fg" : "fg.muted"}
                                            _dark={{ color: isActive ? "accent.muted" : "gray.300" }}
                                        >

                                            <Icon color={isActive ? "fg" : "fg.muted"} size="md">
                                                {link.icon}
                                            </Icon>
                                            {!collapsed && (
                                                <Text fontWeight={isActive ? "bold" : "semibold"} fontSize={"sm"}>
                                                    {link.label}
                                                </Text>
                                            )}
                                        </Flex>
                                    </Tooltip>
                                </Link>
                            );
                        })}
                    </Stack>
                </>
            })}
        </Stack>
    </Stack>
}
export default Sidebar;