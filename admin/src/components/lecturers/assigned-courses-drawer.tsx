
import { Box, Button, CloseButton, Drawer, Flex, For, Heading, Portal, Text } from "@chakra-ui/react"
import { toaster } from "@components/ui/toaster";
import { StaffHook } from "@hooks/staff.hook";
import { useCallback, useMemo } from "react";
import { LuChevronDown } from "react-icons/lu";



const AssignedCoursesDrawer = ({ lecturedCourses, staffName }: {
    lecturedCourses: {
        id: string;
        courseId: string;
        lecturerId: string;
        session: string;
        course: {
            id: string;
            code: string;
            title: string;
            description: string;
            units: number;
            level: string;
            semester: string;
            courseType: string;
            status: string;
            programmeId: string;
            isCarryoverAllowed: boolean;
            courseRepId: string | null;
            assistantCourseRepId: string | null;
            classRepId: string | null;
            assistantClassRepId: string | null;
            progressionRuleId: string | null;
            createdAt: string;
            updatedAt: string;
        }
    }[],
    staffName: string
}) => {
    const unassignCourse = StaffHook.useUnassignCourse();

    const session = useMemo(() => lecturedCourses?.[0]?.session, [lecturedCourses]);

    const handleUnassignCourse = useCallback(async (courseId: string) => {
        unassignCourse.mutate(courseId, {
            onSuccess: () => {
                toaster.success({ description: 'Course unassigned successfully' })
            }
        });
    }, [unassignCourse])

    return (
        <Drawer.Root size="md">
            <Drawer.Trigger colorPalette="gray" asChild>
                <Button variant="ghost" size="sm">
                    {lecturedCourses?.length} Course{lecturedCourses?.length > 1 ? 's' : ''} <LuChevronDown />
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Assigned Course{lecturedCourses?.length > 1 ? 's' : ''} to {staffName}</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body spaceY="4">
                            <Heading size="sm">Session: {session}</Heading>
                            <For each={lecturedCourses || []}
                                fallback={<Text>No assigned courses</Text>}>
                                {item => (
                                    <Flex justify="space-between" align="center">
                                        <Box>
                                            <Heading size="sm">{item?.course?.code}</Heading>
                                            <Text>{item?.course?.title}</Text>
                                        </Box>
                                        <Button variant="ghost" loading={unassignCourse.isPending} colorPalette="accent" onClick={() => handleUnassignCourse(item?.id)}>Unassign</Button>
                                    </Flex>
                                )}
                            </For>
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

export default AssignedCoursesDrawer;
