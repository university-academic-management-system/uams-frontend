import { lazy, Suspense } from "react";
import useAuthStore from "@stores/auth.store";
import { DashboardHook } from "@hooks/dashboard.hook";
import { Flex, Grid, Heading, Highlight } from "@chakra-ui/react";


const RevenueChart = lazy(() => import("@components/dashboard/RevenueChart"));
const EnrollmentChart = lazy(() => import("@components/dashboard/EnrollmentChart"));
const StatsContainer = lazy(() => import("@components/dashboard/StatsContainer"));
const AnnouncementList = lazy(() => import("@components/dashboard/AnnouncementList"));

const DashboardPage = () => {
    const { user } = useAuthStore();
    const { data: revenueData = [] } = DashboardHook.useRevenueStats();
    const { data: growthData = [] } = DashboardHook.useEnrollmentGrowth();
    const { data: announcements = [] } = DashboardHook.useAnnouncements();

    return (
        <Flex direction="column" gap="4">
            <Heading color="fg.subtle" size={{ base: "xl", md: "2xl" }}>
                <Highlight query={user?.name || ""} styles={{ color: "fg", fontWeight: "bold" }}>
                    {`Welcome Back, ${user?.name || ""}`}
                </Highlight>
            </Heading>

            <Suspense>
                <StatsContainer />
            </Suspense>

            {/* Charts + Announcements Row */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="4">
                {/* Revenue Chart */}
                <Suspense>
                    <RevenueChart data={revenueData} />
                </Suspense>

                {/* Announcements */}
                <Suspense>
                    <AnnouncementList announcements={announcements} />
                </Suspense>
            </Grid>

            {/* Enrollment Growth */}
            <Suspense>
                <EnrollmentChart data={growthData} />
            </Suspense>
        </Flex>
    );
};


export default DashboardPage;