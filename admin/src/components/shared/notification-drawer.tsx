import { useMemo, useCallback } from "react";
import { Button, CloseButton, Drawer, IconButton, Portal, Box, Flex, Text, Spinner, EmptyState } from "@chakra-ui/react";
import { Tooltip } from "@components/ui/tooltip";
import { LuBell } from "react-icons/lu";
import { Bell, Info, CheckCircle2, AlertTriangle, XCircle, Check } from "lucide-react";
import { NotificationHook } from "@hooks/notification.hook";
import type { NotificationType, NotificationItem } from "@type/notification.type";
import moment from "moment";

const getIcon = (type: NotificationType) => {
    switch (type) {
        case "INFO": return <Info size={20} />;
        case "SUCCESS": return <CheckCircle2 size={20} />;
        case "WARNING": return <AlertTriangle size={20} />;
        case "ERROR": return <XCircle size={20} />;
        default: return <Bell size={20} />;
    }
};


const NotificationDrawer = () => {
    const { data: notifications = [], isLoading } = NotificationHook.useNotifications();
    const markAllAsRead = NotificationHook.useMarkAllAsRead();
    const markAsRead = NotificationHook.useMarkAsRead();

    const filteredNotifications = useMemo(
        () => notifications.filter((n: NotificationItem) => n.recipientType === "ALL"),
        [notifications]
    );

    const unreadCount = useMemo(
        () => filteredNotifications.filter((n: NotificationItem) => !n.read).length,
        [filteredNotifications]
    );

    const handleMarkAllAsRead = useCallback(() => {
        markAllAsRead.mutate();
    }, [markAllAsRead]);

    const handleMarkAsRead = useCallback((id: string) => {
        markAsRead.mutate(id);
    }, [markAsRead]);

    const formatTime = useCallback((dateString: string) => {
        return moment(dateString).fromNow();
    }, []);

    return (
        <Drawer.Root modal={false} size={{ base: "full", md: "lg" }}>
            <Tooltip content="Notifications">
                <Drawer.Trigger asChild>
                    <IconButton variant="ghost" size="md" color="fg.muted" position="relative">
                        <LuBell />
                        {unreadCount > 0 && (
                            <Box position="absolute" top="1" right="1" w="2" h="2" bg="red.500" borderRadius="full" />
                        )}
                    </IconButton>
                </Drawer.Trigger>
            </Tooltip>
            <Portal>
                <Drawer.Positioner pt="14" pr={{ base: "0", md: "16" }} pb={{ base: "0", md: "4" }}>
                    <Drawer.Content rounded={{ base: "none", md: "md" }}>
                        <Drawer.Header>
                            <Flex direction="column" gap="2" width="full">
                                <Box>
                                    <Drawer.Title fontSize="2xl" fontWeight="bold" color="fg.muted">Notifications</Drawer.Title>
                                    <Text color="fg.subtle" mt="1" fontSize="xs">Stay updated with the latest activities.</Text>
                                </Box>
                                <Button 
                                    alignSelf="flex-end"
                                    onClick={handleMarkAllAsRead}
                                    bg="accent"
                                    size={{ base: "md", md: "xl" }}
                                    borderRadius="md"
                                    alignItems="center"
                                    disabled={unreadCount === 0}
                                >
                                    <Check size={14} /> Mark all as read
                                </Button>
                            </Flex>
                        </Drawer.Header>
                        <Drawer.Body px="6" py="0">
                            {isLoading ? (
                                <Flex justifyContent="center" alignItems="center" minH="200px">
                                    <Spinner size="xl" color="blue.500" />
                                </Flex>
                            ) : filteredNotifications.length === 0 ? (
                                <Box border="xs" borderColor="border.muted" borderRadius="md" py="20">
                                    <EmptyState.Root>
                                        <EmptyState.Content>
                                            <EmptyState.Indicator>
                                                <Bell size={28} />
                                            </EmptyState.Indicator>
                                            <EmptyState.Title>No notifications yet</EmptyState.Title>
                                            <EmptyState.Description>
                                                You're all caught up! New notifications will appear here.
                                            </EmptyState.Description>
                                        </EmptyState.Content>
                                    </EmptyState.Root>
                                </Box>
                            ) : (
                                <Box borderRadius="md" overflow="hidden" border="xs" borderColor="border.muted">
                                    {filteredNotifications.map((n: NotificationItem) => (
                                        <Flex key={n.id} px="6" py="5" transition="all 0.2s" position="relative" borderBottom="xs" borderColor="border.muted" _last={{ borderBottom: "none" }} bg="white" gap="4" role="group">
                                            <Flex shrink={0} w="10" h="10" borderRadius="md" alignItems="center" justifyContent="center" bg="white" color="fg.muted" border="xs" borderColor="border.muted">
                                                {getIcon(n.type)}
                                            </Flex>
                                            <Box flex="1">
                                                <Flex justifyContent="space-between" alignItems="flex-start" mb="1">
                                                    <Text fontSize="sm" fontWeight="bold" color="fg.muted">{n.title}</Text>
                                                    <Flex alignItems="center" gap="2">
                                                        <Text fontSize="10px" fontWeight="bold" color="fg.subtle" textTransform="uppercase" letterSpacing="widest">{formatTime(n.createdAt)}</Text>
                                                        {!n.read && <Box w="2" h="2" bg="blue.600" borderRadius="full" />}
                                                    </Flex>
                                                </Flex>
                                                <Text fontSize="xs" color="fg.subtle" lineHeight="relaxed">{n.message}</Text>
                                            </Box>
                                            {!n.read && (
                                                <Flex alignItems="center">
                                                    <Tooltip content="Mark as read">
                                                        <IconButton 
                                                            size="xs"
                                                            variant="ghost"
                                                            onClick={() => handleMarkAsRead(n.id)} 
                                                            color="fg.subtle"
                                                            _hover={{ bg: "blue.50", color: "blue.500" }} 
                                                            disabled={markAsRead.isPending}
                                                        >
                                                            <Check size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Flex>
                                            )}
                                        </Flex>
                                    ))}
                                </Box>
                            )}
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="xl" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

export default NotificationDrawer;
