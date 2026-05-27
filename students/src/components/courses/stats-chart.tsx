import { Chart, useChart } from "@chakra-ui/charts"
import { Box, Center, Flex, GridItem, SimpleGrid, Skeleton } from "@chakra-ui/react"
import EmptyStateView from "@components/shared/empty-state"
import { useResults } from "@hooks/course.hook"
import { useMemo } from "react"
import { LuChartBar } from "react-icons/lu"
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, Rectangle, Sector, Tooltip, XAxis, YAxis } from "recharts"


const StatsChart = ({ level, semester }: { level: "L100" | "L200" | "L300" | "L400" | "L500", semester: "FIRST" | "SECOND" }) => {
    const { data: response, isLoading } = useResults({ level, semester });

    const chartData = useMemo(() => {
        if (!response?.results) return [];
        return response.results.map((item) => ({
            score: item.totalScore || 0,
            code: item.course.code,
        }));
    }, [response]);

    const chart = useChart({
        data: chartData,
        series: [{ name: "score", color: "accent" }],
    })

    if (isLoading) {
        return (
            <Flex gap="4" direction={{ base: "column", md: "row" }}>
                <Center h="sm" flex="1" border="xs" rounded="md" borderColor="border.muted">
                    <Skeleton h="200px" w="full" mx="4" />
                </Center>
                <Center h="sm" w={{ base: "full", md: "320px" }} border="xs" rounded="md" borderColor="border.muted">
                    <Skeleton h="200px" w="200px" rounded="full" />
                </Center>
            </Flex>
        )
    }

    if (response?.results.every(item => item.grade === null)) return (
        <Box border="xs" rounded="md" p="4" borderColor="border.muted" bg="bg">
            <EmptyStateView
                icon={<LuChartBar />}
                title="No Grades Available"
                description="No grades available to display chart for this semester."
            />
        </Box>
    );

    return (
        <SimpleGrid w="full" columns={{ base: 1, md: 4 }} gap="4" border="xs" bg="bg" rounded="md" p="4" borderColor="border.muted">
            <GridItem colSpan={3}>
                <Chart.Root maxH="xl" chart={chart} >
                    <BarChart data={chart.data} responsive>
                        <CartesianGrid stroke={chart.color("border.subtle")} vertical={false} />
                        <XAxis
                            axisLine={false}
                            tickLine={false}
                            dataKey={chart.key("code")}
                            fontSize={12}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}`}
                            fontSize={12}
                        />
                        {chart.series.map((item) => (
                            <Bar
                                key={item.name}
                                isAnimationActive={false}
                                dataKey={chart.key(item.name)}
                                fill={chart.color(item.color)}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </Chart.Root>
            </GridItem>

            <GridItem spaceY="4">
                <GradeChart level={level} semester={semester} />
                <GPACGPAChart level={level} semester={semester} />
            </GridItem>
        </SimpleGrid>
    )
}




const GradeChart = ({ level, semester }: { level: string, semester: string }) => {
    const { data: response } = useResults({ level, semester });

    const gradeData = useMemo(() => {
        if (!response?.results) return [];

        const grades = ["A", "B", "C", "D", "E", "F"];
        const counts = response.results.reduce((acc, curr) => {
            const grade = curr.grade || "N/A";
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const colors: Record<string, string> = {
            "A": "green.500",
            "B": "blue",
            "C": "gray",
            "D": "yellow",
            "E": "orange",
            "F": "red",
            "N/A": "bg.muted"
        };

        return grades
            .map(grade => ({
                name: grade,
                value: counts[grade] || 0,
                color: colors[grade]
            }))
            .filter(item => item.value > 0);
    }, [response]);

    const chart = useChart({
        data: gradeData,
    })

    return (
        <Chart.Root w={{ base: "full", md: "320px" }} chart={chart} maxH="xs">
            <PieChart responsive>
                <Tooltip
                    cursor={false}
                    animationDuration={100}
                    content={<Chart.Tooltip hideLabel />}
                />
                <Pie
                    isAnimationActive={false}
                    data={chart.data}
                    dataKey={chart.key("value")}
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    shape={(props) => (
                        <Sector {...props} fill={chart.color(props.payload!.color)} />
                    )}
                >
                    <LabelList
                        dataKey="name"
                        position="inside"
                        fill="white"
                        stroke="none"
                        fontSize={12}
                    />
                </Pie>
            </PieChart>
        </Chart.Root>
    )
}


const GPACGPAChart = ({ level, semester }: { level: string, semester: string }) => {
    const { data: response } = useResults({ level, semester });
    const chart = useChart({
        data: [
            { value: response?.gpa || 0, type: "GPA", color: "blue" },
            { value: response?.cgpa || 0, type: "CGPA", color: "green.500" },
        ],
    })

    return (
        <Chart.Root maxH="xs" chart={chart}>
            <BarChart data={chart.data} responsive>
                <CartesianGrid stroke={chart.color("border.subtle")} vertical={false} />
                <XAxis axisLine={false} tickLine={false} dataKey={chart.key("type")} />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                />
                <Bar
                    isAnimationActive={false}
                    dataKey={chart.key("value")}
                    shape={(props) => (
                        <Rectangle {...props} fill={chart.color(props.payload!.color)} />
                    )}
                />
            </BarChart>
        </Chart.Root>
    )
}


export default StatsChart;
