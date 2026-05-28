import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    CloseButton,
    createListCollection,
    Dialog,
    Flex,
    Input,
    Portal,
    Select,
    Stack,
} from "@chakra-ui/react";
import { TimetableHook } from "@hooks/timetable.hook";
import { CourseHook } from "@hooks/course.hook";
import { toaster } from "@components/ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import type { TimetableEntry } from "@type/timetable.type";

const EditTimetableEntryDialog = ({ entry, isOpen, onClose }: { entry: TimetableEntry | null, isOpen: boolean, onClose: () => void }) => {
    const { mutate: updateEntry, isPending } = TimetableHook.useUpdateTimetableEntry();
    const { data: params } = TimetableHook.useTimetableParams();
    const { data: courses = [] } = CourseHook.useCourses({});
    const qc = useQueryClient();

    const dayMap: Record<string, string> = useMemo(() => ({
        MONDAY: "1",
        TUESDAY: "2",
        WEDNESDAY: "3",
        THURSDAY: "4",
        FRIDAY: "5",
    }), []);

    const [selectedCourse, setSelectedCourse] = useState<string | null>(entry?.course.id ?? null);
    const [selectedDay, setSelectedDay] = useState<string | null>(entry ? (dayMap[entry.dayOfWeek.toUpperCase()] || null) : null);
    const [startTime, setStartTime] = useState(entry?.startTime ?? "");
    const [endTime, setEndTime] = useState(entry?.endTime ?? "");
    const [venue, setVenue] = useState(entry?.venue ?? "");
    const [selectedSession, setSelectedSession] = useState<string | null>(entry?.session ?? null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(entry?.level ?? null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(entry?.semester ?? null);

    // Reset form when a different entry is opened
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (entry) {
            setSelectedCourse(entry.course.id);
            setSelectedDay(dayMap[entry.dayOfWeek.toUpperCase()] || null);
            setStartTime(entry.startTime);
            setEndTime(entry.endTime);
            setVenue(entry.venue || "");
            setSelectedSession(entry.session);
            setSelectedSemester(entry.semester);
            setSelectedLevel(entry.level);
        }
    }, [entry, dayMap]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const sessions = useMemo(
        () =>
            createListCollection({
                items:
                    params?.sessions?.map((session) => ({
                        label: session.name,
                        value: session.name,
                    })) || [],
            }),
        [params]
    );

    const levels = useMemo(
        () =>
            createListCollection({
                items: [
                    { label: "100", value: "L100" },
                    { label: "200", value: "L200" },
                    { label: "300", value: "L300" },
                    { label: "400", value: "L400" },
                    { label: "500", value: "L500" },
                ],
            }),
        []
    );

    const semesters = useMemo(
        () =>
            createListCollection({
                items: [
                    { label: "1st Semester", value: "FIRST" },
                    { label: "2nd Semester", value: "SECOND" },
                ],
            }),
        []
    );

    const coursesCollection = useMemo(
        () =>
            createListCollection({
                items: (courses as { id: string; code: string; title: string }[]).map((c) => ({
                    label: `${c.code} - ${c.title}`,
                    value: c.id,
                })),
            }),
        [courses]
    );

    const daysCollection = useMemo(
        () =>
            createListCollection({
                items: [
                    { label: "Monday", value: "1" },
                    { label: "Tuesday", value: "2" },
                    { label: "Wednesday", value: "3" },
                    { label: "Thursday", value: "4" },
                    { label: "Friday", value: "5" },
                ],
            }),
        []
    );

    const isValid = useMemo(() => {
        return (
            selectedCourse &&
            selectedDay &&
            startTime &&
            endTime &&
            selectedSession &&
            selectedLevel &&
            selectedSemester
        );
    }, [selectedCourse, selectedDay, startTime, endTime, selectedSession, selectedLevel, selectedSemester]);

    const handleSubmit = useCallback(async () => {
        if (!isValid || !entry) return;

        updateEntry(
            {
                id: entry.id,
                payload: {
                    courseId: selectedCourse as string,
                    dayOfWeek: Number(selectedDay),
                    startTime,
                    endTime,
                    venue: venue || undefined,
                    session: selectedSession as string,
                    semester: selectedSemester as string,
                    level: selectedLevel as string,
                }
            },
            {
                onSuccess() {
                    toaster.success({
                        description: "Timetable entry updated successfully",
                    });
                    qc.invalidateQueries({ queryKey: ["timetables"] });
                    onClose();
                },
            }
        );
    }, [
        isValid,
        updateEntry,
        entry,
        selectedCourse,
        selectedDay,
        startTime,
        endTime,
        venue,
        selectedSession,
        selectedSemester,
        selectedLevel,
        qc,
        onClose,
    ]);

    return (
        <Dialog.Root size="xl" placement="center" closeOnInteractOutside={false} open={isOpen} onOpenChange={(e) => { if (!e.open) onClose(); }}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content colorPalette="accent">
                        <Dialog.Header>
                            <Dialog.Title>Edit Timetable Entry</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body spaceY="4">
                            <Stack gap="4">
                                <Flex gap="4" w="full">
                                    <Select.Root
                                        value={selectedSession ? [selectedSession] : []}
                                        onValueChange={(e) => setSelectedSession(e.value[0])}
                                        collection={sessions}
                                        size="lg"
                                        flex="1"
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                <Select.ValueText placeholder="Select session" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {sessions.items.length === 0 ? (
                                                        <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                                            No options available
                                                        </Box>
                                                    ) : (
                                                        sessions.items.map((session: { label: string; value: string }) => (
                                                            <Select.Item item={session} key={session.value}>
                                                                <Select.ItemText>{session.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                    <Select.Root
                                        value={selectedSemester ? [selectedSemester] : []}
                                        onValueChange={(e) => setSelectedSemester(e.value[0])}
                                        collection={semesters}
                                        size="lg"
                                        flex="1"
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                <Select.ValueText placeholder="Select semester" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {semesters.items.length === 0 ? (
                                                        <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                                            No options available
                                                        </Box>
                                                    ) : (
                                                        semesters.items.map((semester: { label: string; value: string }) => (
                                                            <Select.Item item={semester} key={semester.value}>
                                                                <Select.ItemText>{semester.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                    <Select.Root
                                        value={selectedLevel ? [selectedLevel] : []}
                                        onValueChange={(e) => setSelectedLevel(e.value[0])}
                                        collection={levels}
                                        size="lg"
                                        flex="1"
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                <Select.ValueText placeholder="Select level" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {levels.items.length === 0 ? (
                                                        <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                                            No options available
                                                        </Box>
                                                    ) : (
                                                        levels.items.map((level: { label: string; value: string }) => (
                                                            <Select.Item item={level} key={level.value}>
                                                                <Select.ItemText>{level.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                </Flex>
                                <Select.Root
                                    value={selectedCourse ? [selectedCourse] : []}
                                    onValueChange={(e) => setSelectedCourse(e.value[0])}
                                    collection={coursesCollection}
                                    size="lg"
                                    flex="1"
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                            <Select.ValueText placeholder="Select course" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {coursesCollection.items.length === 0 ? (
                                                    <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                                        No courses available
                                                    </Box>
                                                ) : (
                                                    coursesCollection.items.map((c: { label: string; value: string }) => (
                                                        <Select.Item item={c} key={c.value}>
                                                            <Select.ItemText>{c.label}</Select.ItemText>
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))
                                                )}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                                <Flex gap="4" w="full">
                                    <Select.Root
                                        value={selectedDay ? [selectedDay] : []}
                                        onValueChange={(e) => setSelectedDay(e.value[0])}
                                        collection={daysCollection}
                                        size="lg"
                                        flex="1"
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                <Select.ValueText placeholder="Select day" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {daysCollection.items.map((d: { label: string; value: string }) => (
                                                        <Select.Item item={d} key={d.value}>
                                                            <Select.ItemText>{d.label}</Select.ItemText>
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                    <Input
                                        type="time"
                                        size="lg"
                                        flex="1"
                                        bg="white"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        placeholder="Start Time"
                                    />
                                    <Input
                                        type="time"
                                        size="lg"
                                        flex="1"
                                        bg="white"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        placeholder="End Time"
                                    />
                                </Flex>
                                <Input
                                    size="lg"
                                    bg="white"
                                    placeholder="Venue (optional)"
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                />
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer w="sm" justifyContent="start">
                            <Button variant="outline" size="xl" colorPalette="gray" onClick={onClose}>Cancel</Button>
                            <Button
                                size="xl"
                                flex="1"
                                onClick={handleSubmit}
                                disabled={isPending || !isValid}
                                loading={isPending}
                                loadingText="Saving..."
                            >
                                Save Changes
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="xl" colorPalette="gray"/>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default EditTimetableEntryDialog;
