import { useState } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { CourseHook } from "@hooks/course.hook";
import StudentInfoPanel from "@components/shared/student-info-panel";

const CourseStudentDetail = () => {
    const { courseId, studentId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"info" | "students">("info");

    const { data: student } = CourseHook.useCourseStudent(courseId!, studentId!);

    if (!student) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500">Loading student...</Text>
            </Flex>
        );
    }

    return (
        <Box>
            {/* Back Button — pill style */}
            <Flex
                align="center"
                gap="2"
                mb="4"
                cursor="pointer"
                onClick={() => navigate(`/courses/${courseId}`)}
                w="fit-content"
                px="4"
                py="1.5"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                bg="white"
                boxShadow="sm"
                _hover={{ bg: "gray.50" }}
                transition="background 0.15s"
            >
                <ArrowLeft size={14} />
                <Text fontSize="xs" fontWeight="500">Back</Text>
            </Flex>

            {/* Tabs — bordered toggle style */}
            <Flex mb="6">
                <Flex
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    overflow="hidden"
                    bg="gray.100"
                    p="1"
                    gap="1"
                >
                    <Box
                        px="5"
                        py="2"
                        fontSize="sm"
                        fontWeight={activeTab === "info" ? "600" : "500"}
                        color={activeTab === "info" ? "gray.800" : "gray.500"}
                        bg={activeTab === "info" ? "white" : "transparent"}
                        borderRadius={activeTab === "info" ? "lg" : "none"}
                        boxShadow={activeTab === "info" ? "sm" : "none"}
                        cursor="pointer"
                        onClick={() => setActiveTab("info")}
                        transition="all 0.15s"
                    >
                        Info
                    </Box>
                    <Box
                        px="5"
                        py="2"
                        fontSize="sm"
                        fontWeight={activeTab === "students" ? "600" : "500"}
                        color={activeTab === "students" ? "gray.800" : "gray.500"}
                        bg={activeTab === "students" ? "white" : "transparent"}
                        borderRadius={activeTab === "students" ? "lg" : "none"}
                        boxShadow={activeTab === "students" ? "sm" : "none"}
                        cursor="pointer"
                        onClick={() => setActiveTab("students")}
                        transition="all 0.15s"
                    >
                        Students
                    </Box>
                </Flex>
            </Flex>

            {/* White Card wrapper */}
            <Box
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                p="8"
            >
                {/* Student Header */}
                <Heading size="lg" fontWeight="600" color="#000000" mb="0.5" fontSize="24px">
                    {student.surname} {student.otherNames.split(" ")[0]}
                </Heading>
                <Text fontSize="sm" color="gray.500" mb="6">
                    {student.matNo}
                </Text>

                {/* Student Info */}
                <StudentInfoPanel student={student} />
            </Box>
        </Box>
    );
};

export default CourseStudentDetail;

