import { useState, useMemo, useCallback } from "react";
import { X, Plus, Megaphone, Check } from "lucide-react";
import { Box, Flex, Text, Spinner, EmptyState, Button, Portal, IconButton } from "@chakra-ui/react";
import CreateAnnouncementModal from "@components/announcements/CreateAnnouncementModal";
import { NotificationHook } from "@hooks/notification.hook";
import { LuCalendar } from "react-icons/lu";
import type { DateValue } from "@internationalized/date";
import moment from "moment";
import { 
    DatePickerRoot, 
    DatePickerControl, 
    DatePickerInput, 
    DatePickerIndicatorGroup, 
    DatePickerTrigger, 
    DatePickerContent, 
    DatePickerView, 
    DatePickerHeader, 
    DatePickerDayTable, 
    DatePickerMonthTable, 
    DatePickerYearTable, 
    DatePickerPositioner
} from "@components/ui/date-picker";
import { Tooltip } from "@components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";

const ANNOUNCEMENT_ROLES = ["SYSTEM_ADMIN", "STAFF"];

const AnnouncementsPage = () => {
    const { data: notifications = [], isLoading } = NotificationHook.useNotifications();
    const markAllAsRead = NotificationHook.useMarkAllAsRead();
    const markAsRead = NotificationHook.useMarkAsRead();
    const queryClient = useQueryClient();

    const [dateRange, setDateRange] = useState<DateValue[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter for ROLE recipientType with SYSTEM_ADMIN or STAFF targetRole
    const announcements = useMemo(
        () => notifications.filter(
            (n) => n.recipientType === "ROLE" && n.targetRole && ANNOUNCEMENT_ROLES.includes(n.targetRole)
        ),
        [notifications]
    );

    // Apply date range filter
    const filteredAnnouncements = useMemo(() => {
        if (dateRange.length === 0) return announcements;

        return announcements.filter((item) => {
            const itemDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
            const from = dateRange[0] ? dateRange[0].toDate("UTC").getTime() : null;
            const to = dateRange[1] ? dateRange[1].toDate("UTC").getTime() : null;

            if (from && itemDate < from) return false;
            if (to && itemDate > to) return false;
            return true;
        });
    }, [announcements, dateRange]);

    const handleClearFilters = useCallback(() => {
        setDateRange([]);
    }, []);

    const handleModalOpen = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleMarkAllAsRead = useCallback(() => {
        markAllAsRead.mutate();
    }, [markAllAsRead]);

    const handleMarkAsRead = useCallback((id: string) => {
        markAsRead.mutate(id);
    }, [markAsRead]);

    const handleCreated = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }, [queryClient]);

    const formatDate = useCallback((dateString: string) => {
        return moment(dateString).format("YYYY-MM-DD");
    }, []);

    return (
        <Box maxW="1400px" mx="auto" pb="20">
            {/* Header */}
            <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems={{ base: "flex-start", md: "center" }} mb="6" gap="4">
                <Box>
                    <Text fontSize="2xl" fontWeight="bold" color="fg.muted">Announcement</Text>
                    <Text color="fg.subtle" mt="1" fontSize="sm">Stay updated with the latest announcement across the department.</Text>
                </Box>
                <Flex gap="3">
                    <Button
                        onClick={handleMarkAllAsRead}
                        variant="outline"
                        colorPalette="accent"
                        size="xl"
                        borderRadius="md"
                        fontSize="sm"
                        disabled={announcements.every(a => a.read) || markAllAsRead.isPending}
                    >
                        <Check size={18} />
                        Mark all as read
                    </Button>
                    <Button
                        onClick={handleModalOpen}
                        bg="accent"
                        color="white"
                        size="xl"
                        borderRadius="md"
                        fontSize="sm"
                    >
                        <Plus size={18} />
                        Create Announcement
                    </Button>
                </Flex>
            </Flex>

            {/* Date Filters */}
            <Flex colorPalette="accent" justifyContent={{ base: "flex-start", md: "flex-end" }} alignItems="flex-end" mb="8" gap="3" flexWrap="wrap">
                <DatePickerRoot openOnClick
                    selectionMode="range" 
                    maxWidth="24rem" 
                    size="xl"
                    bg="white"
                    value={dateRange}
                    onValueChange={(e) => setDateRange(e.value)}
                >
                    <DatePickerControl>
                        <DatePickerInput index={0} />
                        <DatePickerInput index={1} />
                        <DatePickerIndicatorGroup>
                            <DatePickerTrigger>
                                <LuCalendar />
                            </DatePickerTrigger>
                        </DatePickerIndicatorGroup>
                    </DatePickerControl>
                    <Portal>
                        <DatePickerPositioner>
                            <DatePickerContent>
                                <DatePickerView view="day">
                                    <DatePickerHeader />
                                    <DatePickerDayTable />
                                </DatePickerView>
                                <DatePickerView view="month">
                                    <DatePickerHeader />
                                    <DatePickerMonthTable />
                                </DatePickerView>
                                <DatePickerView view="year">
                                    <DatePickerHeader />
                                    <DatePickerYearTable />
                                </DatePickerView>
                            </DatePickerContent>
                        </DatePickerPositioner>
                    </Portal>
                </DatePickerRoot>

                {dateRange.length > 0 && (
                    <Button 
                        variant="outline" 
                        onClick={handleClearFilters} 
                        borderRadius="md" 
                        color="fg.muted"
                        size="xl"
                    >
                        <X size={18} />
                    </Button>
                )}
            </Flex>

            {/* Announcements List */}
            <Flex direction="column" gap="4">
                {isLoading ? (
                    <Flex justifyContent="center" py="20" gap="3">
                        <Spinner size="md" color="#1D7AD9" />
                        <Text color="fg.muted" fontWeight="medium">Loading Announcements...</Text>
                    </Flex>
                ) : filteredAnnouncements.length === 0 ? (
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <Megaphone />
                            </EmptyState.Indicator>
                            <EmptyState.Title>No Announcements Found</EmptyState.Title>
                            <EmptyState.Description>
                                Try adjusting your date filters or create a new announcement
                            </EmptyState.Description>
                        </EmptyState.Content>
                    </EmptyState.Root>
                ) : (
                    filteredAnnouncements.map((item) => (
                        <Box key={item.id} bg="white" borderRadius="md" p="6" border="xs" borderColor="border.muted" transition="all 0.2s">
                            <Flex justifyContent="space-between" alignItems="flex-start" mb="2">
                                <Flex alignItems="center" gap="2">
                                    <Text fontSize="sm" fontWeight="bold" color="fg.muted">{item.title}</Text>
                                    {!item.read && <Box w="2" h="2" bg="blue.600" borderRadius="full" />}
                                </Flex>
                                <Flex alignItems="center" gap="3">
                                    {!item.read && (
                                        <Tooltip content="Mark as read">
                                            <IconButton 
                                                size="xs"
                                                variant="ghost"
                                                onClick={() => handleMarkAsRead(item.id)} 
                                                color="fg.subtle" 
                                                _hover={{ bg: "blue.50", color: "blue.500" }} 
                                                disabled={markAsRead.isPending}
                                            >
                                                <Check size={16} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Text fontSize="10px" fontWeight="medium" color="fg.subtle">{formatDate(item.createdAt)}</Text>
                                </Flex>
                            </Flex>
                            <Text fontSize="xs" color="fg.muted" lineHeight="relaxed" lineClamp={2}>{item.message}</Text>
                        </Box>
                    ))
                )}
            </Flex>

            {/* Create Announcement Modal */}
            <CreateAnnouncementModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onCreated={handleCreated}
            />
        </Box>
    );
};

export default AnnouncementsPage;