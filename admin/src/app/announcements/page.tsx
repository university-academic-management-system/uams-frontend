import { useState, useEffect } from "react";
import { X, Plus, Megaphone } from "lucide-react";
import { AnnouncementServices } from "@services/announcement.service";
import { Box, Flex, Text, Spinner, EmptyState, Button, Portal } from "@chakra-ui/react";
import CreateAnnouncementModal from "@components/announcements/CreateAnnouncementModal";
import type { Announcement } from "@type/announcement.type";
import { LuCalendar } from "react-icons/lu";
import type { DateValue } from "@internationalized/date";
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

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateValue[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await AnnouncementServices.getAnnouncements();
            const data = response?.data || [];

            const transformed = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                content: item.body,
                createdAt: item.createdAt,
                isFor: item.isFor,
                isRead: item.isRead,
            }));

            setAnnouncements(transformed);
        } catch (err) {
            console.error("Failed to fetch announcements", err);
            // Error toast handled by axios interceptor
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-CA");
    };

    const filteredAnnouncements = announcements.filter((item) => {
        if (dateRange.length === 0) return true;
        
        const itemDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
        const from = dateRange[0] ? dateRange[0].toDate("UTC").getTime() : null;
        const to = dateRange[1] ? dateRange[1].toDate("UTC").getTime() : null;
        
        if (from && itemDate < from) return false;
        if (to && itemDate > to) return false;
        return true;
    });

    const handleClearFilters = () => {
        setDateRange([]);
    };

    return (
        <Box maxW="1400px" mx="auto" pb="20">
            {/* Header */}
            <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems={{ base: "flex-start", md: "center" }} mb="6" gap="4">
                <Text fontSize="2xl" fontWeight="bold" color="fg.muted">Announcement</Text>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    bg="#1D7AD9"
                    color="white"
                    size="md"
                    fontSize="sm"
                    fontWeight="semibold"
                    _hover={{ bg: "blue.700" }}
                    gap="2"
                >
                    <Plus size={18} />
                    Create Announcement
                </Button>
            </Flex>

            {/* Date Filters */}
            <Flex justifyContent={{ base: "flex-start", md: "flex-end" }} alignItems="flex-end" mb="8" gap="3" flexWrap="wrap">
                <DatePickerRoot openOnClick
                    selectionMode="range" 
                    maxWidth="24rem" 
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
                        variant="ghost" 
                        onClick={handleClearFilters} 
                        bg="#eff3f6" 
                        _hover={{ bg: "fg.subtle" }} 
                        h="10"
                        px="4"
                        borderRadius="md" 
                        color="fg.muted" 
                    >
                        <X size={18} />
                    </Button>
                )}
            </Flex>

            {/* Announcements List */}
            <Flex direction="column" gap="4">
                {loading ? (
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
                                <Text fontSize="sm" fontWeight="bold" color="fg.muted">{item.title}</Text>
                                <Text fontSize="10px" fontWeight="medium" color="fg.subtle">{formatDate(item.createdAt)}</Text>
                            </Flex>
                            <Text fontSize="xs" color="fg.muted" lineHeight="relaxed" lineClamp={2}>{item.content}</Text>
                        </Box>
                    ))
                )}
            </Flex>

            {/* Create Announcement Modal */}
            <CreateAnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={fetchAnnouncements}
            />
        </Box>
    );
};

export default AnnouncementsPage;