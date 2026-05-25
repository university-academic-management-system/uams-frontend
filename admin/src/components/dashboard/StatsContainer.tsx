import { useState, useEffect } from "react";
import { Users, CreditCard, UserCog, GraduationCap, UserCheck } from "lucide-react";
import { StatCard } from "@components/dashboard/StatCard";
import { DashboardServices } from "@services/dashboard.service";
import { Box, Flex, Text, Spinner, Grid, Button } from "@chakra-ui/react";

const StatsContainer = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalActiveStudents: 0,
        totalAlumni: 0,
        totalStaffs: 0,
        totalRevenue: 0,
        isLoading: true,
        error: null as string | null,
    });

    const loadData = async () => {
        try {
            const response = await DashboardServices.getDashboardStats();
            const data = response?.data || {};
            
            setStats({
                totalStudents: data.totalStudents || 0,
                totalActiveStudents: data.totalActiveStudents || 0,
                totalAlumni: data.totalAlumni || 0,
                totalStaffs: data.totalStaffs || 0,
                totalRevenue: data.totalRevenue || 0,
                isLoading: false,
                error: null
            });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setStats((prev) => ({
                ...prev,
                isLoading: false,
                error: error.response?.data?.message || "Failed to load statistics",
            }));
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();
    }, []);

    const handleRetry = () => {
        setStats(prev => ({ ...prev, isLoading: true, error: null }));
        loadData();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (stats.isLoading) {
        return (
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(5, 1fr)" }} gap="4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Box key={i} bg="bg" p="4" borderRadius="md" border="xs" borderColor="border.muted">
                        <Flex alignItems="center" justifyContent="center" h="20">
                            <Spinner size="md" color="blue.500" />
                        </Flex>
                    </Box>
                ))}
            </Grid>
        );
    }

    if (stats.error) {
        return (
            <Box bg="red.50" border="xs" borderColor="red.200" borderRadius="md" p="4" textAlign="center">
                <Text color="red.600" fontWeight="medium">{stats.error}</Text>
                <Button
                    onClick={handleRetry}
                    mt="3"
                    px="4"
                    py="2"
                    bg="red.100"
                    color="red.700"
                    borderRadius="sm"
                    _hover={{ bg: "red.200" }}
                    transition="all 0.2s"
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    size="sm"
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(5, 1fr)" }} gap="4">
            <StatCard
                label="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={<CreditCard size={24} />}
                bgColor="bg"
                description="Aggregated collection"
            />
            <StatCard
                label="Total Students"
                value={stats.totalStudents.toLocaleString()}
                icon={<Users size={24} />}
                bgColor="bg"
                description="All registered students"
            />
            <StatCard
                label="Active Students"
                value={stats.totalActiveStudents.toLocaleString()}
                icon={<UserCheck size={24} />}
                bgColor="bg"
                description={`${stats.totalActiveStudents} students in session`}
            />
            <StatCard
                label="Alumni"
                value={stats.totalAlumni.toLocaleString()}
                icon={<GraduationCap size={24} />}
                bgColor="bg"
                description={`${stats.totalAlumni} total graduates`}
            />
            <StatCard
                label="Total Staff"
                value={stats.totalStaffs.toLocaleString()}
                icon={<UserCog size={24} />}
                bgColor="bg"
                description={`${stats.totalStaffs} total staff`}
            />
        </Grid>
    );
};

export default StatsContainer;
