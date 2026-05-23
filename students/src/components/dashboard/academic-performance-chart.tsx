"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { Card, Heading, Stack, HStack, Flex, Skeleton } from "@chakra-ui/react"
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    Pie,
    PieChart,
    Sector,
    Label,
} from "recharts"
import type { DashboardMetric } from "@type/dashboard.type"
import { useDashboardStats } from "@hooks/dashboard.hook"
import { LuChartSpline } from "react-icons/lu"
import { EmptyStateView } from "@components/shared/empty-state"

const DonutProgress = ({ label, value, color }: { label: string; value: number; color: string }) => {
    const chart = useChart({
        data: [
            { name: label, value: value, color: color },
            { name: "Remaining", value: Math.max(0, 5 - value), color: "bg.muted" },
        ],
    })

    return (
        <Stack align="center" gap="0">
            <Chart.Root boxSize="180px" chart={chart} mx="auto">
                <PieChart responsive>
                    <Tooltip
                        cursor={false}
                        animationDuration={100}
                        content={<Chart.Tooltip hideLabel />}
                    />
                    <Pie
                        innerRadius={65}
                        outerRadius={90}
                        isAnimationActive={false}
                        data={chart.data}
                        dataKey={chart.key("value")}
                        nameKey="name"
                        startAngle={180}
                        endAngle={0}
                        paddingAngle={2}
                        shape={(props) => (
                            <Sector {...props} fill={chart.color(props.payload!.color)} />
                        )}
                    >
                        <Label
                            content={({ viewBox }) => (
                                <Chart.RadialText
                                    viewBox={viewBox}
                                    title={`${chart.getMax("value").toLocaleString()}/${chart.getTotal("value").toLocaleString()}`}
                                    description={label}
                                />
                            )}
                        />
                    </Pie>
                </PieChart>
            </Chart.Root>
        </Stack>
    )
}

export const AcademicPerformanceChart = () => {
    const { data: statsResponse, isLoading } = useDashboardStats()
    const stats = statsResponse?.data

    const gpa = stats?.gpa;
    const cgpa = stats?.cgpa;
    const sgpa = stats?.sgpa;

    const hasData = (gpa && gpa.length > 0) || (cgpa && cgpa.length > 0) || (sgpa && sgpa.length > 0);

    // mock data for testing
    const mockGpa: DashboardMetric[] = [
        { session: "2023/2024", semesters: [{ semester: "1st semester", value: 3.8 }, { semester: "2nd semester", value: 4.2 }] },
        { session: "2024/2025", semesters: [{ semester: "1st semester", value: 4.0 }, { semester: "2nd semester", value: 4.5 }] }
    ];
    const mockCgpa: DashboardMetric[] = [
        { session: "2023/2024", semesters: [{ semester: "1st semester", value: 1.8 }, { semester: "2nd semester", value: 4.0 }] },
        { session: "2024/2025", semesters: [{ semester: "1st semester", value: 2.5 }, { semester: "2nd semester", value: 4.2 }] }
    ];
    const mockSgpa: DashboardMetric[] = [
        { session: "2023/2024", semesters: [{ semester: "1st semester", value: 4.8 }, { semester: "2nd semester", value: 4.2 }] },
        { session: "2024/2025", semesters: [{ semester: "1st semester", value: 3.3 }, { semester: "2nd semester", value: 4.5 }] }
    ];

    const displayGpa = gpa && gpa.length > 0 ? gpa : mockGpa;
    const displayCgpa = cgpa && cgpa.length > 0 ? cgpa : mockCgpa;
    const displaySgpa = sgpa && sgpa.length > 0 ? sgpa : mockSgpa;

    const getLatest = (metrics: DashboardMetric[]) => {
        if (!metrics || metrics.length === 0) return 0;
        const lastSession = metrics[metrics.length - 1];
        if (!lastSession.semesters || lastSession.semesters.length === 0) return 0;
        const lastSemester = lastSession.semesters[lastSession.semesters.length - 1];
        return typeof lastSemester.value === "string" ? parseFloat(lastSemester.value) : lastSemester.value;
    };

    const latestGpa = getLatest(displayGpa);
    const latestCgpa = getLatest(displayCgpa);

    // Transform data for the chart
    const chartData = displayGpa.map((sessionData, sIndex) => {
        return sessionData.semesters.map((semesterData, semIndex) => {
            const session = sessionData.session;
            const semester = semesterData.semester;

            // Find corresponding CGPA and SGPA values
            const cgpaVal = displayCgpa[sIndex]?.semesters[semIndex]?.value;
            const sgpaVal = displaySgpa[sIndex]?.semesters[semIndex]?.value;

            return {
                label: `${session} ${semester}`,
                gpa: semesterData.value,
                cgpa: cgpaVal,
                sgpa: sgpaVal,
            };
        });
    }).flat();

    // for mobile view
    const chartDataMobile = displayGpa.map((sessionData, sIndex) => {
        return sessionData.semesters.map((semesterData, semIndex) => {
            const session = sessionData.session;

            // Find corresponding CGPA and SGPA values
            const cgpaVal = displayCgpa[sIndex]?.semesters[semIndex]?.value;
            const sgpaVal = displaySgpa[sIndex]?.semesters[semIndex]?.value;

            return {
                label: session,
                gpa: semesterData.value,
                cgpa: cgpaVal,
                sgpa: sgpaVal,
            };
        });
    }).flat();

    const chart = useChart({
        data: chartData,
        series: [
            { name: "gpa", label: "GPA", color: "accent" },
            { name: "cgpa", label: "CGPA", color: "green.500" },
            { name: "sgpa", label: "SGPA", color: "orange" },
        ],
    })

    const chartMobile = useChart({
        data: chartDataMobile,
        series: [
            { name: "gpa", label: "GPA", color: "accent" },
            { name: "cgpa", label: "CGPA", color: "green.500" },
            { name: "sgpa", label: "SGPA", color: "orange" },
        ],
    })


    if (isLoading) {
        return (
            <Card.Root width="full" border="xs" borderColor="border.muted">
                <Card.Body p="6">
                    <Stack gap="6">
                        <Skeleton h="6" w="48" />
                        <Skeleton h="300px" w="full" />
                    </Stack>
                </Card.Body>
            </Card.Root>
        )
    }

    if (!hasData) {
        return (
            <Card.Root width="full" border="xs" borderColor="border.muted">
                <Card.Body p="6">
                    <Heading size="lg" mb="6">Academic Performance</Heading>
                    <EmptyStateView
                        icon={<LuChartSpline />}
                        title="No Academic Data Available"
                        description="Your academic performance records will appear here once available."
                    />
                </Card.Body>
            </Card.Root>
        )
    }

    return (
        <Card.Root width="full" border="xs" borderColor="border.muted">
            <Card.Body p="6">
                <Heading size="lg">Academic Performance</Heading>
                <Flex gap="12" flexDir={{ base: "column", md: "row" }}>

                    {/* mobile view chart */}
                    <Chart.Root hideFrom={"md"} maxH="sm" chart={chartMobile}>
                        <LineChart margin={{ left: -30, right: 10 }} data={chart.data} responsive>
                            <CartesianGrid stroke={chart.color("border.subtle")} vertical={false} />
                            <XAxis
                                axisLine={false}
                                dataKey={chart.key("label")}
                                tickFormatter={() => ""}
                                stroke={chart.color("border")}
                                // padding={{ left: 80, right: 20 }}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                domain={[0, 5]}
                                stroke={chart.color("border")}
                                tick={{ fontSize: 11 }}
                            />
                            <Tooltip
                                animationDuration={100}
                                cursor={{ stroke: chart.color("border") }}
                                content={<Chart.Tooltip />}
                            />
                            <Legend verticalAlign="top" align="right" content={<Chart.Legend />} />
                            {chart.series.map((item) => (
                                <Line
                                    type="bump"
                                    key={item.name}
                                    isAnimationActive={false}
                                    dataKey={chart.key(item.name)}
                                    strokeWidth={2}
                                    stroke={chart.color(item.color)}
                                    dot={false}
                                    activeDot={true}
                                />
                            ))}
                        </LineChart>
                    </Chart.Root>

                    <Chart.Root hideBelow={"md"} maxH="sm" chart={chart}>
                        <LineChart margin={{ left: -30, right: 10 }} data={chart.data} responsive>
                            <CartesianGrid stroke={chart.color("border.subtle")} vertical={false} />
                            <XAxis
                                axisLine={false}
                                dataKey={chart.key("label")}
                                tickFormatter={(value) => value}
                                stroke={chart.color("border")}
                                padding={{ left: 80, right: 20 }}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                domain={[0, 5]}
                                stroke={chart.color("border")}
                                tick={{ fontSize: 11 }}
                            />
                            <Tooltip
                                animationDuration={100}
                                cursor={{ stroke: chart.color("border") }}
                                content={<Chart.Tooltip />}
                            />
                            <Legend verticalAlign="top" align="right" content={<Chart.Legend />} />
                            {chart.series.map((item) => (
                                <Line
                                    type="bump"
                                    key={item.name}
                                    isAnimationActive={false}
                                    dataKey={chart.key(item.name)}
                                    strokeWidth={2}
                                    stroke={chart.color(item.color)}
                                    dot={false}
                                    activeDot={true}
                                />
                            ))}
                        </LineChart>
                    </Chart.Root>

                    <HStack justify="space-between" align="center">
                        <Stack gap="8">
                            <DonutProgress label="CGPA" value={latestCgpa} color="green.solid" />
                            <DonutProgress label="GPA" value={latestGpa} color="blue.solid" />
                        </Stack>
                    </HStack>
                </Flex>
            </Card.Body>
        </Card.Root>
    )
}

export default AcademicPerformanceChart;

