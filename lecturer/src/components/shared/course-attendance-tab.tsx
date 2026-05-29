import { useState, useMemo } from "react";
import {
    Box,
    Flex,
    Text,
    Stack,
    Input,
    Button,
    Table,
    Icon,
    CloseButton,
    InputGroup,
    Drawer,
    Portal,
    Checkbox,
} from "@chakra-ui/react";
import { SearchIcon, Plus } from "lucide-react";
import { useParams } from "react-router";
import { AttendanceHook } from "@hooks/attendance.hook";
import { CourseHook } from "@hooks/course.hook";
import { Toaster, toaster } from "@components/ui/toaster";

const CourseAttendanceTab = () => {
    const { courseId } = useParams();
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Create attendance state
    const [createDate, setCreateDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    const { data: attendance, isLoading: attendanceLoading } = AttendanceHook.useLecturerAttendance({
        courseId,
        date: dateFilter,
    });

    const { data: students, isLoading: studentsLoading } = CourseHook.useCourseStudents(courseId!);
    const { mutate: createAttendance, isPending: isCreating } = AttendanceHook.useCreateAttendance();

    const filteredAttendance = useMemo(() => {
        if (!attendance) return [];
        return attendance.filter((record) => {
            const searchLower = search.toLowerCase();
            return (
                record.fullName.toLowerCase().includes(searchLower) ||
                record.matricNo.toLowerCase().includes(searchLower)
            );
        });
    }, [attendance, search]);

    const handleCreateAttendance = () => {
        if (!createDate) {
            toaster.error({ description: "Please select a date", closable: true });
            return;
        }
        if (selectedStudentIds.length === 0) {
            toaster.error({ description: "Please select at least one student", closable: true });
            return;
        }

        createAttendance({
            courseId: courseId!,
            date: createDate,
            studentIds: selectedStudentIds,
        }, {
            onSuccess: () => {
                toaster.success({ description: "Attendance created successfully", closable: true });
                setIsDrawerOpen(false);
                setSelectedStudentIds([]);
            },
            onError: (error: Error & { response?: { data?: { message: string } } }) => {
                toaster.error({ description: error?.response?.data?.message || "Failed to create attendance", closable: true });
            }
        });
    };

    const toggleAllStudents = (checked: boolean) => {
        if (checked && students) {
            setSelectedStudentIds(students.map((s) => s.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const indeterminate = selectedStudentIds.length > 0 && selectedStudentIds.length < (students?.length || 0);

    return (
        <Box bg="bg" rounded="md" p="4" spaceY="6">
            <Flex justify="space-between" align="center" wrap="wrap" gap="4">
                <Flex gap="4" flex="1" minW="300px">
                    <InputGroup
                        flex="1"
                        startElement={<Icon size="sm" as={SearchIcon} />}
                        endElement={search && <CloseButton size="xs" onClick={() => setSearch("")} />}
                    >
                        <Input
                            placeholder="Search attendance"
                            variant="outline"
                            size="sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>

                    <Input
                        type="date"
                        size="sm"
                        w="200px"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </Flex>

                <Button size="sm" colorPalette="blue" onClick={() => setIsDrawerOpen(true)}>
                    <Plus size={16} />
                    Create New Attendance
                </Button>
            </Flex>

            {attendanceLoading ? (
                <Text>Loading attendance...</Text>
            ) : (
                <Table.ScrollArea rounded="md" border="1px solid" borderColor="gray.100">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader w="10">S/N</Table.ColumnHeader>
                                <Table.ColumnHeader>Student</Table.ColumnHeader>
                                <Table.ColumnHeader>Matric Number</Table.ColumnHeader>
                                <Table.ColumnHeader>Date</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filteredAttendance.length > 0 ? (
                                filteredAttendance.map((record, index) => (
                                    <Table.Row key={record.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{record.fullName}</Table.Cell>
                                        <Table.Cell>{record.matricNo}</Table.Cell>
                                        <Table.Cell>{record.date}</Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan={4} textAlign="center" py="10">
                                        No attendance records found.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            )}

            {/* Create Attendance Drawer */}
            <Drawer.Root open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)} size="md">
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.Header>
                                <Drawer.Title>Create New Attendance</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body>
                                <Stack spaceY="6">
                                    <Box>
                                        <Text fontWeight="600" mb="2" fontSize="sm">Select Date</Text>
                                        <Input
                                            type="date"
                                            value={createDate}
                                            onChange={(e) => setCreateDate(e.target.value)}
                                        />
                                    </Box>

                                    <Box>
                                        <Text fontWeight="600" mb="2" fontSize="sm">Select Students</Text>
                                        {studentsLoading ? (
                                            <Text>Loading students...</Text>
                                        ) : (
                                            <Table.ScrollArea rounded="md" border="1px solid" borderColor="gray.100" maxH="400px">
                                                <Table.Root size="sm" variant="outline" stickyHeader>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.ColumnHeader w="6">
                                                                <Checkbox.Root
                                                                    size="sm"
                                                                    checked={indeterminate ? "indeterminate" : selectedStudentIds.length === (students?.length || 0) && selectedStudentIds.length > 0}
                                                                    onCheckedChange={(e) => toggleAllStudents(!!e.checked)}
                                                                >
                                                                    <Checkbox.HiddenInput />
                                                                    <Checkbox.Control />
                                                                </Checkbox.Root>
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader>Student Name</Table.ColumnHeader>
                                                            <Table.ColumnHeader>Matric No.</Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {students?.map((student) => (
                                                            <Table.Row
                                                                key={student.id}
                                                                data-selected={selectedStudentIds.includes(student.id) ? "" : undefined}
                                                            >
                                                                <Table.Cell>
                                                                    <Checkbox.Root
                                                                        size="sm"
                                                                        checked={selectedStudentIds.includes(student.id)}
                                                                        onCheckedChange={(e) => {
                                                                            setSelectedStudentIds((prev) =>
                                                                                e.checked
                                                                                    ? [...prev, student.id]
                                                                                    : prev.filter((id) => id !== student.id)
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Checkbox.HiddenInput />
                                                                        <Checkbox.Control />
                                                                    </Checkbox.Root>
                                                                </Table.Cell>
                                                                <Table.Cell>{student.studentProfile.firstName + " " + student.studentProfile.lastName + (student.studentProfile.otherName ? " " + student.studentProfile.otherName : "")}</Table.Cell>
                                                                <Table.Cell>{student.studentProfile.matricNumber}</Table.Cell>
                                                            </Table.Row>
                                                        ))}
                                                    </Table.Body>
                                                </Table.Root>
                                            </Table.ScrollArea>
                                        )}
                                    </Box>
                                </Stack>
                            </Drawer.Body>
                            <Drawer.Footer>
                                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                                    Cancel
                                </Button>
                                <Button colorPalette="blue" loadingText="Submitting..." loading={isCreating} onClick={handleCreateAttendance}>
                                    Submit Attendance
                                </Button>
                            </Drawer.Footer>
                            <Drawer.CloseTrigger />
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>

            </Drawer.Root>


            <Toaster />
        </Box>


    );
};

export default CourseAttendanceTab;
