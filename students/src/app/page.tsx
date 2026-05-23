"use client"

import { lazy, Suspense } from "react"
import { Box, Heading, Highlight, SimpleGrid, Skeleton } from "@chakra-ui/react"
import useAuthStore from "@stores/auth.store"
import { useDashboardStats } from "@hooks/dashboard.hook"
import {
    LuCalendar,
    LuBookOpen,
    LuBuilding,
    LuGraduationCap,
    LuCircleCheck,
    LuCircleAlert
} from "react-icons/lu"

// Lazy load components
const DashboardStatCard = lazy(() => import("@components/dashboard/dashboard-stat-card"))
const AcademicPerformanceChart = lazy(() => import("@components/dashboard/academic-performance-chart"))
const TimetableComp = lazy(() => import("@components/dashboard/timetable"))

const DashboardPage = () => {
    const { user } = useAuthStore();
    const { data: statsResponse } = useDashboardStats();
    const stats = statsResponse?.data;

    return (
        <Box as="main" spaceY="4">
            <Heading color="fg.subtle" size="2xl">
                <Highlight query={user?.name || ""} styles={{ color: "fg", fontWeight: "bold" }}>
                    {`Hello, ${user?.name || ""}`}
                </Highlight>
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 6 }} gap="4">
                <Suspense fallback={<Skeleton h="140px" rounded="md" />}>
                    <DashboardStatCard
                        label="Current Session"
                        value={stats?.currentSession || "N/A"}
                        icon={LuCalendar}
                        description={`Semester: ${stats?.currentSemester || "N/A"}`}
                    />
                </Suspense>
                <Suspense fallback={<Skeleton h="140px" rounded="md" />}>
                    <DashboardStatCard
                        label="Academic Level"
                        value={stats?.level?.replace("L", "") || "N/A"}
                        icon={LuGraduationCap}
                        description={stats?.department || "N/A"}
                    />
                </Suspense>
                <Suspense fallback={<Skeleton h="140px" rounded="md" />}>
                    <DashboardStatCard
                        label="Courses"
                        value={`${stats?.totalCoursesRegistered || 0} / ${stats?.totalCoursesToBeRegistered || 0}`}
                        icon={LuBookOpen}
                        description="Registered / Required"
                        color={stats?.totalCoursesRegistered === stats?.totalCoursesToBeRegistered ? "green.500" : "orange.500"}
                    />
                </Suspense>
                <Suspense fallback={<Skeleton h="140px" rounded="md" />}>
                    <DashboardStatCard
                        label="Standing"
                        value={stats?.academicStanding?.replace("_", " ") || "N/A"}
                        icon={stats?.academicStanding === "GOOD_STANDING" ? LuCircleCheck : LuCircleAlert}
                        description={`Carryovers: ${stats?.carryoverCourses || 0}`}
                        color={stats?.academicStanding === "GOOD_STANDING" ? "green.500" : "red.500"}
                    />
                </Suspense>
                <Suspense fallback={<Skeleton h="140px" rounded="md" />}>
                    <DashboardStatCard
                        label="Faculty"
                        value={stats?.faculty || "N/A"}
                        icon={LuBuilding}
                    />
                </Suspense>
                <Suspense fallback={<Skeleton h="140px" rounded="md" />}>
                    <DashboardStatCard
                        label="Department"
                        value={stats?.department || "N/A"}
                        icon={LuBuilding}
                    />
                </Suspense>
            </SimpleGrid>


            <Suspense fallback={<Skeleton h="400px" rounded="md" />}>
                {stats && (
                    <AcademicPerformanceChart
                        gpa={stats.gpa}
                        cgpa={stats.cgpa}
                        sgpa={stats.sgpa}
                    />
                )}
            </Suspense>

            {/* time table */}
            <Suspense fallback={<Skeleton h="400px" rounded="md" />}>
                <TimetableComp />
            </Suspense>
        </Box>
    )
}

export default DashboardPage;
