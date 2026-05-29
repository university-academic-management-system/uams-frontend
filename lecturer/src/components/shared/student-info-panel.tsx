import { Box, Flex, Text, Grid } from "@chakra-ui/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { CourseStudent } from "@type/course.type";

interface StudentInfoPanelProps {
    student: CourseStudent;
}

const INFO_FIELDS: { label: string; key: keyof CourseStudent }[] = [
    { label: "Reg No.", key: "regNo" },
    { label: "Mat No.", key: "matNo" },
    { label: "First Name", key: "surname" },
    { label: "Last Name", key: "otherNames" },
    { label: "Sex", key: "sex" },
    { label: "Admission Mode", key: "admissionMode" },
    { label: "Entry Qualification", key: "entryQualification" },
    { label: "Department Name", key: "department" },
    { label: "Degree Course", key: "degreeCourse" },
    { label: "Faculty Name", key: "faculty" },
    { label: "Program Duration", key: "programDuration" },
    { label: "Degree Awarded", key: "degreeAwarded" },
];

const COLORS = ["#38A169", "#2D3748"];

const StudentInfoPanel = ({ student }: StudentInfoPanelProps) => {
    const attendanceData = [
        { name: "Present", value: student.attendancePresent },
        { name: "Absent", value: student.attendanceAbsent },
    ];

    return (
        <Flex gap="6" direction={{ base: "column", lg: "row" }}>
            {/* Left: Student Info Grid */}
            <Box flex="1">
                <Text fontSize="lg" fontWeight="600" color="gray.800" mb="1">
                    Student info
                </Text>
                <Grid templateColumns="1fr 1fr" gap="5" mt="4">
                    {INFO_FIELDS.map((field) => (
                        <Box key={field.key}>
                            <Text fontSize="xs" fontWeight="600" color="gray.800" mb="0.5">
                                {field.label}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                                {String(student[field.key])}
                            </Text>
                        </Box>
                    ))}
                </Grid>
            </Box>

            {/* Right: Attendance Donut Chart */}
            <Box
                bg="white"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.100"
                p="5"
                w={{ base: "100%", lg: "380px" }}
            >
                <Flex align="center" justify="space-between" mb="2">
                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                        Student Attendance
                    </Text>
                    <Flex gap="3">
                        <Flex align="center" gap="1">
                            <Box w="2" h="2" borderRadius="full" bg="#38A169" />
                            <Text fontSize="10px" color="gray.600">Present</Text>
                        </Flex>
                        <Flex align="center" gap="1">
                            <Box w="2" h="2" borderRadius="full" bg="#2D3748" />
                            <Text fontSize="10px" color="gray.600">Absent</Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Box h="280px">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={attendanceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={110}
                                paddingAngle={2}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                label={({ value }) => `${value}%`}
                                labelLine={false}
                            >
                                {attendanceData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Flex>
    );
};

export default StudentInfoPanel;
