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
  Badge,
  HStack,
  VStack,
  Icon,
  useBreakpointValue,
  Separator,
} from "@chakra-ui/react";
import {
  BookOpen,
  Calendar,
  Clock,
  FolderKanban,
  Building2,
  GraduationCap,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react";
import { DashboardHook } from "@hooks/dashboard.hook";
import StatCard from "@components/shared/StatCard";
import TimetablePanel from "@components/shared/TimetablePanel";
import { useNavigate } from "react-router";
import useAuthStore from "@stores/auth.store";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [timetableFilter, setTimetableFilter] = useState<"today" | "tomorrow" | "week">("today");

  const { data: totals } = DashboardHook.useTotals();

  const displayName = user?.name || "User";

  // Fallback values
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

  // Responsive card columns
  const statsColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 5 });

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
    

      {/* Stats Cards Grid */}
      <SimpleGrid columns={statsColumns} gap={6} mb={8}>
        <StatCard label="Assigned Courses" value={assignedCourses} icon={<BookOpen size={22} strokeWidth={1.8} />} />
        <StatCard label="Current Session" value={currentSession} icon={<Calendar size={22} strokeWidth={1.8} />} />
        <StatCard label="Semester" value={semesterLabel} icon={<GraduationCap size={22} strokeWidth={1.8} />} />
        <StatCard label="Today's Classes" value={todayClasses} icon={<Clock size={22} strokeWidth={1.8} />} />
        <StatCard label="Active Projects" value={projects} icon={<FolderKanban size={22} strokeWidth={1.8} />} />
      </SimpleGrid>

      {/* Two‑column section: Department/Faculty card + Recent Activity card */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
        <GridItem>
          <Box bg="white" p={5} rounded="md" border="1px solid" borderColor="border.muted" h="100%">
            <Flex align="center" mb={3}>
              <Box p={2} rounded="md">
                <Building2 size={20} color="blue" />
              </Box>
              <Text fontWeight="500" color="fg.muted">Your Department</Text>
            </Flex>
            <Text fontSize="xl" fontWeight="500" color="gray.800">{department}</Text>
            <Separator my={3} />
            <Flex align="center" gap={3}>
              <Box p={2} rounded="md">
                <GraduationCap size={20} color="blue" />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">Faculty</Text>
                <Text fontWeight="medium" color="gray.700">{faculty}</Text>
              </Box>
            </Flex>
          </Box>
        </GridItem>
        <GridItem>
          <Box bg="white" p={5} rounded="md" border="1px solid" borderColor="border.muted" h="100%">
            <Flex align="center" gap={3} mb={3}>
              <Box p={2} bg="green.50" rounded="md">
                <TrendingUp size={20} color="green" />
              </Box>
              <Text fontWeight="500" color="fg.muted">Quick Overview</Text>
            </Flex>
            <VStack align="start" gap={3}>
              <HStack>
                <Icon as={CheckCircle} color="green.500" boxSize={4} />
                <Text fontSize="sm" color="fg.muted">{todayClasses} class{todayClasses !== 1 && "es"} today</Text>
              </HStack>
              <HStack>
                <Icon as={FolderKanban} color="blue.500" boxSize={4} />
                <Text fontSize="sm" color="fg,muted">{projects} active project{projects !== 1 && "s"}</Text>
              </HStack>
              <HStack>
                <Icon as={Calendar} color="orange.500" boxSize={4} />
                <Text fontSize="sm" color="fg.muted">Session: {currentSession} – {semesterLabel}</Text>
              </HStack>
              <HStack>
                <Icon as={BookOpen} color="purple.500" boxSize={4} />
                <Text fontSize="sm" color="fg.muted">{assignedCourses} course{assignedCourses !== 1 && "s"} assigned</Text>
              </HStack>
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      {/* Timetable Panel */}
        <Box px={5} pb={5} bg="white">
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