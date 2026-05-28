import { Badge, Box, IconButton, Menu, Portal, Skeleton, Stack, Table } from "@chakra-ui/react";
import EmptyStateView from "@components/shared/empty-state";
import { useResults } from "@hooks/course.hook";
import { useCourseStatStore } from "@stores/data.store";
import type { Result } from "@type/course.type";
import { gradeColor, normalizeLevel, normalizeSemester } from "@utils/function.util";
import { lazy, Suspense, useMemo } from "react";
import { LuActivity, LuEllipsisVertical } from "react-icons/lu";
import type { Level, Semester } from "@type/index.type";


// lazy import
const StatsDrawer = lazy(() => import("@components/courses/stats-drawer"));
const StatsChart = lazy(() => import("@components/courses/stats-chart"));

const SemesterTabContent = ({ level, semester }: { level: Level, semester: Semester }) => {
    const { data: response, isLoading } = useResults({ level, semester });
    const items = useMemo(() => response?.results || [], [response])


    const rows = useMemo(() => items.map((item, index) => (
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
            <Table.Cell borderBottomColor="border.muted">
                <ActionMenu item={item as Result} />
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
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
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

    return <Stack gap="4">

        <Suspense>
            <StatsChart level={level} semester={semester} />
        </Suspense>

        <Box rounded={"md"} overflow={"hidden"} border="xs" borderColor="border.muted" maxW={{ base: "calc(100vw - 34px)", md: "full" }}>
            <Table.ScrollArea maxW={{ base: "full", md: "full" }}>
                <Table.Root id={semester} variant="outline" stickyHeader size="lg">
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
                            <Table.ColumnHeader borderBottomColor="border.muted">Actions</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body bg="bg">{rows}</Table.Body>
                </Table.Root>
            </Table.ScrollArea>

            {/* Course Stats drawer */}
            <StatsDrawer />
        </Box>
    </Stack>
}





const ActionMenu = ({ item }: { item: Result }) => {
    const { init } = useCourseStatStore((state) => state);

    return (
        <Menu.Root size="md" onSelect={(d) => {
            if (d.value === "stats") {
                init(item);
            }
        }}>
            <Menu.Trigger asChild>
                <IconButton colorPalette="gray" size="sm" variant="ghost">
                    <LuEllipsisVertical />
                </IconButton>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="stats">
                            <LuActivity /> View Stats
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root >
    )
}


export default SemesterTabContent;
