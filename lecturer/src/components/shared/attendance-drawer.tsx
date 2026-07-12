import {
    CloseButton,
    Dialog,
    Drawer,
    Portal,
    Table,
    Text,
    Badge,
    Spinner,
    Flex,
    Stack,
    InputGroup,
    Input,
    Button,
    DatePicker,
    parseDate,
    Card,
    Switch,
    useSwitchContext,
    Span,
    DataList,
    useDisclosure,
    Avatar
} from "@chakra-ui/react"
import { AttendanceHook } from "@hooks/attendance.hook";
import { useCourseStudents } from "@hooks/course.hook";
import type { Course } from "@type/course.type";
import type { AttendanceStudentEntry } from "@type/attendance.type";
import { useSearchParams } from "react-router";
import EmptyStateView from "@components/shared/empty-state";
import { LuCalendar, LuCalendarDays, LuCheck, LuPlus, LuSearch, LuX } from "react-icons/lu";
import moment from "moment";
import { useState, useMemo, useCallback } from "react";
import { toaster } from "@components/ui/toaster";
import ENV from "@configs/env.config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STATUS_OPTIONS = ["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const;
type AttendanceStatus = typeof STATUS_OPTIONS[number];


// ─── Record Attendance Dialog ─────────────────────────────────────────────────
const RecordAttendanceDialog = ({
    course,
    session
}: {
    course: Course;
    session: string;
}) => {
    const today = moment().format("YYYY-MM-DD");
    const [date, setDate] = useState(today);
    const { data: enrollments, isLoading: enrollmentsLoading } = useCourseStudents(course.id!, session);
    const { mutate: recordAttendance, isPending } = AttendanceHook.useCreateAttendance();
    const { open, setOpen, onClose } = useDisclosure();

    // Map studentId → status; default everyone to PRESENT
    const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});

    // Initialise/reset statuses when enrollments load
    const defaultedStatuses = useMemo(() => {
        if (!enrollments) return statuses;
        const base: Record<string, AttendanceStatus> = {};
        enrollments.forEach((e) => { base[e.student.id] = "ABSENT"; });
        return { ...base, ...statuses };
    }, [enrollments, statuses]);

    // Count present/absent from current selections
    const { presentCount, absentCount } = useMemo(() => {
        let present = 0;
        let absent = 0;
        Object.values(defaultedStatuses).forEach((status) => {
            if (status === "PRESENT") present += 1;
            else if (status === "ABSENT") absent += 1;
        });
        return { presentCount: present, absentCount: absent };
    }, [defaultedStatuses]);

    const handleStatusChange = useCallback((studentId: string, status: AttendanceStatus) => {
        setStatuses((prev) => ({ ...prev, [studentId]: status }));
    }, [])

    const handleSubmit = useCallback(() => {
        if (!enrollments || enrollments.length === 0) {
            toaster.error({ description: "No students found for this course." });
            return;
        }

        const students: AttendanceStudentEntry[] = enrollments.map((e) => ({
            studentId: e.student.id,
            status: defaultedStatuses[e.student.id] ?? "PRESENT",
        }));

        recordAttendance(
            { courseId: course.id!, date, session, students },
            {
                onSuccess: () => {
                    toaster.success({ description: "Attendance recorded successfully." });
                    setStatuses({});
                    onClose();
                }
            }
        );
    }, [enrollments, course, date, defaultedStatuses, recordAttendance, onClose, session]);

    return (
        <Dialog.Root closeOnInteractOutside={false} open={open} onOpenChange={(d) => setOpen(d.open)} placement="center" size="full" scrollBehavior={"inside"}>
            <Dialog.Trigger asChild>
                <Button colorPalette={"accent"} size="md">
                    <LuPlus /> New
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="xl" w="full">
                        <Dialog.Header flexDir="column">
                            <Dialog.Title gap="0" lineHeight={"shorter"}>Record Attendance</Dialog.Title>
                            <Text fontSize="sm" color="fg.muted">
                                {course?.title} • {course?.code} • {session}
                            </Text>
                            {/* Date picker */}
                            <DatePicker.Root
                                defaultValue={[parseDate(today)]}
                                w="full"
                                openOnClick

                                onValueChange={(d) => {
                                    const val = d.valueAsString?.[0];
                                    if (val) setDate(moment(val).format('YYYY-MM-DD'));
                                }}
                            >
                                <DatePicker.Control>
                                    <DatePicker.Input />
                                    <DatePicker.IndicatorGroup>
                                        <DatePicker.Trigger>
                                            <LuCalendar />
                                        </DatePicker.Trigger>
                                    </DatePicker.IndicatorGroup>
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

                            {/* stats */}
                            <DataList.Root orientation="horizontal">
                                <Flex align="center" gap="4">
                                    <Flex align="center" gap="2">
                                        Present
                                        <Badge colorPalette="accent">{presentCount}</Badge>
                                    </Flex>

                                    <Flex align="center" gap="2">
                                        Absent
                                        <Badge>{absentCount}</Badge>
                                    </Flex>
                                </Flex>
                            </DataList.Root>
                        </Dialog.Header>

                        <Dialog.Body spaceY="2" bg="bg.subtle">


                            {/* Student list */}
                            {enrollmentsLoading ? (
                                <Flex align="center" justify="center" py={8}>
                                    <Spinner size="sm" color="accent" />
                                    <Text ml="3">Loading students…</Text>
                                </Flex>
                            ) : !enrollments || enrollments.length === 0 ? (
                                <EmptyStateView
                                    icon={<LuCalendarDays />}
                                    title="No students found"
                                    description="There are no enrolled students for this course."
                                />
                            ) : enrollments?.map((enrollment, index) => {

                                return (
                                    <Flex align="center" gap="4">
                                        <Span>{index + 1} </Span>
                                        <Switch.Root
                                            className="group"
                                            w="full"
                                            cursor="pointer"
                                            colorPalette="accent"
                                            checked={defaultedStatuses[enrollment.student.id] === "PRESENT"}
                                            onCheckedChange={(e) => handleStatusChange(enrollment.student.id, e.checked ? "PRESENT" : "ABSENT")}
                                        >
                                            <Card.Root _groupChecked={{ bg: "accent.subtle" }} w="full" p="4">
                                                <Flex gap="2" align={"center"} justify={"space-between"}>
                                                    <Flex gap="2" align={"start"}>
                                                        <Avatar.Root size="lg" shape="rounded">
                                                            <Avatar.Fallback name={`${enrollment.student.firstName} ${enrollment.student.surname}`} />
                                                            {enrollment.student.passportS3Key && <Avatar.Image alt={"profile picture"} src={new URL("storage/stream/" + encodeURIComponent(enrollment.student.passportS3Key), ENV.API_BASE_URL + "api").toString()} />}
                                                        </Avatar.Root>
                                                        <Stack gap="0">
                                                            <Card.Title textStyle={"sm"}>{enrollment.student.firstName} {enrollment.student.surname}</Card.Title>
                                                            <Text>{enrollment.student.matricNumber}</Text>
                                                        </Stack>
                                                    </Flex>

                                                    <Flex align="center" gap="4">
                                                        <Switch.HiddenInput />
                                                        <Switch.Control>
                                                            <Switch.Thumb>
                                                                <Switch.ThumbIndicator fallback={<LuX color="black" />}>
                                                                    <LuCheck />
                                                                </Switch.ThumbIndicator>
                                                            </Switch.Thumb>
                                                        </Switch.Control>
                                                        <Switch.Label>
                                                            <AttendanceState />
                                                        </Switch.Label>
                                                    </Flex>
                                                </Flex>
                                            </Card.Root>
                                        </Switch.Root>
                                    </Flex>
                                )
                            })}
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" disabled={isPending}>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette="accent"
                                onClick={handleSubmit}
                                loading={isPending}
                                loadingText="Saving…"
                                disabled={!enrollments || enrollments.length === 0}
                            >
                                Save Attendance
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};


const AttendanceState = () => {
    const ctx = useSwitchContext();
    return ctx.checked ? "Present" : "Absent";
}

// ─── Attendance Drawer ────────────────────────────────────────────────────────
const AttendanceDrawer = ({ course, open, setOpen }: { course: Course, open: boolean, setOpen: (s: boolean) => void }) => {
    const [sq] = useSearchParams();
    const session = sq.get("session") || "";
    const today = moment().format("YYYY-MM-DD");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(today);
    const { data: records, isLoading: recordsLoading } = AttendanceHook.useCourseAttendance(
        course.id! && open ? course.id! : "",
        { session, date: selectedDate }
    );
    const { mutate: updateAttendance } = AttendanceHook.useUpdateAttendance();

    const filteredRecords = useMemo(() => {
        if (!records) return [];
        if (!searchQuery.trim()) return records;
        const q = searchQuery.toLowerCase();
        return records.filter((record) => {
            const student = record.enrollment?.student;
            if (!student) return false;
            return (
                student.matricNumber?.toLowerCase().includes(q) ||
                student.firstName?.toLowerCase().includes(q) ||
                student.surname?.toLowerCase().includes(q) ||
                student.otherName?.toLowerCase().includes(q)
            );
        });
    }, [records, searchQuery]);

    const { presentCount, absentCount } = useMemo(() => {
        let present = 0;
        let absent = 0;
        filteredRecords.forEach((r) => {
            if (r.status === "PRESENT") present += 1;
            else if (r.status === "ABSENT") absent += 1;
        });
        return { presentCount: present, absentCount: absent };
    }, [filteredRecords]);

    return (
        <>
            <Drawer.Root closeOnInteractOutside={false} open={open} onOpenChange={(d) => setOpen(d.open)} size="xl">
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content bg="bg">
                            <Drawer.Header alignItems={"flex-start"} gap="0" flexDir={"column"}>
                                <Drawer.Title lineHeight={"short"}>Course Attendance Records</Drawer.Title>
                                <Text fontSize="sm" color="fg.muted">
                                    {course?.title} • {course?.code} • {session || "All Sessions"}
                                </Text>

                                <DataList.Root orientation="horizontal" mt="3">
                                    <Flex align="center" gap="4">
                                        <DataList.Item>
                                            <DataList.ItemLabel>Present</DataList.ItemLabel>
                                            <DataList.ItemValue>{presentCount}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Absent</DataList.ItemLabel>
                                            <DataList.ItemValue>{absentCount}</DataList.ItemValue>
                                        </DataList.Item>
                                    </Flex>
                                </DataList.Root>
                            </Drawer.Header>
                            <Drawer.Body>
                                <Stack w="full">
                                    {/* filters */}
                                    <Flex justify="space-between" align="center">
                                        <InputGroup startElement={<LuSearch />} maxW="md">
                                            <Input
                                                size="md"
                                                placeholder="Search here..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </InputGroup>
                                        <Flex align="center" gap="2">
                                            {/* date filter */}
                                            <DatePicker.Root
                                                value={[parseDate(selectedDate)]}
                                                maxW="sm"
                                                openOnClick
                                                onValueChange={(d) => {
                                                    const val = d.valueAsString?.[0];
                                                    if (val) setSelectedDate(moment(val).format('YYYY-MM-DD'));
                                                }}
                                            >
                                                <DatePicker.Control>
                                                    <DatePicker.Input />
                                                    <DatePicker.IndicatorGroup>
                                                        <DatePicker.Trigger>
                                                            <LuCalendar />
                                                        </DatePicker.Trigger>
                                                    </DatePicker.IndicatorGroup>
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

                                            <RecordAttendanceDialog
                                                course={course}
                                                session={session}
                                            />
                                        </Flex>
                                    </Flex>

                                    {recordsLoading ? (
                                        <Flex align="center" justify="center" py={12}>
                                            <Spinner size="sm" color="accent" />
                                            <Text ml="3">Loading attendance records...</Text>
                                        </Flex>
                                    ) : (
                                        <Table.ScrollArea rounded="md" border="1px solid" borderColor="border.muted">
                                            <Table.Root size="sm" variant="outline">
                                                <Table.Header bg="bg.subtle">
                                                    <Table.Row>
                                                        <Table.ColumnHeader w="50px">S/N</Table.ColumnHeader>
                                                        <Table.ColumnHeader></Table.ColumnHeader>
                                                        <Table.ColumnHeader minW="130px">Matric Number</Table.ColumnHeader>
                                                        <Table.ColumnHeader minW="220px">Surname</Table.ColumnHeader>
                                                        <Table.ColumnHeader minW="110px">First name</Table.ColumnHeader>
                                                        <Table.ColumnHeader minW="110px">Other name</Table.ColumnHeader>
                                                        <Table.ColumnHeader minW="110px">Status</Table.ColumnHeader>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {filteredRecords.length === 0 ? (
                                                        <Table.Row>
                                                            <Table.Cell colSpan={6} textAlign="center" py={10}>
                                                                <EmptyStateView
                                                                    icon={<LuCalendarDays />}
                                                                    title="No records found"
                                                                    description={searchQuery ? "No records match your search query." : "No attendance records have been found for this course session."}
                                                                />
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ) : (
                                                        filteredRecords.map((record, index) => {
                                                            const student = record.enrollment?.student;
                                                            return (
                                                                <Table.Row key={record.id}>
                                                                    <Table.Cell>{index + 1}</Table.Cell>
                                                                    <Table.Cell>
                                                                        <Avatar.Root size="xs">
                                                                            <Avatar.Fallback name={[student?.surname, student?.firstName, student?.otherName].filter(Boolean).join(" ")} />
                                                                            {student?.passportS3Key && <Avatar.Image src={new URL("storage/stream/" + encodeURIComponent(student?.passportS3Key || ""), ENV.API_BASE_URL + "api").toString()} />}
                                                                        </Avatar.Root>

                                                                    </Table.Cell>
                                                                    <Table.Cell>{student?.matricNumber || "—"}</Table.Cell>
                                                                    <Table.Cell>{student?.surname || "—"}</Table.Cell>
                                                                    <Table.Cell>{student?.firstName || "—"}</Table.Cell>
                                                                    <Table.Cell>{student?.otherName || "—"}</Table.Cell>
                                                                    <Table.Cell>
                                                                        <Switch.Root
                                                                            size="sm"
                                                                            colorPalette={record.status === "PRESENT" ? "green" : "red"}
                                                                            checked={record.status === "PRESENT"}
                                                                            onCheckedChange={(e) => {
                                                                                const newStatus = e.checked ? "PRESENT" : "ABSENT";
                                                                                updateAttendance({
                                                                                    attendanceId: record.id,
                                                                                    payload: { status: newStatus },
                                                                                });
                                                                            }}
                                                                        >
                                                                            <Switch.HiddenInput />
                                                                            <Switch.Control>
                                                                                <Switch.Thumb>
                                                                                    <Switch.ThumbIndicator fallback={<LuX color="black" />}>
                                                                                        <LuCheck />
                                                                                    </Switch.ThumbIndicator>
                                                                                </Switch.Thumb>
                                                                            </Switch.Control>
                                                                            <Switch.Label>
                                                                                {record.status === "PRESENT" ? "Present" : "Absent"}
                                                                            </Switch.Label>
                                                                        </Switch.Root>
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            );
                                                        })
                                                    )}
                                                </Table.Body>
                                            </Table.Root>
                                        </Table.ScrollArea>
                                    )}
                                </Stack>
                            </Drawer.Body>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>

        </>
    );
};

export default AttendanceDrawer;
