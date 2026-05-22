import { useMemo, useCallback } from "react";
import { Bell, Info, CheckCircle2, AlertTriangle, XCircle, Check, MoreHorizontal } from "lucide-react";
import { Box, Flex, Text, Button, Spinner, EmptyState } from "@chakra-ui/react";
import { NotificationHook } from "@hooks/notification.hook";
import type { NotificationType } from "@type/notification.type";
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

const NotificationsPage = () => {
    const { data: notifications = [], isLoading } = NotificationHook.useNotifications();
    const markAllAsRead = NotificationHook.useMarkAllAsRead();

    // Filter to only show notifications with recipientType "SINGLE"
    const filteredNotifications = useMemo(
        () => notifications.filter((n) => n.recipientType === "SINGLE"),
        [notifications]
    );

    const unreadCount = useMemo(
        () => filteredNotifications.filter((n) => !n.read).length,
        [filteredNotifications]
    );

    const handleMarkAllAsRead = useCallback(() => {
        markAllAsRead.mutate();
    }, [markAllAsRead]);

    const formatTime = useCallback((dateString: string) => {
        return moment(dateString).fromNow();
    }, []);

    if (isLoading) {
        return (
            <Flex justifyContent="center" alignItems="center" minH="400px">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Box maxW="1400px" mx="auto">
            <Flex justifyContent="space-between" alignItems="center" mb="12">
                <Box>
                    <Text fontSize="3xl" fontWeight="bold" color="fg.muted">Notifications</Text>
                    <Text color="fg.subtle" mt="1" fontSize="sm">Stay updated with the latest activities across the department.</Text>
                </Box>
                {unreadCount > 0 && (
                    <Button 
                        onClick={handleMarkAllAsRead}
                        bg="accent" 
                        color="white" 
                        size="xl"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        gap="2"
                    >
                        <Check size={16} /> Mark all as read
                    </Button>
                )}
            </Flex>

            {filteredNotifications.length === 0 ? (
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
                    {filteredNotifications.map((n) => (
                        <Flex key={n.id} px="10" py="8" transition="all 0.2s" position="relative" borderBottom="xs" borderColor="border.muted" _last={{ borderBottom: "none" }} bg="white" gap="6" role="group">
                            <Flex shrink={0} w="12" h="12" borderRadius="md" alignItems="center" justifyContent="center" bg="white" color="fg.muted" border="xs" borderColor="border.muted">
                                {getIcon(n.type)}
                            </Flex>
                            <Box flex="1">
                                <Flex justifyContent="space-between" alignItems="flex-start" mb="2">
                                    <Text fontSize="md" fontWeight="bold" color="fg.muted">{n.title}</Text>
                                    <Flex alignItems="center" gap="3">
                                        <Text fontSize="10px" fontWeight="bold" color="fg.subtle" textTransform="uppercase" letterSpacing="widest">{formatTime(n.createdAt)}</Text>
                                        {!n.read && <Box w="2" h="2" bg="blue.600" borderRadius="full" />}
                                    </Flex>
                                </Flex>
                                <Text fontSize="xs" color="fg.subtle" lineHeight="relaxed" maxW="3xl">{n.message}</Text>
                            </Box>
                            <Flex opacity="0" _groupHover={{ opacity: 1 }} transition="all 0.2s" alignItems="center">
                                <Box as="button" p="2" _hover={{ bg: "fg.subtle" }} borderRadius="md" color="fg.subtle" cursor="pointer" border="none" bg="transparent">
                                    <MoreHorizontal size={20} />
                                </Box>
                            </Flex>
                        </Flex>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default NotificationsPage;
