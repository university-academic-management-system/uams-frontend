import { Badge, Box, DataList, Flex, Heading, Icon, Image, Separator, SimpleGrid, Stack, Table, Text } from "@chakra-ui/react";
import { useMe } from "@hooks/auth.hook";
import { useResults } from "@hooks/course.hook";
import { useResultStore } from "@stores/data.store";
import type { Level, Semester } from "@type/index.type";
import { gradeColor, normalizeLevel, normalizeSemester } from "@utils/function.util";
import moment from "moment";
import { lazy, Suspense, useMemo } from "react";
import { useSearchParams } from "react-router";

// lazy import
const StatsChart = lazy(() => import("./stats-chart"));


const ResultTemplate = () => {
    const [sp] = useSearchParams();
    const { type } = useResultStore();
    const { data: me, isLoading } = useMe();
    const { data: resultRes, isLoading: resultLoading } = useResults({ level: sp.get("level") || "L100", ...(type !== "ALL" && { semester: type }) });

    const session = useMemo(() => resultRes?.results?.[0]?.session || "N/A", [resultRes])

    const rows = useMemo(() => resultRes?.results?.map((item, index) => (
        <Table.Row key={item.id} borderBottomColor="border.muted">
            <Table.Cell borderBottomColor="border.muted">{index + 1}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.course.code}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.course.title}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.course.units}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">
                <Badge colorPalette="gray">
                    {item.course.courseType}
                </Badge>
            </Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.ca || "N/A"}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.examScore || "N/A"}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.totalScore || "N/A"}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">
                <Badge colorPalette={gradeColor(item.grade || "")}>
                    {item.grade || "N/A"}
                </Badge>
            </Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.gradePoint}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.gradePointCredit}</Table.Cell>
        </Table.Row>
    )), [resultRes?.results]);


    return <Stack id="result-template" bg="bg" align="center" p="12" gap="12">

        <Stack w="full" align="center">
            <Image src="/students/uphcsc-logo.png" alt="UPHCSC Logo" h="auto" w="72" />
            <Heading size="3xl" w="full" textAlign="center">{normalizeSemester(type)} Result</Heading>
        </Stack>

        <DataList.Root size="sm" w="full" gap="6">
            <SimpleGrid columns={2} gap="2">
                <SimpleGrid columns={2} gap="4">
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Surname</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.surname}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle" w="full" textAlign="right">First Name</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} textAlign="right">{me?.studentProfile?.firstName}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle" w="full" textAlign="right">Other Name</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} textAlign="right">{me?.studentProfile?.otherName}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle" w="full" textAlign="right">Matriculation Number</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} textAlign="right">{me?.studentProfile?.matricNumber}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle" w="full" textAlign="right">Email</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} textAlign="right">{me?.email}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle" w="full" textAlign="right">Phone number</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} textAlign="right">{me?.studentProfile?.phone}</DataList.ItemValue>
                    </DataList.Item>
                </SimpleGrid>

                <SimpleGrid columns={2} gap="4">
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Session</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{session}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle" w="full" textAlign="right">Level</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} textAlign="right">{normalizeLevel(me?.studentProfile?.level || "L100")}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Semester</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{normalizeSemester(type)}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle" w="full" textAlign="right">Faculty</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} textAlign="right">{me?.studentProfile?.faculty}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle" w="full" textAlign="right">Department</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} textAlign="right">{me?.studentProfile?.department}</DataList.ItemValue>
                    </DataList.Item>
                </SimpleGrid>
            </SimpleGrid>


        </DataList.Root>

        <Separator borderStyle={"dashed"} w="full" />

        {/* chart */}
        <Suspense>
            <StatsChart level={sp.get("level") as Level} semester={type as Semester | "ALL"} />
        </Suspense>

        <Box rounded={"md"} overflow={"hidden"} border="xs" borderColor="border.muted" w="full">
            <Table.Root variant="outline" stickyHeader size="lg" w="full">
                <Table.Header>
                    <Table.Row bg="bg.muted" borderBottomColor="border.muted">
                        <Table.ColumnHeader w="6" borderBottomColor="border.muted">S/N</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Code</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Title</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Units</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Type</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">CA</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Exam Score</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Total Score</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Grade</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Grade Point</Table.ColumnHeader>
                        <Table.ColumnHeader borderBottomColor="border.muted">Grade Point Credits</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body bg="bg">{rows}</Table.Body>
            </Table.Root>
        </Box>

        <Text color="fg.subtle" textAlign={"center"} fontSize="xs">© {moment().year()} University of Port Harcourt, Department of Computer Science. All rights reserved. Choba, Port Harcourt, Rivers State, Nigeria.</Text>

    </Stack >

}

export default ResultTemplate;