import {
    LayoutDashboard,
    BookOpen,
    Users,
    UserSquare2,
    CreditCard,
    ShieldCheck,
    CalendarDays,
    Megaphone,
    Settings,
    User,
    LogOut,
    X,
} from "lucide-react";
import type { ViewType } from "@type/common.type";
import { Box, Button, Flex, Text, Image, Portal, Avatar } from "@chakra-ui/react";

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    onLogout?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
    currentUser?: string;
    email?: string;
}

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' as ViewType },
    { icon: BookOpen, label: 'Programs & Courses' as ViewType },
    { icon: Users, label: 'Lecturers' as ViewType },
    { icon: UserSquare2, label: 'Students' as ViewType },
    { icon: CreditCard, label: 'Payments' as ViewType },
    { icon: ShieldCheck, label: 'ID Card Management' as ViewType },
    { icon: CalendarDays, label: 'Timetable' as ViewType },
    { icon: Megaphone, label: 'Announcements' as ViewType },
    { icon: Settings, label: 'Settings' as ViewType },
    { icon: User, label: 'Profile' as ViewType },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout, isOpen = false, onClose, currentUser = 'Dept. Admin', email }) => {
    const handleNavigation = (view: ViewType) => {
        onViewChange(view);
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile Backdrop overlay */}
            {isOpen && (
                <Portal>
                    <Box
                        position="fixed"
                        inset="0"
                        bg="blackAlpha.600"
                        zIndex="40"
                        display={{ base: "block", lg: "none" }}
                        onClick={onClose}
                    />
                </Portal>
            )}

            <Box
                as="aside"
                w="64"
            bg="white"
            h="100vh"
            borderRight="xs"
            borderColor="border.muted"
            display="flex"
            flexDirection="column"
            position="fixed"
            left="0"
            top="0"
            zIndex="50"
            transform={{ base: isOpen ? "translateX(0)" : "translateX(-100%)", lg: "translateX(0)" }}
            transition="transform 0.3s ease-in-out"
        >
            <Flex p="3" alignItems="center" justifyContent="space-between" gap="3" borderBottom={{ base: "xs", lg: "none" }} borderColor="border.muted">
                <Image
                    src="/admin/assets/uphcscLG.png"
                    alt="UNIPORT Computer Science"
                    h="12"
                    w="auto"
                    objectFit="contain"
                />
                <Button
                    display={{ base: "block", lg: "none" }}
                    onClick={onClose}
                    p="2"
                    color="fg.muted"
                    _hover={{ bg: "fg.subtle", borderRadius: "md" }}
                >
                    <X size={20} />
                </Button>
            </Flex>

            <Box as="nav" flex="1" px="4" py="4">
                <Flex direction="column" gap="2">
                    {menuItems.map((item) => (
                        <Box
                            as="button"
                            key={item.label}
                            onClick={() => handleNavigation(item.label)}
                            w="full"
                            display="flex"
                            alignItems="center"
                            gap="3"
                            px="3"
                            py="2.5"
                            borderRadius="lg"
                            transition="all 0.2s"
                            bg={activeView === item.label ? "accent.subtle" : "transparent"}
                            color={activeView === item.label ? "accent" : "fg.muted"}
                            fontWeight="semibold"
                            _hover={{
                                bg: activeView === item.label ? "accent.subtle" : "gray.50",
                                color: activeView === item.label ? "accent" : "fg.muted",
                            }}
                        >
                            <item.icon
                                size={22}
                            />
                            <Text fontSize="md">{item.label}</Text>
                        </Box>
                    ))}
                </Flex>
            </Box>

            {onLogout && (
                <Box p="4" borderTop="xs" borderColor="border.muted" mt="auto">
                    <Box
                        as="button"
                        onClick={onLogout}
                        w="full"
                        display="flex"
                        alignItems="center"
                        gap="3"
                        px="3"
                        py="2.5"
                        borderRadius="lg"
                        transition="all 0.2s"
                        color="red.600"
                        _hover={{ bg: "red.50" }}
                        mb="4"
                    >
                        <LogOut size={22} color="#ef4444" />
                        <Text fontSize="md" fontWeight="medium">Logout</Text>
                    </Box>

                    <Box borderTop="xs" borderColor="border.muted" pt="4">
                        <Box
                            as="button"
                            onClick={() => handleNavigation('Profile')}
                            display="flex"
                            alignItems="center"
                            w="full"
                            gap="3"
                            _hover={{ bg: "slate.50" }}
                            borderRadius="lg"
                            transition="all 0.2s"
                            textAlign="left"
                        >
                            <Avatar.Root size="md" bg="gray.200" color="gray.800">
                                <Avatar.Fallback name={currentUser} />
                            </Avatar.Root>
                            <Box overflow="hidden" flex="1" mt={-2}>
                                <Text fontSize="sm" fontWeight="semibold" color="fg.muted">
                                    {currentUser}
                                </Text>
                                <Text fontSize="xs" color="fg.muted">
                                    {email}
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
        </>
    );
};

export default Sidebar;
