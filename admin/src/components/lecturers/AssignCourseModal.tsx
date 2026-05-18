import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CourseServices } from "@services/course.service";
import Select from "react-select";
import { Box, Flex, Text, Button, Input, Dialog } from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (data: { courseId: string; session: string }) => Promise<void>;
    staffName?: string;
}

interface CourseOption {
    value: string;
    label: string;
}

const AssignCourseModal = ({ isOpen, onClose, onAssign, staffName }: Props) => {
    const [courseId, setCourseId] = useState("");
    const [session, setSession] = useState("2025/2026");
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const courseOptions: CourseOption[] = courses.map((c: any) => ({
        value: c.id,
        label: `${c.code} - ${c.title || c.name}`,
    }));

    useEffect(() => {
        if (isOpen) {
            setCourseId("");
            setSession("2025/2026");
            fetchCourses();
        }
    }, [isOpen]);

    const fetchCourses = async () => {
        try {
            setIsLoadingCourses(true);
            const response = await CourseServices.getCourses();
            const list = Array.isArray(response) ? response : (response as any)?.data || (response as any)?.courses || [];
            setCourses(list);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const handleSubmit = async () => {
        if (!courseId || !session) return;
        setIsSubmitting(true);
        try {
            await onAssign({ courseId, session });
            onClose();
        } catch (err) {
            console.error("Failed to assign course:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center" closeOnInteractOutside={false}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content bg="white" borderRadius="md" boxShadow="none" w="full" maxW="lg" overflow="hidden" colorPalette="accent">
                    {/* Header */}
                    <Flex p="6" borderBottom="xs" borderColor="border.muted" alignItems="center" justifyContent="space-between">
                        <Text fontSize="xl" fontWeight="bold" color="#1D7AD9">Assign Course To Lecturer</Text>
                        <Dialog.CloseTrigger asChild>
                            <Box as="button" onClick={onClose} p="2" _hover={{ bg: "slate.50" }} borderRadius="full" color="fg.subtle" cursor="pointer" bg="transparent" border="none">
                                <X size={20} />
                            </Box>
                        </Dialog.CloseTrigger>
                    </Flex>

                    {/* Body */}
                    <Box p="6">
                        <Flex direction="column" gap="6">
                            {staffName && (
                                <Text fontSize="sm" color="fg.muted">Assigning course to <Text as="span" fontWeight="bold" color="fg.muted">{staffName}</Text></Text>
                            )}

                            <Box>
                                <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="2">Name of course</Text>
                                <Select
                                    options={courseOptions}
                                    value={courseOptions.find((c) => c.value === courseId)}
                                    onChange={(selected) => setCourseId(selected?.value || "")}
                                    isLoading={isLoadingCourses}
                                    placeholder="Select a course..."
                                    styles={{
                                        control: (base) => ({
                                        ...base,
                                        backgroundColor: "#F8FAFC",
                                        borderColor: "#E2E8F0",
                                        borderRadius: "6px",
                                        minHeight: "40px",
                                        boxShadow: "none",
                                        "&:hover": { borderColor: "#CBD5E1" },
                                        }),
                                    }}
                                />
                            </Box>

                            <Box>
                                <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="2">Academic Session</Text>
                                <Input
                                    value={session}
                                    onChange={(e) => setSession(e.target.value)}
                                    placeholder="e.g. 2025/2026"
                                    bg="#F8FAFC"
                                    borderColor="#E2E8F0"
                                    borderRadius="md"
                                    minHeight="40px"
                                    fontSize="sm"
                                />
                            </Box>
                        </Flex>
                    </Box>

                    {/* Footer */}
                    <Flex p="6" borderTop="xs" borderColor="border.muted" justifyContent="flex-end" gap="3">
                        <Button onClick={onClose} variant="outline" borderColor="border.muted" color="fg.muted" borderRadius="md">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} bg="#1D7AD9" color="white" borderRadius="md" loading={isSubmitting} disabled={!courseId}>
                            Assign Course
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default AssignCourseModal;
