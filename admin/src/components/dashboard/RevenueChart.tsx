import { BarChart3 } from "lucide-react";
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

interface RevenueChartProps {
    data: ChartDataItem[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
    const revenueChart = useChart({
        data,
        series: [{ name: "value", color: "green.solid" }],
    });

    return (
        <Box bg="bg" p="4" borderRadius="md" border="xs" borderColor="border.muted">
            <Flex alignItems="center" justifyContent="space-between" mb="4">
                <Box>
                    <Flex alignItems="center" gap="2" fontWeight="bold" color="fg.muted">
                        <Text>Revenue</Text>
                    </Flex>
                    <Text fontSize="xs" color="fg.subtle" mt="1">
                        Fee collection (Annual)
                    </Text>
                </Box>
            </Flex>
            <Box h="300px" w="full">
                {data.length > 0 ? (
                    <Chart.Root h="100%" w="100%" chart={revenueChart}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueChart.data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke={revenueChart.color("border.subtle")} />
                                <XAxis 
                                    dataKey={revenueChart.key("year")} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 11, fill: "#94a3b8" }} 
                                    dy={10} 
                                    stroke={revenueChart.color("border")}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 11, fill: "#94a3b8" }} 
                                    tickFormatter={(val) => `₦${val / 1000}k`} 
                                    stroke={revenueChart.color("border")}
                                />
                                <Tooltip
                                    animationDuration={100}
                                    cursor={false}
                                    content={<Chart.Tooltip />}
                                />
                                {revenueChart.series.map((item) => (
                                    <Line 
                                        key={item.name}
                                        type="monotone" 
                                        dataKey={revenueChart.key(item.name)} 
                                        stroke={revenueChart.color(item.color)} 
                                        strokeWidth={1.5} 
                                        isAnimationActive={true}
                                        dot={false} 
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
                                    <BarChart3 />
                                </EmptyState.Indicator>
                                <EmptyState.Title>No Revenue Data</EmptyState.Title>
                                <EmptyState.Description>
                                    Revenue statistics will appear here once fee collections are recorded.
                                </EmptyState.Description>
                            </EmptyState.Content>
                        </EmptyState.Root>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default RevenueChart;
