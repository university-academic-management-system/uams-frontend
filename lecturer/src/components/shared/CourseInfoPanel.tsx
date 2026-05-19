import { Box, Flex, Text, Grid } from "@chakra-ui/react";
import { User } from "lucide-react";
import type { Course } from "@type/course.type";
import type { Lecturer } from "@type/project.type";
import type { AttendanceDataPoint } from "@type/dashboard.type";
import AttendanceChart from "@components/shared/AttendanceChart";
import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";

interface CourseInfoPanelProps {
    course: Course;
    lecturers: Lecturer[];
}

// Mock attendance data for the chart
const MOCK_ATTENDANCE: AttendanceDataPoint[] = [
    { courseCode: "Jan", attendance: 60 },
    { courseCode: "Feb", attendance: 80 },
    { courseCode: "Mar", attendance: 70 },
    { courseCode: "Apr", attendance: 90 },
    { courseCode: "May", attendance: 75 },
    { courseCode: "Jun", attendance: 95 },
    { courseCode: "Jul", attendance: 110 },
    { courseCode: "Aug", attendance: 85 },
    { courseCode: "Sep", attendance: 160 },
    { courseCode: "Oct", attendance: 140 },
    { courseCode: "Nov", attendance: 120 },
    { courseCode: "Dec", attendance: 100 },
];

const CourseInfoPanel = ({ course, lecturers }: CourseInfoPanelProps) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    return (
        <Box
            bg="accent.50"
            rounded="md"
            border="1px solid"
            borderColor="border.muted"
            p="8"
        >
            <Flex gap="6" direction={{ base: "column", lg: "row" }}>
                {/* Left Column: Info Cards + Lecturers */}
                <Box flex="1">
                    {/* Info Cards */}
                    <Flex gap="4" mb="6" wrap="wrap">
                        <Box
                            bg="accent.50"
                            rounded="md"
                            px="5"
                            py="4"
                            flex="1"
                            minW="130px"
                        >
                            <Text fontSize="xs" color="fg.muted" mb="1">Course Title</Text>
                            <Text fontSize="sm" color="fg.muted">
                                {course.title}
                            </Text>
                        </Box>
                        <Box
                            bg="accent.50"
                            rounded="md"
                            px="5"
                            py="4"
                            flex="1"
                            minW="110px"
                        >
                            <Text fontSize="xs" color="fg.muted" mb="1">Course Code</Text>
                            <Text fontSize="sm" color="fg.muted">
                                {course.code}
                            </Text>
                        </Box>
                        <Box
                            bg="accent.50"
                            rounded="md"
                            px="5"
                            py="4"
                            flex="1"
                            minW="100px"
                        >
                            <Text fontSize="xs" color="fg.muted" mb="1">Credit Unit</Text>
                            <Text fontSize="sm" color="fg.muted">
                                {course.units}
                            </Text>
                        </Box>
                    </Flex>

                    {/* Lecturers Section */}
                    <Box>
                        <Text fontSize="md" color="fg.muted" mb="4">
                            Lecturers
                        </Text>
                        <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap="4">
                            {lecturers.map((lec) => (
                                <Box
                                    key={lec.id}
                                    bg="accent.50"
                                    border="1px solid"
                                    borderColor="border.muted"
                                    rounded="md"
                                    p="4"
                                    textAlign="center"
                                    cursor="pointer"
                                >
                                    <Flex
                                        justify="center"
                                        align="center"
                                        w="12"
                                        h="12"
                                        mx="auto"
                                        mb="2"
                                        bg="fg.subtle"
                                        rounded="md"
                                    >
                                        <User size={20} color="fg.subtle" />
                                    </Flex>
                                    <Text fontSize="xs" color="fg.muted" mb="2">
                                        {lec.name}
                                    </Text>
                                    <Flex
                                        justify="center"
                                        align="center"
                                        bg="accent.500"
                                        color="white"
                                        fontSize="10px"
                                        rounded="md"
                                        px="3"
                                        py="1"
                                        cursor="pointer"
                                    >
                                        See Info <LuArrowRight />
                                    </Flex>
                                </Box>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                {/* Right Column: Attendance Chart */}
                <Box flex="1" minW="300px">
                    <AttendanceChart
                        data={MOCK_ATTENDANCE}
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                        onClear={() => { setFromDate(""); setToDate(""); }}
                    />
                </Box>
            </Flex>
        </Box>
    );
};

export default CourseInfoPanel;
