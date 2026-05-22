import { Box, Table, Center, Spinner, EmptyState, VStack, Badge } from "@chakra-ui/react";
import { LuUsers, LuCircleAlert } from "react-icons/lu";
import type { Student } from "@type/student.type";

interface StudentsTableProps {
    students: Student[];
    isLoading?: boolean;
    error?: Error | null;
}

const COLUMNS = [
    { key: "sn", label: "S/N", width: "50px" },
    { key: "regNo", label: "Reg No.", width: "140px" },
    { key: "matNo", label: "Mat. No.", width: "130px" },
    { key: "fullName", label: "Full Name", width: "180px" },
    { key: "email", label: "Email", width: "180px" },
    { key: "phoneNo", label: "Phone No", width: "140px" },
    { key: "level", label: "Level", width: "100px" },
    { key: "admissionYear", label: "Admission Year", width: "130px" },
    { key: "admissionSession", label: "Admission Session", width: "140px" },
    { key: "currentSession", label: "Current Session", width: "140px" },
    { key: "regStatus", label: "Registration Status", width: "150px" },
    { key: "academicStanding", label: "Academic Standing", width: "150px" },
    { key: "cgpa", label: "CGPA", width: "80px" },
] as const;

// Helper functions for badge styling
const getRegistrationStatusBadge = (status: string | undefined) => {
    switch (status) {
        case "PENDING":
            return { label: "Pending", color: "yellow" };
        case "REGISTERED":
            return { label: "Registered", color: "green" };
        case "INCOMPLETE":
            return { label: "Incomplete", color: "orange" };
        case "CLEARED":
            return { label: "Cleared", color: "blue" };
        default:
            return { label: status || "—", color: "gray" };
    }
};

const getAcademicStandingBadge = (standing: string | undefined) => {
    switch (standing) {
        case "GOOD_STANDING":
            return { label: "Good Standing", color: "green" };
        case "PROBATION":
            return { label: "Probation", color: "orange" };
        case "SUSPENDED":
            return { label: "Suspended", color: "red" };
        case "WARNING":
            return { label: "Warning", color: "yellow" };
        case "WITHDRAWN":
            return { label: "Withdrawn", color: "red" };
        default:
            return { label: standing || "—", color: "gray" };
    }
};

const StudentsTable = ({ students, isLoading, error }: StudentsTableProps) => {
    return (
        <Box>
            <Table.ScrollArea>
            <Table.Root size="lg" variant="line" css={{ tableLayout: "auto", minWidth: "1200px" }} stickyHeader>
                <Table.Header>
                    <Table.Row>
                        {COLUMNS.map((col, i) => (
                            <Table.ColumnHeader
                                key={col.key}
                                fontSize="lg"
                                bg="#f8fafc"
                                fontWeight="600"
                                color="fg.muted"
                                textTransform="none"
                                minW={col.width}
                                px="3"
                                py="3"
                                whiteSpace="nowrap"
                            >
                                {col.label}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {isLoading ? (
                        <Table.Row>
                            <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={10}>
                                <Center>
                                    <Spinner size="lg" color="accent.500" />
                                </Center>
                            </Table.Cell>
                        </Table.Row>
                    ) : error ? (
                        <Table.Row>
                            <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={10}>
                                <EmptyState.Root>
                                    <EmptyState.Content>
                                        <EmptyState.Indicator>
                                            <LuCircleAlert />
                                        </EmptyState.Indicator>
                                        <VStack textAlign="center">
                                            <EmptyState.Title>Failed to load students</EmptyState.Title>
                                            <EmptyState.Description>
                                                {error.message}
                                            </EmptyState.Description>
                                        </VStack>
                                    </EmptyState.Content>
                                </EmptyState.Root>
                            </Table.Cell>
                        </Table.Row>
                    ) : students.length === 0 ? (
                        <Table.Row>
                            <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={10}>
                                <EmptyState.Root>
                                    <EmptyState.Content>
                                        <EmptyState.Indicator>
                                            <LuUsers />
                                        </EmptyState.Indicator>
                                        <VStack textAlign="center">
                                            <EmptyState.Title>No students found</EmptyState.Title>
                                            <EmptyState.Description>
                                                Try adjusting your search or filters.
                                            </EmptyState.Description>
                                        </VStack>
                                    </EmptyState.Content>
                                </EmptyState.Root>
                            </Table.Cell>
                        </Table.Row>
                    ) : (
                        students.map((student, index) => {
                            const regStatus = student.studentProfile?.registrationStatus;
                            const academicStanding = student.studentProfile?.academicStanding;
                            const regBadge = getRegistrationStatusBadge(regStatus);
                            const standingBadge = getAcademicStandingBadge(academicStanding);

                            return (
                                <Table.Row key={student.id}>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {index + 1}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {student.studentProfile?.registrationNo || "—"}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {student.studentProfile?.matricNumber || "—"}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="700">
                                        {`${student.studentProfile?.firstName || ""} ${student.studentProfile?.lastName || ""} ${student.studentProfile?.otherName || ""}`.trim() || "—"}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {student.email}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {student.studentProfile?.phone || "—"}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {student.studentProfile?.level || "—"}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {student.studentProfile?.admissionYear || "—"}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {student.studentProfile?.admissionSession || "—"}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {student.studentProfile?.currentSession || "—"}
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        <Badge colorPalette={regBadge.color} fontSize="xs" px="2" py="1" borderRadius="full">
                                            {regBadge.label}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        <Badge colorPalette={standingBadge.color} fontSize="xs" px="2" py="1" borderRadius="full">
                                            {standingBadge.label}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                                        {student.studentProfile?.cgpa ?? "—"}
                                    </Table.Cell>
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

export default StudentsTable;