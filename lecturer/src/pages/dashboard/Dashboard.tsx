import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
} from "@chakra-ui/react";
import { CourseHook } from "@hooks/course.hook";
import StatCard from "@components/shared/StatCard";
import TimetablePanel from "@components/shared/TimetablePanel";
import { useNavigate } from "react-router";
import useAuthStore from "@stores/auth.store";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [timetableFilter, setTimetableFilter] = useState<"today" | "tomorrow" | "week">("today");

  const { data: allCourses = [], isLoading: isCoursesLoading, error: coursesError } =
    CourseHook.useAllCourses();

  // Role check for showing Total Students stat card
  const role = user?.role;
  const isEligible = role === "HOD" || role === "ERO";

  const currentSession = user?.currentSession ?? "N/A";
  const currentSemester = user?.currentSemester ?? "N/A";
  const displayName = user?.name || "User";

  const totalCourses = isCoursesLoading ? 0 : coursesError ? 0 : allCourses.length;

  // Placeholder – replace with real endpoint when available
  const totalStudents = 0; // TODO: fetch from /students/total

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

        {/* Four stat cards */}
        <Flex gap="5" mb="5" wrap="wrap">
          <StatCard label="Total Courses" value={totalCourses} />
          <StatCard label="Current Session" value={currentSession} />
          <StatCard label="Current Semester" value={currentSemester} />
          <StatCard label="Ongoing Projects" value={0} />
        </Flex>

        {/* Fifth stat card – full width, only for HOD/ERO */}
        {isEligible && (
          <Box mb="8" width="100%">
            <StatCard label="Total Students" value={totalStudents} />
          </Box>
        )}

        {/* Timetable section */}
        <Box
          mb="6"
          p="5"
          bg="white"
          borderRadius="lg"
          border="1px solid"
          borderColor="border.muted"
        >

          <Box maxH="300px" overflowY="auto">
            <TimetablePanel
              selectedFilter={timetableFilter}
              onFilterChange={setTimetableFilter}
              onViewFullTimetable={() => navigate("/timetable")}
            />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;