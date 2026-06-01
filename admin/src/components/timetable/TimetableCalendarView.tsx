import {
    Box,
    Button,
    Center,
    CloseButton,
    Dialog,
    Flex,
    For,
    HStack,
    IconButton,
    Portal,
    ScrollArea,
    Stack,
    Text,
    Timeline,
    parseDate,
    DatePicker
} from "@chakra-ui/react";
import { LuPen, LuTrash2 } from "react-icons/lu";
import { TimetableHook } from "@hooks/timetable.hook";
import type { TimetableEntry } from "@type/timetable.type";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { toaster } from "@components/ui/toaster";
import { Clock, BookOpen, MapPin, Globe } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
    getLocalTimeZone,
    isToday,
    isWeekend,
    type DateValue as IntlDateValue,
} from "@internationalized/date";
import moment from "moment";
import EditTimetableEntryDialog from "./EditTimetableEntryDialog";

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

const TimetableCalendarView = memo(
    ({
        timetableData,
    }: {
        timetableData:
            | {
                  semesterStartDate: string;
                  semesterEndDate: string;
                  entries: TimetableEntry[];
              }
            | undefined;
    }) => {
        const defaultDate = useMemo(() => {
            return parseDate(moment().format("YYYY-MM-DD"));
        }, []);

        const { mutate: deleteEntry } = TimetableHook.useDeleteTimetableEntry();
        const qc = useQueryClient();
        const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
        const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

        const confirmDelete = useCallback(() => {
            if (!deletingEntryId) return;
            deleteEntry(deletingEntryId, {
                onSuccess() {
                    toaster.success({ description: "Entry deleted successfully" });
                    qc.invalidateQueries({ queryKey: ["timetables"] });
                    setDeletingEntryId(null);
                }
            });
        }, [deletingEntryId, deleteEntry, qc]);

        const [selectedDate, setSelectedDate] = useState<DateValue[]>([
            defaultDate,
        ]);

        useEffect(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
            const entries = timetableData?.entries;
            if (!entries || !nativeDate) return [];
            const selectedDayName = formatWeekday(nativeDate).toUpperCase();

            return entries
                .filter(
                    (item) =>
                        item.dayOfWeek.toUpperCase() === selectedDayName
                )
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
        }, [timetableData, nativeDate]);



        const isOnGoing = (item: TimetableEntry) => {
            const now = moment.utc();
            const start = moment.utc(item.startTime);
            const end = moment.utc(item.endTime);
            if (end.isBefore(start)) end.add(12, "hours");
            return now.isBetween(start, end);
        };

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
                    borderBottomColor={{
                        base: "border.muted",
                        md: "none",
                    }}
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
                        key={
                            timetableData?.semesterEndDate || "initial"
                        }
                        inline
                        value={selectedDate as never}
                        onValueChange={handleDateChange}
                        isDateUnavailable={(date) =>
                            isWeekend(
                                date as unknown as IntlDateValue,
                                "en-NG"
                            )
                        }

                        width={{ base: "full", md: "fit-content" }}
                        colorPalette="accent"
                    >
                        <DatePicker.Content unstyled px="3" pb="4">
                            <DatePicker.View view="day">
                                <HStack
                                    justify="space-between"
                                    gap="0"
                                    mb="2"
                                >
                                    <DatePicker.PrevTrigger />
                                    <DatePicker.RangeText
                                        fontWeight="medium"
                                        textStyle="sm"
                                    />
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

                {/* Schedule Column (Timeline) */}
                <Stack minW="240px" flex="1" bg="bg">
                    {date && nativeDate ? (
                        <Stack gap="0" flex="1">
                            <Stack gap="0" px="5" pt="5" pb="3">
                                <Text fontWeight="semibold">
                                    {isToday(
                                        date as unknown as IntlDateValue,
                                        tz
                                    )
                                        ? "Today"
                                        : formatWeekday(nativeDate)}
                                </Text>
                                <Text textStyle="sm" color="fg.muted">
                                    {formatMonthDay(nativeDate)}
                                </Text>
                            </Stack>

                            <Box
                                px="5"
                                py="4"
                                pb="0"
                                flex="1"
                                overflowY="hidden"
                                maxH="400px"
                            >
                                {slots.length > 0 ? (
                                    <Timeline.Root
                                        h="full"
                                        size="lg"
                                        variant="subtle"
                                        overflow="hidden"
                                    >
                                        <ScrollArea.Root h="full" size="xs">
                                            <ScrollArea.Viewport>
                                                <ScrollArea.Content>
                                                    <For each={slots}>
                                                        {(
                                                            item,
                                                            index
                                                        ) => (
                                                            <Timeline.Item
                                                                key={
                                                                    item.id
                                                                }
                                                            >
                                                                <Timeline.Content
                                                                    width="100px"
                                                                    pt="1"
                                                                >
                                                                    <Text
                                                                        fontWeight={
                                                                            isOnGoing(
                                                                                item
                                                                            )
                                                                                ? "bold"
                                                                                : "regular"
                                                                        }
                                                                        textStyle="sm"
                                                                        color="fg.muted"
                                                                        whiteSpace="nowrap"
                                                                    >
                                                                        {formatTime(
                                                                            item.startTime
                                                                        )}
                                                                    </Text>
                                                                    <Text
                                                                        textStyle="xs"
                                                                        color="fg.subtle"
                                                                    >
                                                                        to{" "}
                                                                        {formatTime(
                                                                            item.endTime,
                                                                            item.startTime
                                                                        )}
                                                                    </Text>
                                                                </Timeline.Content>
                                                                <Timeline.Connector>
                                                                    <Timeline.Separator />
                                                                    <Timeline.Indicator
                                                                        bg={
                                                                            isOnGoing(
                                                                                item
                                                                            )
                                                                                ? "accent.solid"
                                                                                : "bg.subtle"
                                                                        }
                                                                    >
                                                                        <Text
                                                                            textStyle="xs"
                                                                            fontWeight="bold"
                                                                            color={
                                                                                isOnGoing(
                                                                                    item
                                                                                )
                                                                                    ? "white"
                                                                                    : "fg.muted"
                                                                            }
                                                                        >
                                                                            {index +
                                                                                1}
                                                                        </Text>
                                                                    </Timeline.Indicator>
                                                                </Timeline.Connector>
                                                                <Timeline.Content
                                                                    pt="0.5"
                                                                    pb="8"
                                                                >
                                                                    <Stack gap="2">
                                                                        <Flex justify="space-between" width="100%">
                                                                            <Box>
                                                                                <Timeline.Title
                                                                                    fontWeight={
                                                                                        isOnGoing(
                                                                                            item
                                                                                        )
                                                                                            ? "bold"
                                                                                            : "regular"
                                                                                    }
                                                                                    textStyle="md"
                                                                                    color="fg"
                                                                                >
                                                                                    {
                                                                                        item
                                                                                            .course
                                                                                            .title
                                                                                    }
                                                                                </Timeline.Title>
                                                                                <HStack
                                                                                    gap="2"
                                                                                    mt="1"
                                                                                >
                                                                                <BookOpen
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                <Text
                                                                                    textStyle="xs"
                                                                                    fontWeight="bold"
                                                                                    color="accent"
                                                                                >
                                                                                    {
                                                                                        item
                                                                                            .course
                                                                                            .code
                                                                                    }
                                                                                </Text>
                                                                            </HStack>
                                                                            </Box>
                                                                            <HStack gap="1" align="flex-start">
                                                                                <IconButton aria-label="Edit course" size="xs" variant="ghost" onClick={() => setEditingEntry(item)}>
                                                                                    <LuPen />
                                                                                </IconButton>
                                                                                <IconButton aria-label="Delete course" size="xs" variant="ghost" colorPalette="red" onClick={() => setDeletingEntryId(item.id)}>
                                                                                    <LuTrash2 />
                                                                                </IconButton>
                                                                            </HStack>
                                                                        </Flex>
                                                                        <HStack gap="4">
                                                                            <HStack
                                                                                gap="1"
                                                                                color="fg.subtle"
                                                                            >
                                                                                <Clock
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                <Text textStyle="xs">
                                                                                    {moment
                                                                                        .duration(
                                                                                            moment(
                                                                                                item.endTime
                                                                                            ).diff(
                                                                                                moment(
                                                                                                    item.startTime
                                                                                                )
                                                                                            )
                                                                                        )
                                                                                        .asHours()}{" "}
                                                                                    Hours
                                                                                </Text>
                                                                            </HStack>
                                                                            <HStack
                                                                                gap="1"
                                                                                color="fg.subtle"
                                                                            >
                                                                                <MapPin
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                <Text textStyle="xs">
                                                                                    {item.venue ||
                                                                                        "TBA"}
                                                                                </Text>
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
                                        <Stack
                                            gap="1"
                                            align="center"
                                            textAlign="center"
                                        >
                                            <Clock
                                                size={40}
                                                color="var(--chakra-colors-fg-subtle)"
                                            />
                                            <Text
                                                textStyle="sm"
                                                fontWeight="medium"
                                                color="fg.muted"
                                                mt="3"
                                            >
                                                No classes scheduled
                                            </Text>
                                            <Text
                                                textStyle="xs"
                                                color="fg.subtle"
                                            >
                                                Enjoy your free time!
                                            </Text>
                                        </Stack>
                                    </Center>
                                )}
                            </Box>
                        </Stack>
                    ) : (
                        <Center
                            height="full"
                            px="8"
                            py="10"
                            color="fg.muted"
                        >
                            <Stack
                                align="center"
                                gap="1"
                                textAlign="center"
                            >
                                <Text textStyle="sm" fontWeight="medium">
                                    Select a date
                                </Text>
                                <Text textStyle="xs">
                                    Available time slots will appear here
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Stack>
                <EditTimetableEntryDialog entry={editingEntry} isOpen={!!editingEntry} onClose={() => setEditingEntry(null)} />

                <Dialog.Root placement="center" role="alertdialog" open={!!deletingEntryId} onOpenChange={(e) => { if (!e.open) setDeletingEntryId(null); }}>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content colorPalette="accent">
                                <Dialog.Header>
                                    <Dialog.Title>Delete Timetable Entry</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Text>Are you sure you want to delete this timetable entry? This action cannot be undone.</Text>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Button variant="outline" colorPalette="gray" size="xl" onClick={() => setDeletingEntryId(null)}>
                                        Cancel
                                    </Button>
                                    <Button colorPalette="accent" size="xl" onClick={confirmDelete}>
                                        Delete
                                    </Button>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="xl" colorPalette="gray"/>
                                </Dialog.CloseTrigger>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            </Flex>
    );
});

export default TimetableCalendarView;
