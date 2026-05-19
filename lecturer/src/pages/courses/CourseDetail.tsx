import { useMemo } from "react";
import { Box, Flex, Text, Heading, Grid, Stack, Tabs, GridItem, Avatar } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { CourseHook } from "@hooks/course.hook";
import CourseStudentsTable from "@components/shared/CourseStudentsTable";
import CourseAttendanceTab from "@components/shared/CourseAttendanceTab";

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    // const { course } = useLocation().state;

    const { data: course, isLoading: courseLoading } = CourseHook.useCourse(courseId!);
    const { data: ownership } = CourseHook.useCheckCourseOwnership(courseId!);

    const isLecturerTeaching = ownership?.isAssigned;

    const lecturers = course?.lecturers;

    const stats = useMemo(() => {
        return [
            {
                label: "Course title",
                value: course?.title || "No title available.",
            },
            {
                label: "Course code",
                value: course?.code || "No code available.",
            },
            {
                label: "Credit unit",
                value: course?.units || "No credit unit available.",
            },
        ]
    }, [course])

    if (courseLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500">Loading course...</Text>
            </Flex>
        );
    }

    return (
        <Box>
            {/* Back Button */}
            <Flex
                align="center"
                gap="2"
                mb="4"
                cursor="pointer"
                onClick={() => navigate("/courses")}
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

            {/* Title & Description */}
            <Heading size="lg" fontWeight="600" color="#000000" mb="3" fontSize="24px">
                {course?.title} ({course?.code})
            </Heading>
            <Text fontSize="sm" color="gray.600" mb="6" maxW="700px" lineHeight="tall">
                {course?.description || "No description available."}
            </Text>



            <Tabs.Root variant={"enclosed"} defaultValue="info">
                <Tabs.List w="fit">
                    <Tabs.Trigger value="info">
                        Info
                    </Tabs.Trigger>
                    <Tabs.Trigger value="students">
                       Registered Students
                    </Tabs.Trigger>
                    {isLecturerTeaching && (
                        <Tabs.Trigger value="attendance">
                            Attendance
                        </Tabs.Trigger>
                    )}
                </Tabs.List>
                <Tabs.Content value="info">
                    <Grid templateColumns="repeat(3, 1fr)" gap="4">
                        <GridItem colSpan={2}>
                            {/* stats */}
                            <Grid templateColumns="repeat(3, 1fr)" gap="4" mb="6">
                                {stats.map((item) => (
                                    <Stack key={item.label} p="4" rounded="md" bg="bg" gap="2">
                                        <Text fontWeight="500" color="fg.subtle">{item.label}</Text>
                                        <Text fontWeight="600" color="fg.muted">{item.value}</Text>
                                    </Stack>
                                ))}
                            </Grid>

                            {/* lecturers */}
                            <Stack gap="2">
                                <Heading size="sm" color="fg.muted">Lecturers</Heading>
                                <Flex gap="2" flexWrap="wrap">
                                    {lecturers?.map((l, i) => (
                                        <Stack key={i} align="center" p="4" rounded="md" bg="bg" maxW="40">
                                            <Avatar.Root shape={"square"} rounded="md">
                                                <Avatar.Fallback rounded="md" name={l.name} />
                                                <Avatar.Image src={undefined} />
                                            </Avatar.Root>
                                            <Text w="full" textAlign="center" fontWeight="600" color="fg.muted">{l.name}</Text>
                                            <Text w="full" textWrap="break-all" fontWeight="400" color="fg.subtle">{l.email}</Text>
                                        </Stack>
                                    ))}
                                </Flex>
                            </Stack>

                            {/* attendacne chart */}
                        </GridItem>
                        <GridItem colSpan={1}>
                            {/* attendacne chart */}
                        </GridItem>
                    </Grid>

                </Tabs.Content>


                <Tabs.Content value="students">
                    <CourseStudentsTable/>
                </Tabs.Content>
                {isLecturerTeaching && (
                    <Tabs.Content value="attendance">
                        <CourseAttendanceTab/>
                    </Tabs.Content>
                )}
            </Tabs.Root>
        </Box>
    );
};

export default CourseDetail;
