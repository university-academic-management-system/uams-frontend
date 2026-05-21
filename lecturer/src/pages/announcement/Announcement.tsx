import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Portal,
  DatePicker,
  EmptyState,
  VStack,
} from "@chakra-ui/react";
import type { DateValue } from "@internationalized/date";
import { LuMegaphone } from "react-icons/lu";
import { NotificationHook } from "@hooks/notification.hook";
import AnnouncementList from "@components/shared/AnnouncementList";

// Helper to convert any DateValue to YYYY-MM-DD string
const toDateString = (date: DateValue | null): string => {
  if (!date) return "";
  if ("year" in date && "month" in date && "day" in date) {
    return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
  }
  return "";
};

// Helper to get start and end from a range value (array of 2 dates)
const getRangeDates = (range: DateValue[]) => {
  const start = range[0] || null;
  const end = range[1] || null;
  return { startDate: toDateString(start), endDate: toDateString(end) };
};

const Announcement = () => {
  const [dateRange, setDateRange] = useState<DateValue[]>([]);

  const { startDate, endDate } = getRangeDates(dateRange);

  const {
    data: announcements = [],
    isLoading,
    error,
    refetch,
  } = NotificationHook.useNotifications();

  // Check if no announcements and not loading
  const hasNoAnnouncements = !isLoading && announcements.length === 0;

  return (
    <Box p="8" maxW="full" mx="auto">
      <Flex align="center" justify="space-between" mb="8" flexWrap="wrap" gap="4">
        <Heading color="fg.muted">
          Announcement
        </Heading>

        <Flex align="center" gap="3" flexWrap="wrap" colorPalette={"accent"}>
          <DatePicker.Root
            openOnClick
            selectionMode="range"
            value={dateRange}
            onValueChange={(e) => setDateRange(e.value)}
            size="sm"
            width="260px"
          >
            <DatePicker.Control>
              <DatePicker.Input index={0} />
              <DatePicker.Input index={1} />
            </DatePicker.Control>
            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content>
                  <DatePicker.View view="day">
                    <DatePicker.Header />
                    <DatePicker.DayTable />
                  </DatePicker.View>
                  <DatePicker.View view="month">
                    <DatePicker.Header />
                    <DatePicker.MonthTable />
                  </DatePicker.View>
                  <DatePicker.View view="year">
                    <DatePicker.Header />
                    <DatePicker.YearTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          </DatePicker.Root>
        </Flex>
      </Flex>

      {hasNoAnnouncements ? (
        <Box
          bg="white"
          rounded="md"
          border="1px solid"
          borderColor="border.muted"
          p="5"
          textAlign="center"
        >
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuMegaphone />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>No announcements found</EmptyState.Title>
                <EmptyState.Description>
                  {startDate || endDate
                    ? "No announcements match the selected date range."
                    : "There are no announcements available at the moment."}
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        </Box>
      ) : (
        <AnnouncementList
          announcements={announcements}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />
      )}
    </Box>
  );
};

export default Announcement;