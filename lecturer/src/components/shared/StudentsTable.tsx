import { Box, Table, Center, Spinner, EmptyState, VStack } from "@chakra-ui/react";
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

/* Left sticky cell – highest z-index */
const stickyLeft = {
    position: "sticky" as const,
    left: 0,
    bg: "white",
    zIndex: 5,
    borderRight: "1px solid",
    borderColor: "border.muted",
};

/* Right sticky cell – lower z-index + shadow for separation */
const stickyRight = {
    position: "sticky" as const,
    right: 0,
    bg: "white",
    zIndex: 4,
    borderLeft: "1px solid",
    borderColor: "border.muted",
    boxShadow: "-2px 0 5px -2px rgba(0,0,0,0.1)",
};

const stickyLeftHeader = { ...stickyLeft, bg: "gray.50", zIndex: 6 };
const stickyRightHeader = { ...stickyRight, bg: "gray.50", zIndex: 5, boxShadow: "-2px 0 5px -2px rgba(0,0,0,0.1)" };

const StudentsTable = ({ students, isLoading, error }: StudentsTableProps) => {
    return (
        <Box
            overflowX="auto"
            rounded="md"
            border="1px solid"
            borderColor="border.muted"
            bg="white"
            maxW="calc(100vw - 260px - 48px)"
        >
            <Table.Root size="sm" variant="line" css={{ tableLayout: "auto" }}>
                <Table.Header>
                    <Table.Row bg="gray.50">
                        {COLUMNS.map((col, i) => (
                            <Table.ColumnHeader
                                key={col.key}
                                fontSize="xs"
                                fontWeight="600"
                                color="fg.muted"
                                textTransform="none"
                                minW={col.width}
                                px="3"
                                py="3"
                                whiteSpace="nowrap"
                                {...(i === 0 ? stickyLeftHeader : {})}
                                {...(i === COLUMNS.length - 1 ? stickyRightHeader : {})}
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
                        students.map((student, index) => (
                            <Table.Row key={student.id}>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap"  fontSize="12px" color="fg.muted" fontWeight="500" {...stickyLeft}>
                                    {index + 1}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.studentProfile?.registrationNo || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.studentProfile?.matricNumber || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="13px" color="fg.muted" fontWeight="700">
                                    {`${student.studentProfile?.firstName || ""} ${student.studentProfile?.lastName || ""} ${student.studentProfile?.otherName || ""}`.trim() || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.email}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.studentProfile?.phone || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.studentProfile?.level || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.studentProfile?.admissionYear || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.studentProfile?.admissionSession || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.studentProfile?.currentSession || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.studentProfile?.registrationStatus?.replace("_", " ") || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500">
                                    {student.studentProfile?.academicStanding?.replace("_", " ") || "—"}
                                </Table.Cell>
                                <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="12px" color="fg.muted" fontWeight="500" {...stickyRight}>
                                    {student.studentProfile?.cgpa ?? "—"}
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default StudentsTable;