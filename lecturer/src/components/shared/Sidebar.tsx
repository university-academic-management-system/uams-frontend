import { Box, Flex, Image, Text, Icon, Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import sidebarItems from "@configs/sidebar.config";
import { useMemo } from "react";
import useAuthStore from "@stores/auth.store";

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
            {/* University Logo / Branding */}
            <Flex justify="center" align="center" px="5" py="2" h="14" borderBottom="1px solid" borderColor="border.muted">
                <Image
                    src="/lecturer/assets/sidebar-image.png"
                    alt="University of Port Harcourt"
                    w="full"
                    mb="2"
                    h="fit"
                />
            </Flex>

            {/* Navigation Items */}
            <Flex direction="column" gap="1" px="4" py="4" flex="1">
                {filteredItems.map((item) => {
                    const active = isActive(item.path);

                    return (
                        <Button
                            key={item.path}
                            width="full"
                            alignItems="center"
                            justifyContent="flex-start"
                            gap="3"
                            px="3"
                            py="2.5"
                            rounded="md"
                            cursor="pointer"
                            bg={active ? "accent.subtle" : "transparent"}
                            color={active ? "accent" : "fg.muted"}
                            fontWeight="semibold"
                            transition="all 0.15s ease"
                            _hover={{
                                bg: active ? "accent.muted" : "accent.subtle",
                                color: active ? "accent" : "fg.muted",
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            <Icon
                                as={item.icon}
                                boxSize="5"
                                strokeWidth={active ? 2.2 : 1.8}
                            />
                            <Text fontSize="sm">{item.label}</Text>
                        </Button>
                     
                    );
                })}
            </Flex>

            {/* Logout Button */}
            <Box px="4" pb="5">
                <Flex
                    align="center"
                    gap="3"
                    px="4"
                    py="2.5"
                    rounded="md"
                    cursor="pointer"
                    color="red.500"
                    fontWeight="700"
                    transition="all 0.15s ease"
                    _hover={{
                        bg: "red.100",
                        color: "red.600",
                    }}
                    onClick={handleLogout}
                >
                    <Icon as={LogOut} boxSize="5" strokeWidth={1.8} />
                    <Text fontSize="sm">Logout</Text>
                </Flex>
            </Box>
        </Flex>
    );
};

export default Sidebar;
