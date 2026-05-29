import { useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import type { ResultCourse } from "@type/result.type";

interface ResultCourseListProps {
    courses: ResultCourse[];
    isLoading?: boolean;
}

const ResultCourseList = ({ courses, isLoading }: ResultCourseListProps) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selected.size === courses.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(courses.map((c) => c.id)));
        }
    };

    if (isLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">Loading courses...</Text>
            </Flex>
        );
    }

    return (
        <Box>
            {/* Header Row */}
            <Flex align="center" px="5" py="3" borderBottom="1px solid" borderColor="gray.100">
                <input
                    type="checkbox"
                    checked={selected.size === courses.length && courses.length > 0}
                    onChange={toggleAll}
                    style={{ marginRight: "16px", cursor: "pointer" }}
                />
                <Text fontSize="xs" fontWeight="600" color="gray.600" w="100px">Code</Text>
                <Text fontSize="xs" fontWeight="600" color="gray.600" flex="1">Course Title</Text>
                <Box w="30px" />
            </Flex>

            {/* Course Rows */}
            {courses.map((course) => (
                <Flex
                    key={course.id}
                    align="center"
                    px="5"
                    py="3.5"
                    borderBottom="1px solid"
                    borderColor="gray.50"
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    transition="background 0.15s"
                    onClick={() => navigate(`/results/${course.id}`)}
                >
                    <input
                        type="checkbox"
                        checked={selected.has(course.id)}
                        onChange={() => {}}
                        onClick={(e) => toggleSelect(course.id, e)}
                        style={{ marginRight: "16px", cursor: "pointer" }}
                    />
                    <Text fontSize="xs" color="gray.700" w="100px">{course.code}</Text>
                    <Text fontSize="xs" color="gray.700" flex="1" fontWeight="500">{course.title}</Text>
                    <Box w="30px" textAlign="right">
                        <ChevronRight size={14} color="#A0AEC0" />
                    </Box>
                </Flex>
            ))}
        </Box>
    );
};

export default ResultCourseList;
