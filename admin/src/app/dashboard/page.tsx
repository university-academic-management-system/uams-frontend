import { BarChart3, Users } from "lucide-react";
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
import { AnnouncementList } from "@components/dashboard/AnnouncementList";
import StatsContainer from "@components/dashboard/StatsContainer";
import useAuthStore from "@stores/auth.store";
import { DashboardHook } from "@hooks/dashboard.hook";
import { Box, EmptyState, Flex, Grid, Heading, Text } from "@chakra-ui/react";

const DashboardPage = () => {
    const { user } = useAuthStore();
    const { data: revenueData = [] } = DashboardHook.useRevenueStats();
    const { data: growthData = [] } = DashboardHook.useEnrollmentGrowth();
    const { data: announcements = [] } = DashboardHook.useAnnouncements();

    const revenueChart = useChart({
        data: revenueData,
        series: [{ name: "value", color: "green.solid" }],
    });

    const enrollmentChart = useChart({
        data: growthData,
        series: [{ name: "value", color: "blue.solid" }],
    });

    return (
        <Flex direction="column" gap="4">
            <Heading size="xl" color="fg.muted">
                <Text as="span" color="fg.subtle" fontWeight="medium">Welcome Back, </Text>
                {user?.name || "N/A"}
            </Heading>

            <StatsContainer />

            {/* Charts + Announcements Row */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="4">
                {/* Revenue Chart */}
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
                        {revenueData.length > 0 ? (
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

                {/* Announcements */}
                <AnnouncementList announcements={announcements} />
            </Grid>

            {/* Enrollment Growth */}
            <Box bg="bg" p="4" borderRadius="md" border="xs" borderColor="border.muted">
                <Flex alignItems="center" justifyContent="space-between" mb="4">
                    <Box>
                        <Text fontWeight="bold" color="fg.muted">Enrollment</Text>
                        <Text fontSize="xs" color="fg.subtle" mt="1">Student registration trends</Text>
                    </Box>
                </Flex>
                <Box h="250px" w="full">
                    {growthData.length > 0 ? (
                        <Chart.Root h="100%" w="100%" chart={enrollmentChart}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={enrollmentChart.data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                    <CartesianGrid vertical={false} stroke={enrollmentChart.color("border.subtle")} />
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
        </Flex>
    );
};


export default DashboardPage;