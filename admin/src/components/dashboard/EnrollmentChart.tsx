import { Users } from "lucide-react";
import { Chart, useChart } from "@chakra-ui/charts";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Box, EmptyState, Flex, Text } from "@chakra-ui/react";
import type { ChartDataItem } from "@type/common.type";

interface EnrollmentChartProps {
    data: ChartDataItem[];
}

const EnrollmentChart = ({ data }: EnrollmentChartProps) => {
    const enrollmentChart = useChart({
        data,
        series: [{ name: "value", color: "blue.solid" }],
    });

    return (
        <Box bg="bg" p="4" borderRadius="md" border="xs" borderColor="border.muted">
            <Flex alignItems="center" justifyContent="space-between" mb="4">
                <Box>
                    <Text fontWeight="bold" color="fg.muted">Enrollment</Text>
                    <Text fontSize="xs" color="fg.subtle" mt="1">Student registration trends</Text>
                </Box>
            </Flex>
            <Box h="250px" w="full">
                {data.length > 0 ? (
                    <Chart.Root h="100%" w="100%" chart={enrollmentChart}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={enrollmentChart.data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke={enrollmentChart.color("gray.200")} />
                                <XAxis 
                                    dataKey={enrollmentChart.key("year")} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 11, fill: "#94a3b8" }} 
                                    dy={10} 
                                    padding={{ left: 20, right: 20 }} 
                                    stroke={enrollmentChart.color("border")}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 11, fill: "#94a3b8" }} 
                                    allowDecimals={false} 
                                    stroke={enrollmentChart.color("border")}
                                />
                                <Tooltip
                                    animationDuration={100}
                                    cursor={false}
                                    content={<Chart.Tooltip />}
                                />
                                {enrollmentChart.series.map((item) => (
                                    <Line 
                                        key={item.name}
                                        type="monotone" 
                                        dataKey={enrollmentChart.key(item.name)} 
                                        stroke={enrollmentChart.color(item.color)} 
                                        strokeWidth={2.5} 
                                        isAnimationActive={true}
                                        dot={{ r: 4, fill: enrollmentChart.color(item.color), strokeWidth: 2, stroke: "#fff" }} 
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </Chart.Root>
                ) : (
                    <Flex h="full" alignItems="center" justifyContent="center">
                        <EmptyState.Root>
                            <EmptyState.Content>
                                <EmptyState.Indicator>
                                    <Users />
                                </EmptyState.Indicator>
                                <EmptyState.Title>No Enrollment Data</EmptyState.Title>
                                <EmptyState.Description>
                                    Student registration trends will appear here once enrollments are recorded.
                                </EmptyState.Description>
                            </EmptyState.Content>
                        </EmptyState.Root>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default EnrollmentChart;
