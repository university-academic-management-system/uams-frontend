// Dashboard.tsx
import { useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Grid,
  GridItem,
  Flex,
  Text,
  HStack,
  VStack,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTotals } from "@hooks/dashboard.hook";
import StatCard from "@components/shared/statcard";
import TimetablePanel from "@components/shared/timetable-chart";
import { useNavigate } from "react-router";
import useAuthStore from "@stores/auth.store";
import AcademicPerformanceChart from "@components/shared/academic-chart";
import { LuBookOpen, LuBuilding2, LuCalendar, LuCircleCheck, LuClock, LuFolderKanban, LuGraduationCap, LuTrendingUp } from "react-icons/lu";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [timetableFilter, setTimetableFilter] = useState<"today" | "tomorrow" | "week">("today");

  const { data: totals } = useTotals();

  const displayName = user?.name || "User";

  const assignedCourses = totals?.totalAssignedCourses ?? 0;
  const currentSession = totals?.currentSession ?? "N/A";
  const currentSemester = totals?.currentSemester ?? "N/A";
  const todayClasses = totals?.totalClassesForTheDay ?? 0;
  const projects = totals?.totalProjects ?? 0;
  const department = totals?.department ?? "N/A";
  const faculty = totals?.faculty ?? "N/A";

  const semesterLabel = currentSemester === "FIRST" ? "First Semester" 
                      : currentSemester === "SECOND" ? "Second Semester" 
                      : currentSemester;

  const statsColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 5 });

  
  const cardStyle = {
    bg: "white",
    rounded: "md",
    border: "1px solid",
    borderColor: "border.muted",
    p: 5,
    h: "100%",                  
  };

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

        {/* Top stats cards */}
        <SimpleGrid columns={statsColumns} gap={6} mb={8}>
          <StatCard label="Assigned Courses" value={assignedCourses} icon={<LuBookOpen size={22} strokeWidth={1.8} />} />
          <StatCard label="Current Session" value={currentSession} icon={<LuCalendar size={22} strokeWidth={1.8} />} />
          <StatCard label="Semester" value={semesterLabel} icon={<LuGraduationCap size={22} strokeWidth={1.8} />} />
          <StatCard label="Today's Classes" value={todayClasses} icon={<LuClock size={22} strokeWidth={1.8} />} />
          <StatCard label="Active Projects" value={projects} icon={<LuFolderKanban size={22} strokeWidth={1.8} />} />
        </SimpleGrid>

      
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
        
          <GridItem h="100%">
            <Grid templateColumns="1fr 1fr" gap={4} h="100%">
              <StatCard label="Department" value={department} icon={<LuBuilding2 size={20} />} />
              <StatCard label="Faculty" value={faculty} icon={<LuGraduationCap size={20} />} />
            </Grid>
          </GridItem>

          {/* Right column – Quick Overview, styled like a StatCard */}
          <GridItem h="100%">
            <Box {...cardStyle}>
              <Flex align="center" gap={3} mb={3}>
                <Box p={2} bg="green.50" rounded="md">
                  <LuTrendingUp size={20} color="green" />
                </Box>
                <Text fontWeight="500" color="fg.muted">Quick Overview</Text>
              </Flex>
              <VStack align="start" gap={3}>
                <HStack>
                  <Icon as={LuCircleCheck} color="green.500" boxSize={4} />
                  <Text fontSize="sm" color="fg.muted">{todayClasses} class{todayClasses !== 1 && "es"} today</Text>
                </HStack>
                <HStack>
                  <Icon as={LuFolderKanban} color="blue.500" boxSize={4} />
                  <Text fontSize="sm" color="fg.muted">{projects} active project{projects !== 1 && "s"}</Text>
                </HStack>
                <HStack>
                  <Icon as={LuCalendar} color="orange.500" boxSize={4} />
                  <Text fontSize="sm" color="fg.muted">Session: {currentSession} – {semesterLabel}</Text>
                </HStack>
                <HStack>
                  <Icon as={LuBookOpen} color="purple.500" boxSize={4} />
                  <Text fontSize="sm" color="fg.muted">{assignedCourses} course{assignedCourses !== 1 && "s"} assigned</Text>
                </HStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        {/* Academic Performance Chart */}
        <Box mb={8}>
          <AcademicPerformanceChart />
        </Box>

        {/* Timetable Panel */}
        <Box>
          <TimetablePanel
            selectedFilter={timetableFilter}
            onFilterChange={setTimetableFilter}
            onViewFullTimetable={() => navigate("/timetable")}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;