"use client"

import { lazy, Suspense } from "react"
import { Box, Heading, Highlight, SimpleGrid } from "@chakra-ui/react"
import useAuthStore from "@stores/auth.store"
import {
    LuCalendar,
    LuBookOpen,
    LuBuilding,
    LuGraduationCap,
    LuCircleCheck
} from "react-icons/lu"

// Lazy load components
const DashboardStatCard = lazy(() => import("@components/dashboard/dashboard-stat-card"))
const AcademicPerformanceChart = lazy(() => import("@components/dashboard/academic-performance-chart"))
const TimetableComp = lazy(() => import("@components/dashboard/timetable"))

const DashboardPage = () => {
    const { user } = useAuthStore();

    return (
        <Box as="main" spaceY="4">
            <Heading color="fg.subtle" size="2xl">
                <Highlight query={user?.name || ""} styles={{ color: "fg", fontWeight: "bold" }}>
                    {`Hello, ${user?.name || ""}`}
                </Highlight>
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 6 }} gap="4">
                <Suspense>
                    <DashboardStatCard
                        label="Current Session"
                        value={(stats) => stats?.currentSession || "N/A"}
                        icon={LuCalendar}
                        description={(stats) => `Semester: ${stats?.currentSemester || "N/A"}`}
                    />
                </Suspense>
                <Suspense>
                    <DashboardStatCard
                        label="Academic Level"
                        value={(stats) => stats?.level?.replace("L", "") || "N/A"}
                        icon={LuGraduationCap}
                        description={(stats) => stats?.department || "N/A"}
                    />
                </Suspense>
                <Suspense>
                    <DashboardStatCard
                        label="Courses"
                        value={(stats) => `${stats?.totalCoursesRegistered || 0} / ${stats?.totalCoursesToBeRegistered || 0}`}
                        icon={LuBookOpen}
                        description={() => "Registered / Required"}
                    />
                </Suspense>
                <Suspense>
                    <DashboardStatCard
                        label="Standing"
                        value={(stats) => stats?.academicStanding?.replace("_", " ") || "N/A"}
                        icon={LuCircleCheck}
                        description={(stats) => `Carryovers: ${stats?.carryoverCourses || 0}`}
                    />
                </Suspense>
                <Suspense>
                    <DashboardStatCard
                        label="Faculty"
                        value={(stats) => stats?.faculty || "N/A"}
                        icon={LuBuilding}
                    />
                </Suspense>
                <Suspense>
                    <DashboardStatCard
                        label="Department"
                        value={(stats) => stats?.department || "N/A"}
                        icon={LuBuilding}
                    />
                </Suspense>
            </SimpleGrid>


            <Suspense>
                <AcademicPerformanceChart />
            </Suspense>

            <Suspense>
                <TimetableComp />
            </Suspense>
        </Box>
    )
}

export default DashboardPage;
