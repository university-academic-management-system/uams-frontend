import { Badge, Box, Skeleton, Table } from "@chakra-ui/react";
import EmptyStateView from "@components/shared/empty-state";
import { useCourses } from "@hooks/course.hook";
import { normalizeLevel, normalizeSemester } from "@utils/function.util";
import { useMemo } from "react";



const SemesterTabContent = ({ level, semester }: { level: "L100" | "L200" | "L300" | "L400" | "L500"; semester: "FIRST" | "SECOND" }) => {
    const { data: response, isLoading } = useCourses({ level, semester });
    const items = useMemo(() => response?.courses || [], [response])


    const rows = useMemo(() => items.map((item, index) => (
        <Table.Row key={item.id} borderBottomColor="border.muted">
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{item.code}</Table.Cell>
            <Table.Cell>{item.title}</Table.Cell>
            <Table.Cell>{item.units} Units</Table.Cell>
            <Table.Cell>
                <Badge colorPalette="gray">
                    {item.courseType}
                </Badge>
            </Table.Cell>
            <Table.Cell>
                <Badge colorPalette={item.isRegistered ? "green" : "yellow"}>
                    {item.isRegistered ? "Registered" : "Not Registered"}
                </Badge>
            </Table.Cell>
        </Table.Row>
    )), [items]);


    if (isLoading) {
        return (
            <Table.Root>
                <Table.Body>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Table.Row key={i}>
                            <Table.Cell><Skeleton h="4" w="4" /></Table.Cell>
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        )
    }

    if (items.length === 0) {
        return (
            <EmptyStateView
                title="No courses found"
                description={`No courses available for ${normalizeLevel(level)} Level - ${normalizeSemester(semester)} semester.`}
            />
        )
    }

    return <Box rounded={"md"} overflow={"hidden"} border="xs" borderColor="border.muted">
        <Table.ScrollArea maxW={{ base: "xl", md: "full" }}>
            <Table.Root variant="outline" stickyHeader size="lg" w="full">
                <Table.Header>
                    <Table.Row bg="bg.muted" borderBottomColor="border.muted">
                        <Table.ColumnHeader w="6" borderBottomColor="border.muted">S/N</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Code</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Title</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Units</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Type</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Status</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body bg="bg">{rows}</Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    </Box>
}


export default SemesterTabContent;
