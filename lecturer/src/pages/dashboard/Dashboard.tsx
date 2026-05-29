// Dashboard.tsx
import { lazy, Suspense, useState } from "react";
import { Box, Heading, SimpleGrid, Flex, Text, Skeleton } from "@chakra-ui/react";
import {
  LuBookOpen,
  LuBuilding2,
  LuCalendar,
  LuClock,
  LuFolderKanban,
  LuGraduationCap,
} from "react-icons/lu";
import { useTotals } from "@hooks/dashboard.hook";
import { useNavigate } from "react-router";
import useAuthStore from "@stores/auth.store";

// Lazy load components
const TotalsStatCard = lazy(() => import("@components/shared/total-stat-card"));
const AcademicPerformanceChart = lazy(() => import("@components/shared/AcademicChart"));
const TimetablePanel = lazy(() => import("@components/shared/TimetablePanel"));

// Simple fallback while component loads
const CardSkeleton = () => (
  <Box bg="bg" border="xs" borderColor="border.muted" rounded="md" p="5">
    <Skeleton h="6" w="6" mb="4" />
    <Skeleton h="4" w="24" mb="2" />
    <Skeleton h="8" w="16" />
  </Box>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [timetableFilter, setTimetableFilter] = useState<"today" | "tomorrow" | "week">("today");

  const { data: totals, isLoading } = useTotals();

  const displayName = user?.name || "User";

  const semesterLabel =
    totals?.currentSemester === "FIRST"
      ? "First Semester"
      : totals?.currentSemester === "SECOND"
      ? "Second Semester"
      : totals?.currentSemester ?? "N/A";

  return (
    <Flex gap="10" h="100%" direction="column">
      <Box flex="1" minW="0">
        <Box mb="6">
          <Heading size="xl" fontWeight="700" color="fg.subtle" fontSize="24px">
            Hello{" "}
            <Text as="span" color="fg.muted" fontWeight="700">
              {displayName},
            </Text>
          </Heading>
        </Box>

        <SimpleGrid hideBelow={"md"} columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 7 }} gap={4} mb={8}>
          <Suspense fallback={<CardSkeleton />}>
            <TotalsStatCard
              label="Assigned Courses"
              icon={LuBookOpen}
              value={totals?.totalAssignedCourses ?? 0}
              isLoading={isLoading}
            />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <TotalsStatCard
              label="Current Session"
              icon={LuCalendar}
              value={totals?.currentSession ?? "N/A"}
              isLoading={isLoading}
            />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <TotalsStatCard
              label="Semester"
              icon={LuGraduationCap}
              value={semesterLabel}
              isLoading={isLoading}
            />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <TotalsStatCard
              label="Today's Classes"
              icon={LuClock}
              value={totals?.totalClassesForTheDay ?? 0}
              isLoading={isLoading}
            />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <TotalsStatCard
              label="Active Projects"
              icon={LuFolderKanban}
              value={totals?.totalProjects ?? 0}
              isLoading={isLoading}
            />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <TotalsStatCard
              label="Department"
              icon={LuBuilding2}
              value={totals?.department ?? "N/A"}
              isLoading={isLoading}
            />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <TotalsStatCard
              label="Faculty"
              icon={LuGraduationCap}
              value={totals?.faculty ?? "N/A"}
              isLoading={isLoading}
            />
          </Suspense>
        </SimpleGrid>

        <Box mb={8}>
          <Suspense fallback={<Skeleton h="300px" w="full" />}>
            <AcademicPerformanceChart />
          </Suspense>
        </Box>

        <Box>
          <Suspense fallback={<Skeleton h="400px" w="full" />}>
            <TimetablePanel
              selectedFilter={timetableFilter}
              onFilterChange={setTimetableFilter}
              onViewFullTimetable={() => navigate("/timetable")}
            />
          </Suspense>
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;