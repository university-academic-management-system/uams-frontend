import { Box, CloseButton, Icon, Input, InputGroup, Table, Text } from "@chakra-ui/react";
import { CourseHook } from "@hooks/course.hook";
import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router";


const CourseStudentsTable = () => {
    const { courseId } = useParams();
    const { data: students, isLoading: studentsLoading } = CourseHook.useCourseStudents(
        courseId!,
    );
    const [search, setSearch] = useState("");

    const filteredStudents = useMemo(() => {
        return students?.filter((student) => {
            const fullname = `${student.firstName} ${student.lastName}`;
            const regNo = student.registrationNo || "";
            const matNo = student.studentId || "";
            const email = student.email || "";
            const phoneNo = student.phone|| "";
            return fullname.toLowerCase().includes(search.toLowerCase()) ||
                regNo.toLowerCase().includes(search.toLowerCase()) ||
                matNo.toLowerCase().includes(search.toLowerCase()) ||
                email.toLowerCase().includes(search.toLowerCase()) ||
                phoneNo.toLowerCase().includes(search.toLowerCase());
        });
    }, [students, search]);

    if (studentsLoading) return <Text>Loading students...</Text>


    return (
        <Box
            bg="bg"
            rounded="md"
            p="4"
            spaceY="6"
        >

            <InputGroup
                w="1/2"
                endElement={
                    search && <CloseButton size="xs" onClick={() => setSearch("")} />
                }
                startElement={<Icon size="sm" as={SearchIcon} />}>
                <Input
                    placeholder="Search students"
                    variant="outline"
                    size="sm"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
            </InputGroup>

            <Table.ScrollArea rounded="md" w="full">
                <Table.Root size="sm" variant="outline">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader minW="4px">S/N</Table.ColumnHeader>
                            <Table.ColumnHeader minW="150px">Reg No.</Table.ColumnHeader>
                            <Table.ColumnHeader minW="150px">Mat. No.</Table.ColumnHeader>
                            <Table.ColumnHeader minW="200px">Fullname</Table.ColumnHeader>
                            <Table.ColumnHeader minW="200px">Email</Table.ColumnHeader>
                            <Table.ColumnHeader minW="150px">Phone No</Table.ColumnHeader>
                            <Table.ColumnHeader minW="20px">Gender</Table.ColumnHeader>
                            <Table.ColumnHeader minW="20px">Level</Table.ColumnHeader>
                            <Table.ColumnHeader minW="200px">Department</Table.ColumnHeader>
                            <Table.ColumnHeader minW="40px">Current GPA</Table.ColumnHeader>
                            <Table.ColumnHeader minW="20px">Total Credits Earned</Table.ColumnHeader>
                            <Table.ColumnHeader minW="200px">Academic Standing</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredStudents?.map((student, index) => (
                            <Table.Row key={student.id}>
                                <Table.Cell>{index + 1}</Table.Cell>
                                <Table.Cell>{student?.registrationNo}</Table.Cell>
                                <Table.Cell>{student?.studentId}</Table.Cell>
                                <Table.Cell>{student?.fullName}</Table.Cell>
                                <Table.Cell>{student?.email}</Table.Cell>
                                <Table.Cell>{student?.phone}</Table.Cell>
                                <Table.Cell>{student?.gender}</Table.Cell>
                                <Table.Cell>{student?.level}</Table.Cell>
                                <Table.Cell>{student?.department}</Table.Cell>
                                <Table.Cell>{student?.currentGPA}</Table.Cell>
                                <Table.Cell>{student?.totalCreditsEarned}</Table.Cell>
                                <Table.Cell>{student?.academicStanding}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>


        </Box>
    );
};

export default CourseStudentsTable;
