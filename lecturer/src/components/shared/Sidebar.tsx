import { Box, Flex, Image, Text, Icon, Button, Avatar, Separator } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import sidebarItems from "@configs/sidebar.config";
import { useMemo } from "react";
import useAuthStore from "@stores/auth.store";
import LinkButton from "@components/ui/linkbutton";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, clearAuth } = useAuthStore();

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

    const handleLogout = () => {
        clearAuth();
        navigate("/auth/login");
    };

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    return (
        <Flex
            as="nav"
            direction="column"
            width="255px"
            minH="100vh"
            bg="white"
            borderRight="1px solid"
            borderColor="border.muted"
            position="fixed"
            top="8px"
            left="0"
            zIndex="10"
        >
            {/* Logo */}
            <Flex justify="center" align="center" px="5" py="2" h="14" borderBottom="1px solid" borderColor="border.muted">
                <Image src="/lecturer/assets/sidebar-image.png" alt="University of Port Harcourt" w="full" mb="2" h="fit" />
            </Flex>

            {/* Navigation Items */}
            <Flex direction="column" gap="1" px="4" py="4" flex="1">
                {filteredItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <LinkButton
                            key={item.path}
                            to={item.path}
                            width="full"
                            variant="ghost"
                            size="lg"
                            pl="2"
                            justifyContent="start"
                            gap="2"
                            px="3"
                            py="2.5"
                            rounded="md"
                            cursor="pointer"
                            fontWeight="600"
                            color={active ? "accent" : "fg.muted"}
                        >
                            <Icon as={item.icon} boxSize="5" strokeWidth={active ? 2.2 : 1.8} />
                            <Text fontSize="sm">{item.label}</Text>
                        </LinkButton>
                    );
                })}
            </Flex>

            {/* Bottom Section: Logout + Separator + User Info */}
            <Box px="4" pb="5">
                {/* Logout Button */}
                <Button
                    justifyContent="start"
                    pl="2"
                    size="xl"
                    colorPalette="red"
                    variant="ghost"
                    w="full"
                    onClick={handleLogout}
                >
                    <Icon as={LogOut} size="md" />
                    Logout
                </Button>

                {/* User Info: Avatar then Name + Email  */}
                <Flex align="center" gap="3">
                    {/* Avatar – now first */}
                    <Avatar.Root size="sm">
                        <Avatar.Fallback name={user?.name} />
                    </Avatar.Root>

                    {/* Name & Email  */}
                    <Box textAlign="left">
                        <Text fontSize="lg" color="fg.muted" lineHeight="1.3">
                            {user?.name || "N/A"}
                        </Text>
                        <Text fontSize="sm" color="fg.subtle" lineHeight="1.3">
                            {user?.email || "N/A"}
                        </Text>
                    </Box>
                </Flex>
            </Box>
        </Flex>
    );
};

export default Sidebar;