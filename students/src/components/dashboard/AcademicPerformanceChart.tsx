"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { Card, Heading, Stack } from "@chakra-ui/react"
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import type { DashboardMetric } from "@type/dashboard.type"

interface AcademicPerformanceChartProps {
    gpa: DashboardMetric[];
    cgpa: DashboardMetric[];
    sgpa: DashboardMetric[];
}

export const AcademicPerformanceChart = ({ gpa, cgpa, sgpa }: AcademicPerformanceChartProps) => {
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

    const chart = useChart({
        data: chartData,
        series: [
            { name: "gpa", label: "GPA", color: "accent" },
            { name: "cgpa", label: "CGPA", color: "green.500" },
            { name: "sgpa", label: "SGPA", color: "orange" },
        ],
    })

    return (
        <Card.Root width="full" border="xs" borderColor="border.muted">
            <Card.Body p="6">
                <Stack gap="6">
                    <Heading size="md" fontWeight="bold">Academic Performance</Heading>
                    <Chart.Root maxH="sm" chart={chart}>
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
                </Stack>
            </Card.Body>
        </Card.Root>
    )
}

export default AcademicPerformanceChart;
