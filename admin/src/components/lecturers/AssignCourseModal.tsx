import { useState, useEffect, useMemo, useCallback } from "react";
import { X } from "lucide-react";
import { Box, Flex, Text, Button, Input, Dialog, Portal, Select, createListCollection, Spinner } from "@chakra-ui/react";
import { StaffHook } from "@hooks/staff.hook";
import type { Course } from "@type/course.type";
import type { Staff } from "@type/staff.type";
import { CourseServices } from "@services/course.service";
import { useQuery } from "@tanstack/react-query";
import { SystemServices } from "@services/system.service";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (data: { courseIds: string[]; session: string }) => Promise<void>;
    staffName?: string;
    assignedCourses?: {
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
    }[];
}

const AssignCourseModal = ({ isOpen, onClose, onAssign, staffName }: Props) => {
    const [courseIds, setCourseIds] = useState<string[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: staffList, isLoading: loadingStaff } = StaffHook.useStaff();


    const { data: settingsData, isLoading: loadingSettings } = useQuery({
        queryKey: ["systemSettings"],
        queryFn: () => SystemServices.getSystemSettings(),
    });

    const [session, setSession] = useState(() => settingsData?.currentSession);

    const staffs: Staff[] = useMemo(() => staffList?.data || [] as Staff[], [staffList]);
    const assignedCourseCodes = useMemo(() => staffs?.map((s) => s.staffProfile?.lecturedCourses?.filter((lc) => lc.session === session)?.map((lc) => lc.course?.code) || []).flat() || [], [staffs, session]);

    const courseCollection = useMemo(() => {
        return createListCollection({
            items: courses?.map((c: Course) => ({
                value: String(c.id),
                label: `${c.code} - ${c.title}`,
                code: c.code
            }))
        });
    }, [courses]);

    const fetchCourses = useCallback(async () => {
        try {
            setIsLoadingCourses(true);
            const response = await CourseServices.getCourses();
            const list = Array.isArray(response) ? response : (response as { data?: unknown[]; courses?: unknown[] })?.data || (response as { data?: unknown[]; courses?: unknown[] })?.courses || [];
            setCourses(list as Course[]);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        } finally {
            setIsLoadingCourses(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setCourseIds([]);
            setSession("2025/2026");
            fetchCourses();
        }
    }, [isOpen, fetchCourses]);

    const handleSubmit = useCallback(async () => {
        if (courseIds.length === 0 || !session) return;
        setIsSubmitting(true);
        try {
            await onAssign({ courseIds, session });
            onClose();
        } catch (err) {
            console.error("Failed to assign course:", err);
        } finally {
            setIsSubmitting(false);
        }
    }, [courseIds, session, onAssign, onClose]);

    if (isLoadingCourses || loadingStaff || loadingSettings) {
        return (
            <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center" closeOnInteractOutside={false}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg="white" borderRadius="md" boxShadow="none" w="full" maxW="lg" overflow="hidden">
                        <Flex p="6" alignItems="center" justifyContent="center">
                            <Spinner />
                        </Flex>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        );
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center" closeOnInteractOutside={false}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content bg="white" borderRadius="md" boxShadow="none" w="full" maxW="lg" overflow="hidden">
                    {/* Header */}
                    <Flex p="6" borderBottom="xs" borderColor="border.muted" alignItems="center" justifyContent="space-between">
                        <Text fontSize="xl" fontWeight="bold">Assign Courses To Lecturer</Text>
                        <Dialog.CloseTrigger asChild>
                            <Box as="button" onClick={onClose} p="2" _hover={{ bg: "slate.50" }} color="fg.subtle" cursor="pointer" bg="transparent" border="none">
                                <X size={20} />
                            </Box>
                        </Dialog.CloseTrigger>
                    </Flex>

                    {/* Body */}
                    <Box p="6">
                        <Flex direction="column" gap="6">
                            {staffName && (
                                <Text fontSize="sm" color="fg.muted">Assigning courses to <Text as="span" fontWeight="bold" color="fg.muted">{staffName}</Text></Text>
                            )}


                            <Box>
                                <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="2">Academic Session</Text>
                                <Input
                                    value={session}
                                    onChange={(e) => setSession(e.target.value)}
                                    placeholder="e.g. 2025/2026"
                                    borderColor="border.muted"
                                    size="lg"
                                    colorPalette="accent"
                                    borderRadius="md"
                                    minHeight="40px"
                                    fontSize="sm"
                                    readOnly
                                    disabled
                                />
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="2">Name of course</Text>
                                <Select.Root
                                    multiple
                                    collection={courseCollection}
                                    size="lg"
                                    width="full"
                                    value={courseIds}
                                    onValueChange={(details) => setCourseIds(details.value)}
                                    disabled={isLoadingCourses || !(/\d{4,}\/\d{4,}/.test(session))}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control borderColor="#E2E8F0" borderRadius="md" minHeight="40px" _hover={{ borderColor: "#CBD5E1" }}>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder={isLoadingCourses ? "Loading courses..." : "Select course(s)..."} />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner zIndex="popover">
                                            <Select.Content>
                                                {courseCollection.items.map((course) => (
                                                    <Select.Item asChild item={course} key={course.value}>
                                                        <Button variant="ghost" size="xl" disabled={assignedCourseCodes.includes(course.code)} _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                                            {course.label}
                                                            <Select.ItemIndicator />
                                                        </Button>
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                            </Box>

                        </Flex>
                    </Box>

                    {/* Footer */}
                    <Flex p="6" borderTop="xs" borderColor="border.muted" justifyContent="flex-end" gap="3">
                        <Button onClick={onClose} variant="outline" size="xl" borderColor="border.muted" color="fg.muted" borderRadius="md">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} size="xl" bg="#1D7AD9" color="white" borderRadius="md" loading={isSubmitting} disabled={courseIds.length === 0 || !(/\d{4,}\/\d{4,}/.test(session))}>
                            Assign Course
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default AssignCourseModal;

