import { Badge, CloseButton, DataList, Drawer, Heading, Portal, Separator, SimpleGrid, Stack, Text, Center, Spinner } from "@chakra-ui/react"
import { useCourseStatStore } from "@stores/data.store";
import { Chart, useChart } from "@chakra-ui/charts"
import { Pie, PieChart, Sector, Tooltip } from "recharts"
import { gradeColor, normalizeLevel, normalizeSemester } from "@utils/function.util";
import { useAttendance } from "@hooks/course.hook";
import { useMemo } from "react";


const StatsDrawer = () => {
    const { data, init } = useCourseStatStore((state) => state);
    const { data: attendance, isLoading } = useAttendance(data?.courseId || "");

    const chartData = useMemo(() => {
        if (!attendance) return [];

        const stats = attendance.reduce((acc, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return [
            { name: "Present", value: stats["PRESENT"] || 0, color: "green.solid" },
            { name: "Absent", value: stats["ABSENT"] || 0, color: "red.solid" },
            { name: "Late", value: stats["LATE"] || 0, color: "orange.solid" },
            { name: "Excused", value: stats["EXCUSED"] || 0, color: "blue.solid" },
        ].filter(item => item.value > 0);
    }, [attendance]);

    const chart = useChart({
        data: chartData,
    })

    return (
        <Drawer.Root size="md" open={!!data} onOpenChange={(d) => !d.open && init(null)}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>{data?.course?.code || "Course Stats"}</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body spaceY="4">
                            {isLoading ? (
                                <Center py="10">
                                    <Spinner />
                                </Center>
                            ) : chartData.length > 0 ? (
                                <Chart.Root boxSize="200px" chart={chart} mx="auto">
                                    <PieChart responsive>
                                        <Tooltip
                                            cursor={false}
                                            animationDuration={100}
                                            content={<Chart.Tooltip hideLabel />}
                                        />
                                        <Pie
                                            innerRadius={60}
                                            outerRadius={100}
                                            isAnimationActive={false}
                                            data={chart.data}
                                            dataKey={chart.key("value")}
                                            nameKey="name"
                                            startAngle={180}
                                            endAngle={0}
                                            shape={(props) => (
                                                <Sector {...props} fill={chart.color(props.payload!.color)} />
                                            )}
                                        />
                                    </PieChart>
                                </Chart.Root>
                            ) : (
                                <Center py="10" flexDirection="column" gap="2">
                                    <Text color="fg.muted">No attendance data available</Text>
                                </Center>
                            )}

                            <Stack gap="4">
                                <Heading color="fg.subtle" size="sm">Course</Heading>
                                <DataList.Root size="sm">
                                    <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                                        <DataList.Item>
                                            <DataList.ItemLabel>Course Code</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.course?.code || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Course Title</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.course?.title || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Credit Units</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.course?.units || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Session</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.session || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Level</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{normalizeLevel(data?.level || "L100") || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Semester</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{normalizeSemester(data?.semester || "FIRST") || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                    </SimpleGrid>
                                </DataList.Root>
                            </Stack>

                            <Separator borderColor="border.subtle" />

                            {/* attendance info */}
                            {attendance && attendance.length > 0 && (
                                <>
                                    <Stack gap="4">
                                        <Heading color="fg.subtle" size="sm">Attendance Summary</Heading>
                                        <DataList.Root size="sm">
                                            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                                                <DataList.Item>
                                                    <DataList.ItemLabel>Total Classes</DataList.ItemLabel>
                                                    <DataList.ItemValue fontWeight="bold">{attendance.length}</DataList.ItemValue>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.ItemLabel>Present</DataList.ItemLabel>
                                                    <DataList.ItemValue fontWeight="bold" color="green.fg">
                                                        {attendance.filter(a => a.status === "PRESENT").length}
                                                    </DataList.ItemValue>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.ItemLabel>Absent</DataList.ItemLabel>
                                                    <DataList.ItemValue fontWeight="bold" color="red.fg">
                                                        {attendance.filter(a => a.status === "ABSENT").length}
                                                    </DataList.ItemValue>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.ItemLabel>Percentage</DataList.ItemLabel>
                                                    <DataList.ItemValue fontWeight="bold">
                                                        {((attendance.filter(a => a.status === "PRESENT").length / attendance.length) * 100).toFixed(1)}%
                                                    </DataList.ItemValue>
                                                </DataList.Item>
                                            </SimpleGrid>
                                        </DataList.Root>
                                    </Stack>
                                    <Separator borderColor="border.subtle" />
                                </>
                            )}

                            {/* result info */}
                            <Stack gap="4">
                                <Heading color="fg.subtle" size="sm">Result</Heading>
                                <DataList.Root size="sm">
                                    <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                                        <DataList.Item>
                                            <DataList.ItemLabel>CA</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.ca || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Exam Score</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.examScore || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Total Score</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.totalScore || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Grade</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">
                                                <Badge colorPalette={gradeColor(data?.grade || "")}>
                                                    {data?.grade || "N/A"}
                                                </Badge>
                                            </DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Grade Point</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.gradePoint || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Grade Point Credits</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.gradePointCredit || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                    </SimpleGrid>
                                </DataList.Root>
                            </Stack>


                            <Separator borderColor="border.subtle" />

                            {/* lecturer info */}
                            <Stack gap="4">
                                <Heading color="fg.subtle" size="sm">Lecturer</Heading>
                                <DataList.Root size="sm">
                                    <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                                        <DataList.Item>
                                            <DataList.ItemLabel>Name</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{[data?.lecturer?.title || "", data?.lecturer?.surname || "", data?.lecturer?.firstName || "", data?.lecturer?.otherName || ""].join(" ")}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Email</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.lecturer?.email || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Faculty</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.lecturer?.faculty || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                        <DataList.Item>
                                            <DataList.ItemLabel>Department</DataList.ItemLabel>
                                            <DataList.ItemValue fontWeight="bold">{data?.lecturer?.department || "N/A"}</DataList.ItemValue>
                                        </DataList.Item>
                                    </SimpleGrid>
                                </DataList.Root>
                            </Stack>
                        </Drawer.Body>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root >
    )
}





export default StatsDrawer;