import { TrendingUp, BarChart3, Users } from "lucide-react";
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

    return (
        <Flex direction="column" gap="8">
            <Heading size="xl" color="fg.muted">
                Welcome Back, {user?.name || "N/A"}
            </Heading>

            <StatsContainer />

            {/* Charts + Announcements Row */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="8">
                {/* Revenue Chart */}
                <Box bg="bg" p="6" borderRadius="md" border="xs" borderColor="border.muted">
                    <Flex alignItems="center" justifyContent="space-between" mb="8">
                        <Box>
                            <Flex alignItems="center" gap="2" fontWeight="bold" color="fg.muted">
                                <TrendingUp size={20} color="#22c55e" />
                                <Text>Revenue</Text>
                            </Flex>
                            <Text fontSize="xs" color="fg.subtle" mt="1">
                                Fee collection (Annual)
                            </Text>
                        </Box>
                    </Flex>
                    <Box h="300px" w="full">
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(val) => `₦${val / 1000}k`} />
                                    <Tooltip
                                        formatter={(value: number | undefined) => [`₦${(value ?? 0).toLocaleString()}`, "Revenue"]}
                                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }} />
                                </LineChart>
                            </ResponsiveContainer>
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
            <Box bg="bg" p="6" borderRadius="md" border="xs" borderColor="border.muted">
                <Flex alignItems="center" justifyContent="space-between" mb="8">
                    <Box>
                        <Text fontWeight="bold" color="fg.muted">Enrollment</Text>
                        <Text fontSize="xs" color="fg.subtle" mt="1">Student registration trends</Text>
                    </Box>
                </Flex>
                <Box h="250px" w="full">
                    {growthData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} dy={10} padding={{ left: 20, right: 20 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} />
                            </LineChart>
                        </ResponsiveContainer>
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