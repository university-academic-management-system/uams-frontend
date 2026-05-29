import {
    Box,
    Center,
    createListCollection,
    EmptyState,
    Flex,
    Portal,
    Select,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import { TimetableHook } from "@hooks/timetable.hook";
import { useMemo, useState, lazy, Suspense } from "react";

import { CalendarX } from "lucide-react";

const TimetableUploadDialog = lazy(() => import("@components/timetable/TimetableUploadDialog"));
const TimetableCalendarView = lazy(() => import("@components/timetable/TimetableCalendarView"));

const TimeTable = () => {
    const { data: params } = TimetableHook.useTimetableParams();

    // Build collections from params
    const sessionCollection = useMemo(
        () =>
            createListCollection({
                items:
                    params?.sessions?.map((s) => ({
                        label: s.name,
                        value: s.name,
                    })) || [],
            }),
        [params]
    );

    const semesterCollection = useMemo(
        () =>
            createListCollection({
                items: [
                    { label: "1st Semester", value: "FIRST" },
                    { label: "2nd Semester", value: "SECOND" },
                ],
            }),
        []
    );

    // Filter state — hardcoded defaults so timetable loads immediately
    const [selectedSession, setSelectedSession] = useState("2025/2026");
    const [selectedSemester, setSelectedSemester] = useState("FIRST");

    const {
        data: timetableData,
        isLoading,
        error,
    } = TimetableHook.useTimetable({
        session: selectedSession,
        semester: selectedSemester,
    });

    return (
        <Stack gap="6">
            <Flex justify="flex-end" wrap="wrap" gap="4">
                <Suspense fallback={<Spinner size="sm" />}>
                    <TimetableUploadDialog />
                </Suspense>
            </Flex>

            {/* Session / Semester Filters */}
            <Flex gap="3" wrap="wrap">
                <Select.Root
                    collection={sessionCollection}
                    value={selectedSession ? [selectedSession] : []}
                    onValueChange={(e) => setSelectedSession(e.value[0])}
                    size="lg"
                    width="220px"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger
                            bg="white"
                            border="xs"
                            borderColor="border.muted"
                        >
                            <Select.ValueText placeholder="Select session" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {sessionCollection.items.length === 0 ? (
                                    <Box
                                        px="4"
                                        py="3"
                                        textAlign="center"
                                        color="fg.muted"
                                        fontSize="sm"
                                    >
                                        No sessions available
                                    </Box>
                                ) : (
                                    sessionCollection.items.map(
                                        (item: {
                                            label: string;
                                            value: string;
                                        }) => (
                                            <Select.Item
                                                key={item.value}
                                                item={item}
                                            >
                                                <Select.ItemText>
                                                    {item.label}
                                                </Select.ItemText>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        )
                                    )
                                )}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Select.Root
                    collection={semesterCollection}
                    value={[selectedSemester]}
                    onValueChange={(e) => setSelectedSemester(e.value[0])}
                    size="lg"
                    width="200px"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger
                            bg="white"
                            border="xs"
                            borderColor="border.muted"
                        >
                            <Select.ValueText placeholder="Select semester" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {semesterCollection.items.map(
                                    (item: {
                                        label: string;
                                        value: string;
                                    }) => (
                                        <Select.Item
                                            key={item.value}
                                            item={item}
                                        >
                                            <Select.ItemText>
                                                {item.label}
                                            </Select.ItemText>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    )
                                )}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Flex>

            {/* Timetable View */}
            {!selectedSession ? (
                <Center minH="400px">
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <CalendarX />
                            </EmptyState.Indicator>
                            <EmptyState.Title>
                                Select a Session
                            </EmptyState.Title>
                            <EmptyState.Description>
                                Choose a session and semester to view the
                                timetable
                            </EmptyState.Description>
                        </EmptyState.Content>
                    </EmptyState.Root>
                </Center>
            ) : isLoading ? (
                <Flex alignItems="center" justifyContent="center" minH="400px">
                    <Flex direction="column" alignItems="center" gap="4">
                        <Spinner
                            size="xl"
                            color="accent"
                            borderWidth="3px"
                        />
                        <Text color="fg.muted">Loading timetable...</Text>
                    </Flex>
                </Flex>
            ) : error ? (
                <EmptyState.Root>
                    <EmptyState.Content>
                        <EmptyState.Indicator>
                            <CalendarX />
                        </EmptyState.Indicator>
                        <EmptyState.Title>
                            Failed to Load Timetable
                        </EmptyState.Title>
                        <EmptyState.Description>
                            {error.message ||
                                "An unexpected error occurred. Please try again later."}
                        </EmptyState.Description>
                    </EmptyState.Content>
                </EmptyState.Root>
            ) : (
                <Suspense fallback={<Flex alignItems="center" justifyContent="center" minH="400px"><Spinner size="xl" color="accent" borderWidth="3px" /></Flex>}>
                    <TimetableCalendarView timetableData={timetableData} />
                </Suspense>
            )}


        </Stack>
    );
};

export default TimeTable;
