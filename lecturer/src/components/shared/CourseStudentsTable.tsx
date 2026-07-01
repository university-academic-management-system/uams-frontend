import { Box, CloseButton, Icon, Input, InputGroup, Table, Skeleton, Badge } from "@chakra-ui/react";
import { useCourseStudents } from "@hooks/course.hook";
import { SearchIcon } from "lucide-react";
import { LuUsers } from "react-icons/lu";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import EmptyStateView from "@components/shared/empty-state";
import { formatLevel } from "@utils/function.util";

const gradeColor = (grade: string) => {
    switch (grade) {
        case "A": return "green";
        case "B": return "blue";
        case "C": return "gray";
        case "D": return "yellow";
        case "E": return "orange";
        case "F": return "red";
        default: return "gray";
    }
};

interface CourseStudentsTableProps {
    courseId?: string;
}

const CourseStudentsTable = ({ courseId: propCourseId }: CourseStudentsTableProps = {}) => {
    const { courseId: paramCourseId } = useParams();
    const [sq] = useSearchParams();
    const courseId = propCourseId || paramCourseId;
    const session = sq.get("session") || "";
    const { data: students, isLoading: studentsLoading } = useCourseStudents(courseId!, session);
    const [search, setSearch] = useState("");

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        return students.filter((enrollment) => {
            const profile = enrollment.student;
            if (!profile) return false;

            // Build full name including first, last, and other name
            const firstName = profile.firstName || "";
            const surname = profile.surname || "";
            const otherName = profile.otherName || "";
            const fullName = `${surname} ${firstName} ${otherName}`.trim().toLowerCase();

            const matNo = (profile.matricNumber || "").toLowerCase();
            const regNo = (profile.registrationNo || "").toLowerCase();
            const phoneNo = (profile.phone || "").toLowerCase();
            // Formatted level (e.g., "100") and raw level (e.g., "L100")
            const formattedLevel = formatLevel(profile.level).toLowerCase();
            const rawLevel = (profile.level || "").toLowerCase();

            const searchLower = search.toLowerCase();

            return (
                fullName.includes(searchLower) ||
                matNo.includes(searchLower) ||
                regNo.includes(searchLower) ||
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
                    <Table.Cell><Skeleton h="4" w="8" /></Table.Cell>
                    <Table.Cell><Skeleton h="4" w="8" /></Table.Cell>
                    <Table.Cell><Skeleton h="4" w="8" /></Table.Cell>
                    <Table.Cell><Skeleton h="4" w="8" /></Table.Cell>
                    <Table.Cell><Skeleton h="4" w="8" /></Table.Cell>
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
                                <Table.ColumnHeader>CA</Table.ColumnHeader>
                                <Table.ColumnHeader>Exam</Table.ColumnHeader>
                                <Table.ColumnHeader>Total</Table.ColumnHeader>
                                <Table.ColumnHeader>Grade</Table.ColumnHeader>
                                <Table.ColumnHeader>GP</Table.ColumnHeader>
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
                            <Table.ColumnHeader minW="40px">CA</Table.ColumnHeader>
                            <Table.ColumnHeader minW="40px">Exam</Table.ColumnHeader>
                            <Table.ColumnHeader minW="40px">Total</Table.ColumnHeader>
                            <Table.ColumnHeader minW="40px">Grade</Table.ColumnHeader>
                            <Table.ColumnHeader minW="40px">GP</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredStudents.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan={10} textAlign="center" py={10}>
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
                             filteredStudents.map((enrollment, index) => {
                                const profile = enrollment.student;
                                const fullName = profile
                                    ? `${profile.firstName || ""} ${profile.surname || ""} ${profile.otherName || ""}`.trim()
                                    : "";
                                return (
                                    <Table.Row key={enrollment.enrollmentId}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{profile?.matricNumber || "—"}</Table.Cell>
                                        <Table.Cell>{fullName || "—"}</Table.Cell>
                                        <Table.Cell>{profile?.gender || "—"}</Table.Cell>
                                        <Table.Cell>{formatLevel(profile?.level)}</Table.Cell>
                                        <Table.Cell>{enrollment.ca !== null && enrollment.ca !== undefined ? enrollment.ca : "—"}</Table.Cell>
                                        <Table.Cell>{enrollment.examScore !== null && enrollment.examScore !== undefined ? enrollment.examScore : "—"}</Table.Cell>
                                        <Table.Cell fontWeight="bold">{enrollment.totalScore !== null && enrollment.totalScore !== undefined ? enrollment.totalScore : "—"}</Table.Cell>
                                        <Table.Cell>
                                            {enrollment.grade ? (
                                                <Badge colorPalette={gradeColor(enrollment.grade)} variant="subtle">
                                                    {enrollment.grade}
                                                </Badge>
                                            ) : (
                                                "—"
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>{enrollment.gradePoint !== null && enrollment.gradePoint !== undefined ? enrollment.gradePoint : "—"}</Table.Cell>
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