import { Box, Table, Text, Flex, Icon } from "@chakra-ui/react";
import { MoreHorizontal } from "lucide-react";
import type { StudentResult } from "@type/result.type";

interface ResultsTableProps {
    results: StudentResult[];
    isLoading?: boolean;
}

const getRowBg = (grade: string): string | undefined => {
    if (grade === "N/A") return "#FFFFF0";   // yellow.50 – null values
    if (grade === "F") return "#FFF5F5";     // red.50 – failed
    return undefined;
};

const COLUMNS = [
    { key: "sn", label: "S/N", width: "50px" },
    { key: "studentName", label: "Student Name", width: "150px" },
    { key: "matricNo", label: "Matric. No", width: "140px" },
    { key: "ca", label: "CA", width: "80px" },
    { key: "examScore", label: "Exam score", width: "100px" },
    { key: "total", label: "Total", width: "80px" },
    { key: "grade", label: "Grade", width: "80px" },
    { key: "action", label: "Action", width: "70px" },
] as const;

const ResultsTable = ({ results, isLoading }: ResultsTableProps) => {
    if (isLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">Loading results...</Text>
            </Flex>
        );
    }

    if (results.length === 0) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">No results found.</Text>
            </Flex>
        );
    }

    return (
        <Box borderRadius="lg" border="1px solid" borderColor="gray.100" bg="white" overflowX="auto">
            <Table.Root size="sm" variant="line">
                <Table.Header>
                    <Table.Row bg="gray.50">
                        {COLUMNS.map((col) => (
                            <Table.ColumnHeader
                                key={col.key}
                                fontSize="xs"
                                fontWeight="600"
                                color="gray.600"
                                textTransform="none"
                                minW={col.width}
                                px="4"
                                py="3"
                                whiteSpace="nowrap"
                            >
                                {col.label}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {results.map((result, index) => {
                        const rowBg = getRowBg(result.grade);
                        return (
                            <Table.Row
                                key={result.id}
                                bg={rowBg}
                                _hover={{ opacity: 0.85 }}
                                transition="opacity 0.15s"
                            >
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.600">
                                    {index + 1}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700" fontWeight="600">
                                    {result.studentName}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                    {result.matricNo}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                    {result.ca !== null ? result.ca : "Null"}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.500">
                                    {result.examScore !== null ? result.examScore : "Null"}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                    {result.total !== null ? result.total : "Null"}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                    {result.grade}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5">
                                    <Icon
                                        as={MoreHorizontal}
                                        boxSize="4"
                                        color="gray.500"
                                        cursor="pointer"
                                        _hover={{ color: "gray.700" }}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default ResultsTable;
