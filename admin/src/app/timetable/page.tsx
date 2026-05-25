import { Badge, Box, Button, CloseButton, createListCollection, Dialog, DownloadTrigger, Drawer, EmptyState, Field, FileUpload, Flex, Heading, HStack, Input, Portal, Select, Spinner, Stack, Table, Text, Wrap } from "@chakra-ui/react";
import { TimetableHook } from "@hooks/timetable.hook";
import type { TimetableItem } from "@type/timetable.type";
import { memo, useCallback, useMemo, useState } from "react";
import { Toaster, toaster } from "@components/ui/toaster";
import { CalendarX, Download, FileSpreadsheet, UploadCloud } from "lucide-react";
import { TimetableService } from "@services/timetable.service";
import { useQueryClient } from "@tanstack/react-query";

const TimeTable = () => {
    const { data: timetables, isLoading, error } = TimetableHook.useTimetable();
    const [selectedLevel, setSelectedLevel] = useState(levels.items[0].value);

    const filterTimetables = useMemo(() => {
        return !selectedLevel ? timetables : timetables?.filter((timetable) => timetable.level.name === selectedLevel);
    }, [timetables, selectedLevel]);

    return (
        <Stack gap="6">
            <Flex justify={"space-between"} wrap="wrap" gap="4">
                <Heading>Timetable</Heading>

                <TimetableUploadDialog />
            </Flex>

            {isLoading ? (
                <Flex alignItems="center" justifyContent="center" minH="400px">
                    <Flex direction="column" alignItems="center" gap="4">
                        <Spinner size="xl" color="blue.500" borderWidth="3px" />
                        <Text color="fg.muted">Loading timetables...</Text>
                    </Flex>
                </Flex>
            ) : error ? (
                <EmptyState.Root>
                    <EmptyState.Content>
                        <EmptyState.Indicator>
                            <CalendarX />
                        </EmptyState.Indicator>
                        <EmptyState.Title>Failed to Load Timetables</EmptyState.Title>
                        <EmptyState.Description>
                            {error.message || "An unexpected error occurred. Please try again later."}
                        </EmptyState.Description>
                    </EmptyState.Content>
                </EmptyState.Root>
            ) : (
                <Box
                    bg="bg"
                    rounded="md"
                    p="4"
                    spaceY="4"
                >

                    <Select.Root onSelect={(e) => setSelectedLevel(e.value)} defaultValue={[levels.items[0].value]} collection={levels} size="sm" w="32">
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
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
                                        levels.items.map((level) => (
                                            <Select.Item item={level} key={level.value}>
                                                {level.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))
                                    )}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Table.ScrollArea>
                        <Table.Root size="sm" variant="outline">
                            <Table.Header bg="bg.subtle">
                                <Table.Row>
                                    <Table.ColumnHeader minW="100px">Session</Table.ColumnHeader>
                                    <Table.ColumnHeader minW="100px">Level</Table.ColumnHeader>
                                    <Table.ColumnHeader minW="100px">Semeter</Table.ColumnHeader>
                                    <Table.ColumnHeader minW="100px"></Table.ColumnHeader>

                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {filterTimetables && filterTimetables.length > 0 ? (
                                    filterTimetables.map((item) => (
                                        <Table.Row key={item.id}>
                                            <Table.Cell>{item?.session?.name}</Table.Cell>
                                            <Table.Cell>{item?.level?.name}</Table.Cell>
                                            <Table.Cell >{item.semester?.name}</Table.Cell>
                                            <Table.Cell >
                                                <ScheduleDrawer item={item} />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan={4}>
                                            <EmptyState.Root>
                                                <EmptyState.Content>
                                                    <EmptyState.Indicator>
                                                        <CalendarX />
                                                    </EmptyState.Indicator>
                                                    <EmptyState.Title>No Timetables Found</EmptyState.Title>
                                                    <EmptyState.Description>
                                                        Upload a timetable to get started
                                                    </EmptyState.Description>
                                                </EmptyState.Content>
                                            </EmptyState.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Box>
            )}

            <Toaster />
        </Stack>
    )
}

const levels = createListCollection({
    items: [
        { label: "All levels", value: "" },
        { label: "100", value: "100" },
        { label: "200", value: "200" },
        { label: "300", value: "300" },
        { label: "400", value: "400" },
        { label: "500", value: "500" },
    ],
})


export default TimeTable;



const ScheduleDrawer = memo(({ item }: { item: TimetableItem }) => {
    // Days of the week in order
    const daysOfWeek = [
        { key: 'monday', label: 'Monday' },
        { key: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', label: 'Thursday' },
        { key: 'friday', label: 'Friday' },
        { key: 'saturday', label: 'Saturday' },
        { key: 'sunday', label: 'Sunday' }
    ];

    // Get all unique time slots across all days
    const getAllTimeSlots = () => {
        const timeSlots = new Set();

        if (item?.schedule) {
            Object.values(item.schedule).forEach(dayEntries => {
                if (Array.isArray(dayEntries)) {
                    dayEntries.forEach(entry => {
                        timeSlots.add(`${entry.startTime} - ${entry.endTime}`);
                    });
                }
            });
        }

        // Sort time slots by start time
        return Array.from(timeSlots).sort((a, b) => {
            const timeA = (a as string).split(' - ')[0];
            const timeB = (b as string).split(' - ')[0];
            return timeA.localeCompare(timeB);
        });
    };

    // Get course for a specific day and time
    const getCourseForTimeSlot = (dayKey: string, timeSlot: string) => {
        const [startTime, endTime] = timeSlot.split(' - ');

        if (item?.schedule && dayKey in item.schedule && Array.isArray(item.schedule[dayKey as keyof typeof item.schedule])) {
            const entry = item.schedule[dayKey as keyof typeof item.schedule]?.find(
                e => e.startTime === startTime && e.endTime === endTime
            );
            return entry?.courseCode || '';
        }
        return '';
    };

    const timeSlots = getAllTimeSlots();

    return (
        <Drawer.Root size="xl">
            <Drawer.Trigger asChild>
                <Button variant="surface" size="xs">
                    View
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Timetable - {item?.title}</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            {/* Info badges */}
                            <Wrap mb={6}>
                                <Badge colorPalette="blue">{item?.programme?.name}</Badge>
                                <Badge colorPalette="green">Level {item?.level?.name}</Badge>
                                <Badge colorPalette="purple">{item?.semester?.name}</Badge>
                                <Badge colorPalette="orange">Session: {item?.session?.name}</Badge>
                            </Wrap>

                            {/* Timetable Table */}
                            {timeSlots.length > 0 ? (
                                <Box overflowX="auto" borderWidth="1px" borderRadius="md">
                                    <Table.Root size="sm" variant="outline" striped>
                                        <Table.Header>
                                            <Table.Row bg="gray.50">
                                                <Table.ColumnHeader
                                                    minW="150px"
                                                    bg="gray.100"
                                                    position="sticky"
                                                    left="0"
                                                    zIndex="1"
                                                >
                                                    Time
                                                </Table.ColumnHeader>
                                                {daysOfWeek.map(day => (
                                                    <Table.ColumnHeader
                                                        key={day.key}
                                                        minW="180px"
                                                        textAlign="center"
                                                        bg="gray.50"
                                                        textTransform="capitalize"
                                                    >
                                                        {day.label}
                                                    </Table.ColumnHeader>
                                                ))}
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {timeSlots.map((timeSlot, index) => (
                                                <Table.Row key={index}>
                                                    <Table.Cell
                                                        fontWeight="medium"
                                                        bg="gray.50"
                                                        position="sticky"
                                                        left="0"
                                                        zIndex="1"
                                                    >
                                                        {timeSlot as string}
                                                    </Table.Cell>
                                                    {daysOfWeek.map(day => {
                                                        const courseCode = getCourseForTimeSlot(day.key, timeSlot as string);
                                                        return (
                                                            <Table.Cell
                                                                key={day.key}
                                                                textAlign="center"
                                                                bg={courseCode ? 'blue.50' : 'white'}
                                                            >
                                                                {courseCode ? (
                                                                    <Badge
                                                                        colorPalette="blue"
                                                                        variant="subtle"
                                                                        fontSize="xs"
                                                                        p={1}
                                                                    >
                                                                        {courseCode}
                                                                    </Badge>
                                                                ) : (
                                                                    <Text color="gray.400" fontSize="xs">—</Text>
                                                                )}
                                                            </Table.Cell>
                                                        );
                                                    })}
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>
                            ) : (
                                <EmptyState.Root>
                                    <EmptyState.Content>
                                        <EmptyState.Indicator>
                                            <CalendarX />
                                        </EmptyState.Indicator>
                                        <EmptyState.Title>No Schedule Available</EmptyState.Title>
                                        <EmptyState.Description>
                                            No schedule has been set for this timetable
                                        </EmptyState.Description>
                                    </EmptyState.Content>
                                </EmptyState.Root>
                            )}

                            {/* Legend */}
                            <HStack mt={4} gap={4} fontSize="sm" color="gray.600">
                                <HStack>
                                    <Box w="12px" h="12px" bg="blue.50" borderWidth="1px" />
                                    <Text>Course scheduled</Text>
                                </HStack>
                                <HStack>
                                    <Box w="12px" h="12px" bg="white" borderWidth="1px" />
                                    <Text>No course</Text>
                                </HStack>
                            </HStack>
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
});



const TimetableUploadDialog = () => {
    const { mutate: uploadTimetable, isPending } = TimetableHook.useUploadTimetable();
    const { data: params } = TimetableHook.useTimetableParams();
    const [file, setFile] = useState<File | null>(null);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const qc = useQueryClient();

    const handleSessionChange = useCallback((value: string | null) => {
        setSelectedSession(value);
    }, []);

    const handleLevelChange = useCallback((value: string | null) => {
        setSelectedLevel(value);
    }, []);

    const handleSemesterChange = useCallback((value: string | null) => {
        setSelectedSemester(value);
    }, []);

    const handleProgrammeChange = useCallback((value: string | null) => {
        setSelectedProgramme(value);
    }, []);

    const isValid = useMemo(() => {
        return selectedSession && selectedLevel && selectedSemester && selectedProgramme && file && title;
    }, [selectedSession, selectedLevel, selectedSemester, selectedProgramme, file, title]);

    const handleUpload = useCallback(async () => {
        if (!isValid || !file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sessionId", selectedSession || "");
        formData.append("semesterId", selectedSemester || "");
        formData.append("programmeId", selectedProgramme || "");
        formData.append("levelId", selectedLevel || "");
        formData.append("title", title || "");

        uploadTimetable(formData, {
            onSuccess() {
                toaster.success({ description: "Timetable uploaded successfully" });
                qc.invalidateQueries({ queryKey: ["timetables"] });
            },
            onError() {
                // Error toast handled by axios interceptor
            }
        });
    }, [file, uploadTimetable, isValid, qc]);

    const handleDownloadTemplateFile = useCallback(async () => {
        const response = await TimetableService.downloadTimetableTemplate();
        return response;
    }, []);

    const sessions = useMemo(() => createListCollection({
        items: params?.sessions?.map((session) => ({
            label: session.name,
            value: session.id,
        })) || []
    }), [params]);

    const levels = useMemo(() => createListCollection({
        items: params?.levels?.map((level) => ({
            label: level.name,
            value: level.id,
        })) || []
    }), [params]);


    const semesters = useMemo(() => createListCollection({
        items: params?.semesters?.map((semester) => ({
            label: semester.name,
            value: semester.id,
        })) || []
    }), [params]);

    const programmes = useMemo(() => createListCollection({
        items: params?.programs?.map((programme) => ({
            label: programme.name,
            value: programme.id,
        })) || []
    }), [params]);


    return (
        <Dialog.Root size="xl" placement="center" closeOnInteractOutside={false}>
            <Dialog.Trigger asChild>
                <Button size="xs" variant="surface">
                    <UploadCloud /> Upload Timetable
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content colorPalette="accent">
                        <Dialog.Header>
                            <Dialog.Title>Upload Timetable</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body spaceY="4">
                            <DownloadTrigger
                                data={() => handleDownloadTemplateFile()}
                                fileName={`timetable-template.xlsx`}
                                mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                asChild
                            >
                                <Button color="#2563eb" variant="outline" >
                                    <Download /> Download Sample File
                                </Button>
                            </DownloadTrigger>


                            <Box spaceY="4" rounded="md" p="4" border="xs" borderColor="border">
                                <Field.Root>
                                    <Field.Label>Title</Field.Label>
                                    <Input onChange={(e) => setTitle(e.target.value)} placeholder="Enter a brief title here" />
                                </Field.Root>

                                <Wrap justify="start" gap="2">
                                    {/* sessions */}
                                    <Select.Root onSelect={(d) => d.value && handleSessionChange(d.value)} collection={sessions} size="sm" width="40">
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger>
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
                                                        sessions.items.map((session: { label: string; value: string; }) => (
                                                            <Select.Item item={session} key={session.value}>
                                                                {session.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>


                                    {/* level */}
                                    <Select.Root onSelect={(d) => d.value && handleLevelChange(d.value)} collection={levels} size="sm" width="32">
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger>
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
                                                        levels.items.map((level: { label: string; value: string; }) => (
                                                            <Select.Item item={level} key={level.value}>
                                                                {level.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>



                                    {/* semesters */}
                                    <Select.Root onSelect={(d) => d.value && handleSemesterChange(d.value)} collection={semesters} size="sm" width="40">
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger>
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
                                                        semesters.items.map((semester: { label: string; value: string; }) => (
                                                            <Select.Item item={semester} key={semester.value}>
                                                                {semester.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>

                                    {/* programme */}
                                    <Select.Root onSelect={(d) => d.value && handleProgrammeChange(d.value)} collection={programmes} size="sm" width="44">
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger>
                                                <Select.ValueText placeholder="Select programme" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {programmes.items.length === 0 ? (
                                                        <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                                            No options available
                                                        </Box>
                                                    ) : (
                                                        programmes.items.map((programme: { label: string; value: string; }) => (
                                                            <Select.Item item={programme} key={programme.value}>
                                                                {programme.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                </Wrap>


                                <FileUpload.Root onFileAccept={async (file) => {
                                    setFile(file.files[0]);
                                }}>
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Button w="full" variant="outline" justifyContent={"start"} size="sm">
                                            <FileSpreadsheet /> Select file
                                        </Button>
                                    </FileUpload.Trigger>
                                    <FileUpload.List showSize clearable />
                                </FileUpload.Root>
                            </Box>


                        </Dialog.Body>
                        <Dialog.Footer w="sm" justifyContent={"start"}>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button flex="1" onClick={handleUpload} disabled={isPending || !isValid} loading={isPending} loadingText="Uploading...">Upload</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>)
}

