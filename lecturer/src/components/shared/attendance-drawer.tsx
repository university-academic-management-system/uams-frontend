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
    Select,
    createListCollection,
    Card,
    Avatar,
    Switch,
    useSwitchContext,
} from "@chakra-ui/react"
import { AttendanceHook } from "@hooks/attendance.hook";
import { useCourseStudents } from "@hooks/course.hook";
import type { Course } from "@type/course.type"
import type { AttendanceStudentEntry } from "@type/attendance.type";
import { useSearchParams } from "react-router";
import EmptyStateView from "@components/shared/empty-state";
import { LuCalendar, LuCalendarDays, LuCheck, LuPlus, LuSearch, LuX } from "react-icons/lu";
import moment from "moment";
import { useState, useMemo } from "react";
import { toaster } from "@components/ui/toaster";

const STATUS_OPTIONS = ["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const;
type AttendanceStatus = typeof STATUS_OPTIONS[number];

const statusColor = (status: string) => {
    switch (status) {
        case "PRESENT": return "green";
        case "ABSENT": return "red";
        case "LATE": return "orange";
        case "EXCUSED": return "blue";
        default: return "gray";
    }
};

const statusCollection = createListCollection({
    items: STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
});

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

    // Map studentId → status; default everyone to PRESENT
    const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});

    // Initialise/reset statuses when enrollments load
    const defaultedStatuses = useMemo(() => {
        if (!enrollments) return statuses;
        const base: Record<string, AttendanceStatus> = {};
        enrollments.forEach((e) => { base[e.student.id] = "PRESENT"; });
        return { ...base, ...statuses };
    }, [enrollments, statuses]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setStatuses((prev) => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = () => {
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
                }
            }
        );
    };

    return (
        <Dialog.Root placement="center">
            <Dialog.Trigger asChild>
                <Button colorPalette={"accent"} size="md">
                    <LuPlus /> New
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="3xl" w="full">
                        <Dialog.Header flexDir="column">
                            <Dialog.Title gap="0" lineHeight={"shorter"}>Record Attendance</Dialog.Title>
                            <Text fontSize="sm" color="fg.muted">
                                {course?.title} • {course?.code} • {session}
                            </Text>
                        </Dialog.Header>

                        <Dialog.Body>
                            {/* Date picker */}
                            <DatePicker.Root
                                defaultValue={[parseDate(today)]}
                                maxW="xs"
                                openOnClick
                                mb="4"
                                onValueChange={(d) => {
                                    const val = d.valueAsString?.[0];
                                    if (val) setDate(val);
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
                            ) : enrollments?.map((enrollment) => {

                                return (
                                    <Switch.Root w="full" cursor="pointer">
                                        <Card.Root w="full" p="4">
                                            <Flex gap="2" align={"center"} justify={"space-between"}>
                                                <Flex gap="2" align={"start"}>
                                                    <Avatar.Root size="lg" shape="rounded">
                                                        <Avatar.Fallback name={`${enrollment.student.firstName} ${enrollment.student.surname}`} />
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
    const { data: records, isLoading: recordsLoading } = AttendanceHook.useCourseAttendance(
        course.id! && open ? course.id! : "",
        { session, date: today }
    );

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
                            </Drawer.Header>
                            <Drawer.Body>
                                <Stack w="full">
                                    {/* filters */}
                                    <Flex justify="space-between" align="center">
                                        <InputGroup startElement={<LuSearch />} maxW="md">
                                            <Input size="md" placeholder="Search here..." />
                                        </InputGroup>
                                        <Flex align="center" gap="2">
                                            {/* date filter */}
                                            <DatePicker.Root defaultValue={[parseDate(today)]} maxW="sm" openOnClick>
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
                                                        <Table.ColumnHeader minW="130px">Matric Number</Table.ColumnHeader>
                                                        <Table.ColumnHeader minW="220px">Surname</Table.ColumnHeader>
                                                        <Table.ColumnHeader minW="110px">First name</Table.ColumnHeader>
                                                        <Table.ColumnHeader minW="110px">Other name</Table.ColumnHeader>
                                                        <Table.ColumnHeader minW="110px">Status</Table.ColumnHeader>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {!records || records.length === 0 ? (
                                                        <Table.Row>
                                                            <Table.Cell colSpan={6} textAlign="center" py={10}>
                                                                <EmptyStateView
                                                                    icon={<LuCalendarDays />}
                                                                    title="No attendance records"
                                                                    description="No attendance records have been found for this course session."
                                                                />
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ) : (
                                                        records.map((record, index) => {
                                                            const student = record.enrollment?.student;
                                                            return (
                                                                <Table.Row key={record.id}>
                                                                    <Table.Cell>{index + 1}</Table.Cell>
                                                                    <Table.Cell>{student?.matricNumber || "—"}</Table.Cell>
                                                                    <Table.Cell>{student?.surname || "—"}</Table.Cell>
                                                                    <Table.Cell>{student?.firstName || "—"}</Table.Cell>
                                                                    <Table.Cell>{student?.otherName || "—"}</Table.Cell>
                                                                    <Table.Cell>
                                                                        <Badge colorPalette={statusColor(record.status)} variant="subtle">
                                                                            {record.status}
                                                                        </Badge>
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
