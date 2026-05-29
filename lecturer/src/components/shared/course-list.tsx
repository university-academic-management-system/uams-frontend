import { Box, Text, Flex } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import type { Course } from "@type/course.type";

interface CourseListProps {
    courses: Course[];
    isLoading?: boolean;
}

const CourseList = ({ courses, isLoading }: CourseListProps) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="fg.muted" fontSize="sm">Loading courses...</Text>
            </Flex>
        );
    }

    if (courses.length === 0) {
        return (
            <Flex justify="center" py="12">
                <Text color="fg.muted" fontSize="sm">No courses found.</Text>
            </Flex>
        );
    }

    return (
        <Box bg="white" rounded="md" border="1px solid" borderColor="border.muted">
            {/* Table Header */}
            <Flex
                px="6"
                py="3"
                borderBottom="1px solid"
                borderColor="border.muted"
                bg="fg.subtle"
            >
                <Text fontSize="xs"  color="fg.muted" w="60px">S/N</Text>
                <Text fontSize="xs"  color="fg.muted" w="120px">Code</Text>
                <Text fontSize="xs"  color="fg,muted" flex="1">Course Title</Text>
                <Box w="30px" />
            </Flex>

            {/* Course Rows */}
            {courses.map((course, index) => (
                <Flex
                    key={course.id}
                    align="center"
                    px="6"
                    py="4"
                    borderBottom="1px solid"
                    borderColor="border.muted"
                    cursor="pointer"
                    onClick={() => navigate(`/courses/${course.id}`, { state: { course } })}
                >
                    <Text fontSize="xs" color="fg.muted" w="60px">{index + 1}</Text>
                    <Text fontSize="xs" color="fg.muted" w="120px">{course.code}</Text>
                    <Text fontSize="xs" color="fg.muted" flex="1">{course.title}</Text>
                    <Box w="30px" textAlign="right">
                        <ChevronRight size={14} color="fg.muted" />
                    </Box>
                </Flex>
            ))}
        </Box>
    );
};

export default CourseList;
