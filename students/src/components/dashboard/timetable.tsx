"use client"

import {
    Box,
    Center,
    Flex,
    HStack,
    Stack,
    Text,
    Timeline,
    DatePicker,
    For,
    Spinner,
    parseDate,
    ScrollArea
} from "@chakra-ui/react"
import {
    getLocalTimeZone,
    isToday,
    isWeekend,
    today,
    type DateValue as IntlDateValue
} from "@internationalized/date"
import { useState, useMemo, useEffect } from "react"
import { LuGlobe, LuClock, LuMapPin, LuBookOpen } from "react-icons/lu"
import { useTimetable } from "@hooks/dashboard.hook"
import moment from "moment"
import type { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/date-picker/namespace"
import { EmptyStateView } from "@components/shared/empty-state"

const tz = getLocalTimeZone()

const formatTime = (isoString: string, referenceStart?: string) => {
    const m = moment.utc(isoString)
    if (referenceStart) {
        const start = moment.utc(referenceStart)
        if (m.isBefore(start)) {
            m.add(12, "hours")
        }
    }
    return m.format("hh:mm A")
}

const formatWeekday = (date: Date) => moment(date).format("dddd")

const formatMonthDay = (date: Date) => moment(date).format("MMMM D")

type DateValue = DatePicker.DateValue

const TimetableComp = () => {
    const { data: timetableResponse, isLoading } = useTimetable()

    // Determine the default date based on semester range
    const defaultDate = useMemo(() => {
        if (!timetableResponse?.data?.semesterStartDate || !timetableResponse?.data?.semesterEndDate) {
            return parseDate(moment(today(tz).toString()).format("YYYY-MM-DD"))
        }

        const now = moment()
        const start = moment(timetableResponse.data.semesterStartDate)
        const end = moment(timetableResponse.data.semesterEndDate)

        if (now.isBefore(start, 'day') || now.isAfter(end, 'day')) {
            return parseDate(end.format("YYYY-MM-DD"))
        }
        return parseDate(moment(today(tz).toString()).format("YYYY-MM-DD"))
    }, [timetableResponse])

    const [selectedDate, setSelectedDate] = useState<DateValue[]>([defaultDate])

    // Synchronize selectedDate with defaultDate when API data loads
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedDate([defaultDate])
    }, [defaultDate])

    const date = selectedDate[0] || defaultDate

    const nativeDate = useMemo(() => {
        const d = date as unknown as { toDate(tz: string): Date }
        return d?.toDate?.(tz)
    }, [date])

    const handleDateChange = (details: ValueChangeDetails) => {
        setSelectedDate(details.value)
    }

    // Filter timetable for selected day
    const slots = useMemo(() => {
        const entries = timetableResponse?.data?.entries;
        if (!entries || !nativeDate) return []
        const selectedDayName = formatWeekday(nativeDate).toUpperCase()

        return entries
            .filter(item => item.dayOfWeek.toUpperCase() === selectedDayName)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
    }, [timetableResponse, nativeDate])

    // Parse semester dates for calendar restriction
    const dateRange = useMemo(() => {
        if (!timetableResponse?.data?.semesterStartDate || !timetableResponse?.data?.semesterEndDate) return null;

        const start = moment.utc(timetableResponse.data.semesterStartDate);
        const end = moment.utc(timetableResponse.data.semesterEndDate);

        return {
            min: parseDate(start.format("YYYY-MM-DD")) as unknown as DateValue,
            max: parseDate(end.format("YYYY-MM-DD")) as unknown as DateValue
        };
    }, [timetableResponse])

    const isOnGoing = (item: typeof slots[0]) => {
        const now = moment.utc()
        const start = moment.utc(item.startTime)
        const end = moment.utc(item.endTime)
        if (end.isBefore(start)) end.add(12, "hours")
        return now.isBetween(start, end)
    }

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
                        Pick a day to view your schedule
                    </Text>
                </Stack>

                <DatePicker.Root
                    key={timetableResponse?.data?.semesterEndDate || "initial"}
                    inline
                    value={selectedDate as never}
                    onValueChange={handleDateChange}
                    isDateUnavailable={(date) => isWeekend(date as unknown as IntlDateValue, "en-NG")}
                    min={dateRange?.min}
                    max={dateRange?.max}
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
                    <LuGlobe />
                    <span>{tz}</span>
                </HStack>
            </Box>

            {/* Schedule Column (Timeline) */}
            <Stack minW="240px" flex="1" bg="bg">
                {date && nativeDate ? (
                    <Stack gap="0" flex="1">
                        <Stack gap="0" px="5" pt="5" pb="3">
                            <Text fontWeight="semibold">
                                {isToday(date as unknown as IntlDateValue, tz) ? "Today" : formatWeekday(nativeDate)}
                            </Text>
                            <Text textStyle="sm" color="fg.muted">
                                {formatMonthDay(nativeDate)}
                            </Text>
                        </Stack>

                        <Box px="5" py="4" pb="0" flex="1" overflowY="hidden" maxH="400px">
                            {isLoading ? (
                                <Center h="full">
                                    <Stack gap="3" align="center">
                                        <Spinner color="accent" />
                                        <Text textStyle="sm" color="fg.muted">Loading schedule...</Text>
                                    </Stack>
                                </Center>
                            ) : slots.length > 0 ? (
                                <Timeline.Root h="full" size="lg" variant="subtle" overflow={"hidden"}>
                                    <ScrollArea.Root h="full" size="xs">
                                        <ScrollArea.Viewport>
                                            <ScrollArea.Content>
                                                <For each={slots}>
                                                    {(item, index) => (
                                                        <Timeline.Item key={item.id}>
                                                            <Timeline.Content width="100px" pt="1">
                                                                <Text fontWeight={isOnGoing(item) ? "bold" : "regular"} textStyle="sm" color="fg.muted" whiteSpace="nowrap">
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
                                                                    <Box>
                                                                        <Timeline.Title fontWeight={isOnGoing(item) ? "bold" : "regular"} textStyle="md" color="fg">
                                                                            {item.course.title}
                                                                        </Timeline.Title>
                                                                        <HStack gap="2" mt="1">
                                                                            <LuBookOpen size={14} />
                                                                            <Text textStyle="xs" fontWeight="bold" color="accent">
                                                                                {item.course.code}
                                                                            </Text>
                                                                        </HStack>
                                                                    </Box>
                                                                    <HStack gap="4">
                                                                        <HStack gap="1" color="fg.subtle">
                                                                            <LuClock size={14} />
                                                                            <Text textStyle="xs">
                                                                                {moment.duration(moment(item.endTime).diff(moment(item.startTime))).asHours()} Hours
                                                                            </Text>
                                                                        </HStack>
                                                                        <HStack gap="1" color="fg.subtle">
                                                                            <LuMapPin size={14} />
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
                                    <EmptyStateView
                                        icon={<LuClock />}
                                        title="No classes scheduled"
                                        description="Enjoy your free time!"
                                    />
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
    )
}


export default TimetableComp;
