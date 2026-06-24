import { Box, CloseButton, Icon, Input, InputGroup, Table, Skeleton } from "@chakra-ui/react";
import { useCourseStudents } from "@hooks/course.hook";
import { SearchIcon } from "lucide-react";
import { LuUsers } from "react-icons/lu";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import EmptyStateView from "@components/shared/empty-state";
import { formatLevel } from "@utils/function.util";

interface CourseStudentsTableProps {
    courseId?: string;
}

const CourseStudentsTable = ({ courseId: propCourseId }: CourseStudentsTableProps = {}) => {
    const { courseId: paramCourseId } = useParams();
    const courseId = propCourseId || paramCourseId;
    const { data: students, isLoading: studentsLoading } = useCourseStudents(courseId!);
    const [search, setSearch] = useState("");

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        return students.filter((student) => {
            const profile = student.studentProfile;
            if (!profile) return false;

            // Build full name including first, last, and other name
            const firstName = profile.firstName || "";
            const surname = profile.surname || "";
            const otherName = profile.otherName || "";
            const fullName = `${surname} ${firstName} ${otherName}`.trim().toLowerCase();

            const matNo = (profile.matricNumber || "").toLowerCase();
            const regNo = (profile.registrationNo || "").toLowerCase();
            const email = (student.email || "").toLowerCase();
            const phoneNo = (profile.phone || "").toLowerCase();
            // Formatted level (e.g., "100") and raw level (e.g., "L100")
            const formattedLevel = formatLevel(profile.level).toLowerCase();
            const rawLevel = (profile.level || "").toLowerCase();

            const searchLower = search.toLowerCase();

            return (
                fullName.includes(searchLower) ||
                matNo.includes(searchLower) ||
                regNo.includes(searchLower) ||
                email.includes(searchLower) ||
                phoneNo.includes(searchLower) ||
                formattedLevel.includes(searchLower) ||
                rawLevel.includes(searchLower)
            );
        });
    }, [students, search]);

    const SkeletonRows = () => (
        <>
            {[1, 2, 3, 4, 5].map((i) => (
                <Table.Row key={i}>
                    <Table.Cell><Skeleton h="4" w="6" /></Table.Cell>
                    <Table.Cell><Skeleton h="4" w="32" /></Table.Cell>
                    <Table.Cell><Skeleton h="4" w="48" /></Table.Cell>
                    <Table.Cell><Skeleton h="4" w="12" /></Table.Cell>
                    <Table.Cell><Skeleton h="4" w="16" /></Table.Cell>
                </Table.Row>
            ))}
        </>
    );

    if (studentsLoading) {
        return (
            <Box bg="bg" rounded="md" p="4" spaceY="6" colorPalette="accent">
                <Skeleton h="10" w="1/2" rounded="md" />
                <Table.ScrollArea rounded="md" w="full">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>S/N</Table.ColumnHeader>
                                <Table.ColumnHeader>Mat. No.</Table.ColumnHeader>
                                <Table.ColumnHeader>Fullname</Table.ColumnHeader>
                                <Table.ColumnHeader>Gender</Table.ColumnHeader>
                                <Table.ColumnHeader>Level</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <SkeletonRows />
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            </Box>
        );
    }

    return (
        <Box bg="bg" rounded="md" p="4" spaceY="6" colorPalette="accent">
            <InputGroup
                w={{ base: "100%", md: "1/2" }}
                endElement={search && <CloseButton size="xs" onClick={() => setSearch("")} />}
                startElement={<Icon size="sm" as={SearchIcon} />}
            >
                <Input
                    placeholder="Search by name, matric number, level..."
                    variant="outline"
                    size="md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </InputGroup>

            <Table.ScrollArea rounded="md" w="full">
                <Table.Root size="sm" variant="outline">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader minW="4px">S/N</Table.ColumnHeader>
                            <Table.ColumnHeader minW="150px">Mat. No.</Table.ColumnHeader>
                            <Table.ColumnHeader minW="200px">Fullname</Table.ColumnHeader>
                            <Table.ColumnHeader minW="20px">Gender</Table.ColumnHeader>
                            <Table.ColumnHeader minW="20px">Level</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredStudents.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan={5} textAlign="center" py={10}>
                                    <EmptyStateView
                                        icon={<LuUsers />}
                                        title="No students found"
                                        description={
                                            students?.length === 0
                                                ? "No students have registered for this course yet."
                                                : "Try adjusting your search or filters."
                                        }
                                    />
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            filteredStudents.map((student, index) => {
                                const profile = student.studentProfile;
                                const fullName = profile
                                    ? `${profile.firstName || ""} ${profile.surname || ""} ${profile.otherName || ""}`.trim()
                                    : "";
                                return (
                                    <Table.Row key={student.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{profile?.matricNumber || "—"}</Table.Cell>
                                        <Table.Cell>{fullName || "—"}</Table.Cell>
                                        <Table.Cell>{profile?.gender || "—"}</Table.Cell>
                                        <Table.Cell>{formatLevel(profile?.level)}</Table.Cell>
                                    </Table.Row>
                                );
                            })
                        )}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </Box>
    );
};

export default CourseStudentsTable;