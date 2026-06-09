import {
  Box,
  Center,
  Flex,
  For,
  HStack,
  IconButton,
  ScrollArea,
  Stack,
  Text,
  Timeline,
  parseDate,
  DatePicker,
} from "@chakra-ui/react";
import { LuPen } from "react-icons/lu";
import type { TimetableData, TimetableEntry } from "@type/timetable.type";
import { memo, useEffect, useMemo, useState } from "react";
import { Clock, BookOpen, MapPin, Globe } from "lucide-react";
import {
  getLocalTimeZone,
  isToday,
  isWeekend,
  type DateValue as IntlDateValue,
} from "@internationalized/date";
import moment from "moment";

const tz = getLocalTimeZone();
type DateValue = DatePicker.DateValue;

const formatTime = (isoString: string, referenceStart?: string) => {
  const m = moment.utc(isoString);
  if (referenceStart) {
    const start = moment.utc(referenceStart);
    if (m.isBefore(start)) {
      m.add(12, "hours");
    }
  }
  return m.format("hh:mm A");
};

const formatWeekday = (date: Date) => moment(date).format("dddd");
const formatMonthDay = (date: Date) => moment(date).format("MMMM D");

interface TimetableCalendarViewProps {
  timetableData: TimetableData;
}

const TimetableCalendarView = memo(({ timetableData }: TimetableCalendarViewProps) => {
  const { semesterStartDate, semesterEndDate, entries } = timetableData;

  // Compute default date: start of semester (if valid), otherwise today
  const defaultDate = useMemo(() => {
    const start = moment(semesterStartDate);
    const end = moment(semesterEndDate);
    const now = moment();

    let target = now.isBetween(start, end) ? now : start;
    if (target.isBefore(start)) target = start;
    if (target.isAfter(end)) target = end;
    return parseDate(target.format("YYYY-MM-DD"));
  }, [semesterStartDate, semesterEndDate]);

  const [selectedDate, setSelectedDate] = useState<DateValue[]>([defaultDate]);

  // Reset selected date when semester changes (via key prop)
  useEffect(() => {
    setSelectedDate([defaultDate]);
  }, [defaultDate]);

  const date = selectedDate[0] || defaultDate;

  const nativeDate = useMemo(() => {
    const d = date as unknown as { toDate(tz: string): Date };
    return d?.toDate?.(tz);
  }, [date]);

  const handleDateChange = (details: { value: DateValue[] }) => {
    setSelectedDate(details.value);
  };

  const slots = useMemo(() => {
    if (!entries.length || !nativeDate) return [];
    const selectedDayName = formatWeekday(nativeDate).toUpperCase();
    return entries
      .filter((item) => item.dayOfWeek.toUpperCase() === selectedDayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [entries, nativeDate]);

  const isOnGoing = (item: TimetableEntry) => {
    const now = moment.utc();
    const start = moment.utc(item.startTime);
    const end = moment.utc(item.endTime);
    if (end.isBefore(start)) end.add(12, "hours");
    return now.isBetween(start, end);
  };

  // Parse min/max dates for the DatePicker
  const minDate = useMemo(() => parseDate(moment(semesterStartDate).format("YYYY-MM-DD")), [semesterStartDate]);
  const maxDate = useMemo(() => parseDate(moment(semesterEndDate).format("YYYY-MM-DD")), [semesterEndDate]);

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      borderWidth="1px"
      rounded="xl"
      overflow="hidden"
      bg="bg"
      borderColor="border.muted"
      width="full"
    >
      {/* Calendar Column */}
      <Box
        borderRight={{ base: "none", md: "xs" }}
        borderBottom={{ base: "xs", md: "none" }}
        borderRightColor={{ base: "none", md: "border.muted" }}
        borderBottomColor={{ base: "border.muted", md: "none" }}
        bg="bg.subtle/30"
      >
        <Stack gap="0" px="5" py="5">
          <Text fontWeight="semibold" textStyle="lg">
            Select a Date
          </Text>
          <Text textStyle="sm" color="fg.muted">
            Pick a day to view the schedule
          </Text>
        </Stack>

        <DatePicker.Root
          key={semesterEndDate} 
          inline
          value={selectedDate as never}
          onValueChange={handleDateChange}
          min={minDate}
          max={maxDate}
          isDateUnavailable={(date) =>
            isWeekend(date as unknown as IntlDateValue, "en-NG")
          }
          width={{ base: "full", md: "fit-content" }}
          colorPalette="accent"
        >
          <DatePicker.Content unstyled px="3" pb="4">
            <DatePicker.View view="day">
              <HStack justify="space-between" gap="0" mb="2">
                <DatePicker.PrevTrigger />
                <DatePicker.RangeText fontWeight="medium" textStyle="sm" />
                <DatePicker.NextTrigger />
              </HStack>
              <DatePicker.DayTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Root>

        <HStack px="5" pb="4" color="fg.muted" textStyle="xs">
          <Globe size={14} />
          <span>{tz}</span>
        </HStack>
      </Box>

      {/* Schedule Column */}
      <Stack minW="240px" flex="1" bg="bg">
        {date && nativeDate ? (
          <Stack gap="0" flex="1">
            <Stack gap="0" px="5" pt="5" pb="3">
              <Text fontWeight="semibold">
                {isToday(date as unknown as IntlDateValue, tz)
                  ? "Today"
                  : formatWeekday(nativeDate)}
              </Text>
              <Text textStyle="sm" color="fg.muted">
                {formatMonthDay(nativeDate)}
              </Text>
            </Stack>

            <Box px="5" py="4" pb="0" flex="1" overflowY="hidden" maxH="400px">
              {slots.length > 0 ? (
                <Timeline.Root h="full" size="lg" variant="subtle" overflow="hidden">
                  <ScrollArea.Root h="full" size="xs">
                    <ScrollArea.Viewport>
                      <ScrollArea.Content>
                        <For each={slots}>
                          {(item, index) => (
                            <Timeline.Item key={item.id}>
                              <Timeline.Content width="100px" pt="1">
                                <Text
                                  fontWeight={isOnGoing(item) ? "bold" : "regular"}
                                  textStyle="sm"
                                  color="fg.muted"
                                  whiteSpace="nowrap"
                                >
                                  {formatTime(item.startTime)}
                                </Text>
                                <Text textStyle="xs" color="fg.subtle">
                                  to {formatTime(item.endTime, item.startTime)}
                                </Text>
                              </Timeline.Content>
                              <Timeline.Connector>
                                <Timeline.Separator />
                                <Timeline.Indicator
                                  bg={isOnGoing(item) ? "accent.solid" : "bg.subtle"}
                                >
                                  <Text
                                    textStyle="xs"
                                    fontWeight="bold"
                                    color={isOnGoing(item) ? "white" : "fg.muted"}
                                  >
                                    {index + 1}
                                  </Text>
                                </Timeline.Indicator>
                              </Timeline.Connector>
                              <Timeline.Content pt="0.5" pb="8">
                                <Stack gap="2">
                                  <Flex justify="space-between" width="100%">
                                    <Box>
                                      <Timeline.Title
                                        fontWeight={isOnGoing(item) ? "bold" : "regular"}
                                        textStyle="md"
                                        color="fg"
                                      >
                                        {item.course.title}
                                      </Timeline.Title>
                                      <HStack gap="2" mt="1">
                                        <BookOpen size={14} />
                                        <Text textStyle="xs" fontWeight="bold" color="accent">
                                          {item.course.code}
                                        </Text>
                                      </HStack>
                                    </Box>
                                    <IconButton
                                      aria-label="Edit course"
                                      size="xs"
                                      variant="ghost"
                                      onClick={() => {
                                        // Implement edit logic if needed
                                        console.log("Edit", item.id);
                                      }}
                                    >
                                      <LuPen />
                                    </IconButton>
                                  </Flex>
                                  <HStack gap="4">
                                    <HStack gap="1" color="fg.subtle">
                                      <Clock size={14} />
                                      <Text textStyle="xs">
                                        {moment
                                          .duration(
                                            moment.utc(item.endTime).diff(moment.utc(item.startTime))
                                          )
                                          .asHours()}{" "}
                                        Hours
                                      </Text>
                                    </HStack>
                                    <HStack gap="1" color="fg.subtle">
                                      <MapPin size={14} />
                                      <Text textStyle="xs">{item.venue || "TBA"}</Text>
                                    </HStack>
                                  </HStack>
                                </Stack>
                              </Timeline.Content>
                            </Timeline.Item>
                          )}
                        </For>
                      </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar>
                      <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Corner />
                  </ScrollArea.Root>
                </Timeline.Root>
              ) : (
                <Center h="full" py="10">
                  <Stack gap="1" align="center" textAlign="center">
                    <Clock size={40} color="var(--chakra-colors-fg-subtle)" />
                    <Text textStyle="sm" fontWeight="medium" color="fg.muted" mt="3">
                      No classes scheduled
                    </Text>
                    <Text textStyle="xs" color="fg.subtle">
                      Enjoy your free time!
                    </Text>
                  </Stack>
                </Center>
              )}
            </Box>
          </Stack>
        ) : (
          <Center height="full" px="8" py="10" color="fg.muted">
            <Stack align="center" gap="1" textAlign="center">
              <Text textStyle="sm" fontWeight="medium">
                Select a date
              </Text>
              <Text textStyle="xs">Available time slots will appear here</Text>
            </Stack>
          </Center>
        )}
      </Stack>
    </Flex>
  );
});

export default TimetableCalendarView;