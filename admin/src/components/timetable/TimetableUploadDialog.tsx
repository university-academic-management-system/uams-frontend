import { useCallback, useMemo, useState } from "react";
import {
    Box,
    Button,
    CloseButton,
    createListCollection,
    Dialog,
    DownloadTrigger,
    Field,
    FileUpload,
    Flex,
    Input,
    Menu,
    Portal,
    Select,
} from "@chakra-ui/react";
import { LuFileUp } from "react-icons/lu";
import { TimetableHook } from "@hooks/timetable.hook";
import { TimetableService } from "@services/timetable.service";
import { toaster } from "@components/ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import { Download, FileSpreadsheet, UploadCloud } from "lucide-react";
import SingleTimetableEntryDialog from "./SingleTimetableEntryDialog";

const TimetableUploadDialog = () => {
    const { mutate: uploadTimetable, isPending } =
        TimetableHook.useUploadTimetable();
    const [file, setFile] = useState<File | null>(null);
    const [selectedSession, setSelectedSession] = useState<string | null>(
        null
    );
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(
        null
    );
    const [title, setTitle] = useState<string | null>(null);
    const qc = useQueryClient();

    const handleSessionChange = useCallback((value: string | null) => {
        setSelectedSession(value);
    }, []);

    const handleLevelChange = useCallback((value: string | null) => {
        setSelectedLevel(value);
    }, []);

    const handleSemesterChange = useCallback((value: string | null) => {
        setSelectedSemester(value);
    }, []);

    const isValid = useMemo(() => {
        return (
            selectedSession &&
            selectedLevel &&
            selectedSemester &&
            file &&
            title
        );
    }, [
        selectedSession,
        selectedLevel,
        selectedSemester,
        file,
        title,
    ]);

    const handleUpload = useCallback(async () => {
        if (!isValid || !file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("session", selectedSession || "");
        formData.append("semester", selectedSemester || "");
        formData.append("level", selectedLevel || "");
        formData.append("title", title || "");

        uploadTimetable(formData, {
            onSuccess() {
                toaster.success({
                    description: "Timetable uploaded successfully",
                });
                qc.invalidateQueries({ queryKey: ["timetables"] });
            },
            onError() {
                // Error toast handled by axios interceptor
            },
        });
    }, [
        file,
        uploadTimetable,
        isValid,
        qc,
        selectedSession,
        selectedSemester,
        selectedLevel,
        title,
    ]);

    const handleDownloadTemplateFile = useCallback(async () => {
        const response = await TimetableService.downloadTimetableTemplate();
        return response;
    }, []);

    const sessions = useMemo(
        () =>
            createListCollection({
                items: [
                    { label: "2024/2025", value: "2024/2025" },
                    { label: "2025/2026", value: "2025/2026" },
                ],
            }),
        []
    );

    const levels = useMemo(
        () =>
            createListCollection({
                items: [
                    { label: "100", value: "L100" },
                    { label: "200", value: "L200" },
                    { label: "300", value: "L300" },
                    { label: "400", value: "L400" },
                    { label: "500", value: "L500" },
                ],
            }),
        []
    );

    const semesters = useMemo(
        () =>
            createListCollection({
                items: [
                    { label: "1st Semester", value: "FIRST" },
                    { label: "2nd Semester", value: "SECOND" },
                ],
            }),
        []
    );

    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button
                    size="xl"
                    colorPalette="accent"
                    display="flex"
                    alignItems="center"
                    gap="2"
                    cursor="pointer"
                    boxShadow="none"
                >
                    <UploadCloud /> Upload Timetable
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content
                        bg="white"
                        boxShadow="xl"
                        borderRadius="md"
                        border="xs"
                        borderColor="border.muted"
                        minW="180px"
                    >
                        <SingleTimetableEntryDialog />
                        <Dialog.Root
                            size="xl"
                            placement="center"
                            closeOnInteractOutside={false}
                        >
                            <Dialog.Trigger asChild>
                                <Menu.Item
                                    value="bulk"
                                    closeOnSelect={false}
                                    cursor="pointer"
                                    py="3"
                                    px="4"
                                    _hover={{ bg: "slate.50" }}
                                >
                                    <LuFileUp size={18} />
                                    <Box flex="1" ml="2">
                                        Bulk Upload (Excel)
                                    </Box>
                                </Menu.Item>
                            </Dialog.Trigger>
                            <Portal>
                                <Dialog.Backdrop />
                                <Dialog.Positioner>
                                    <Dialog.Content colorPalette="accent">
                                        <Dialog.Header>
                                            <Dialog.Title>Upload Timetable</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body spaceY="4">
                            <DownloadTrigger
                                data={() => handleDownloadTemplateFile()}
                                fileName={`timetable-template.xlsx`}
                                mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                asChild
                            >
                                <Button color="#2563eb" variant="outline" size="lg">
                                    <Download /> Download Sample File
                                </Button>
                            </DownloadTrigger>

                            <Box
                                spaceY="4"
                                rounded="md"
                                p="4"
                                border="xs"
                                borderColor="border"
                            >
                                <Field.Root>
                                    <Field.Label>Title</Field.Label>
                                    <Input
                                        size="xl"
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        placeholder="Enter a brief title here"
                                    />
                                </Field.Root>

                                <Flex gap="4" w="full">
                                    {/* sessions */}
                                    <Select.Root
                                        value={selectedSession ? [selectedSession] : []}
                                        onValueChange={(e) =>
                                            handleSessionChange(e.value[0])
                                        }
                                        collection={sessions}
                                        size="lg"
                                        flex="1"
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger
                                                bg="white"
                                                border="xs"
                                                borderColor="border.muted"
                                            >
                                                <Select.ValueText placeholder="Select session" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {sessions.items.length ===
                                                    0 ? (
                                                        <Box
                                                            px="4"
                                                            py="3"
                                                            textAlign="center"
                                                            color="fg.muted"
                                                            fontSize="sm"
                                                        >
                                                            No options available
                                                        </Box>
                                                    ) : (
                                                        sessions.items.map(
                                                            (session: {
                                                                label: string;
                                                                value: string;
                                                            }) => (
                                                                <Select.Item
                                                                    item={
                                                                        session
                                                                    }
                                                                    key={
                                                                        session.value
                                                                    }
                                                                >
                                                                    <Select.ItemText>{session.label}</Select.ItemText>
                                                                    <Select.ItemIndicator />
                                                                </Select.Item>
                                                            )
                                                        )
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>

                                    {/* level */}
                                    <Select.Root
                                        value={selectedLevel ? [selectedLevel] : []}
                                        onValueChange={(e) =>
                                            handleLevelChange(e.value[0])
                                        }
                                        collection={levels}
                                        size="lg"
                                        flex="1"
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger
                                                bg="white"
                                                border="xs"
                                                borderColor="border.muted"
                                            >
                                                <Select.ValueText placeholder="Select level" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {levels.items.length ===
                                                    0 ? (
                                                        <Box
                                                            px="4"
                                                            py="3"
                                                            textAlign="center"
                                                            color="fg.muted"
                                                            fontSize="sm"
                                                        >
                                                            No options available
                                                        </Box>
                                                    ) : (
                                                        levels.items.map(
                                                            (level: {
                                                                label: string;
                                                                value: string;
                                                            }) => (
                                                                <Select.Item
                                                                    item={
                                                                        level
                                                                    }
                                                                    key={
                                                                        level.value
                                                                    }
                                                                >
                                                                    <Select.ItemText>{level.label}</Select.ItemText>
                                                                    <Select.ItemIndicator />
                                                                </Select.Item>
                                                            )
                                                        )
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>

                                    {/* semesters */}
                                    <Select.Root
                                        value={selectedSemester ? [selectedSemester] : []}
                                        onValueChange={(e) =>
                                            handleSemesterChange(e.value[0])
                                        }
                                        collection={semesters}
                                        size="lg"
                                        flex="1"
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger
                                                bg="white"
                                                border="xs"
                                                borderColor="border.muted"
                                            >
                                                <Select.ValueText placeholder="Select semester" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {semesters.items.length ===
                                                    0 ? (
                                                        <Box
                                                            px="4"
                                                            py="3"
                                                            textAlign="center"
                                                            color="fg.muted"
                                                            fontSize="sm"
                                                        >
                                                            No options available
                                                        </Box>
                                                    ) : (
                                                        semesters.items.map(
                                                            (semester: {
                                                                label: string;
                                                                value: string;
                                                            }) => (
                                                                <Select.Item
                                                                    item={
                                                                        semester
                                                                    }
                                                                    key={
                                                                        semester.value
                                                                    }
                                                                >
                                                                    <Select.ItemText>{semester.label}</Select.ItemText>
                                                                    <Select.ItemIndicator />
                                                                </Select.Item>
                                                            )
                                                        )
                                                    )}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                </Flex>

                                <FileUpload.Root
                                    onFileAccept={async (file) => {
                                        setFile(file.files[0]);
                                    }}
                                >
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Button
                                            w="full"
                                            variant="outline"
                                            justifyContent="start"
                                            size="xl"
                                        >
                                            <FileSpreadsheet /> Select file
                                        </Button>
                                    </FileUpload.Trigger>
                                    <FileUpload.List showSize clearable />
                                </FileUpload.Root>
                            </Box>
                        </Dialog.Body>
                        <Dialog.Footer w="sm" justifyContent="start">
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" size="xl" colorPalette="gray">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                size="xl"
                                flex="1"
                                onClick={handleUpload}
                                disabled={isPending || !isValid}
                                loading={isPending}
                                loadingText="Uploading..."
                            >
                                Upload
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="xl" colorPalette="gray"/>
                        </Dialog.CloseTrigger>
                                    </Dialog.Content>
                                </Dialog.Positioner>
                            </Portal>
                        </Dialog.Root>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

export default TimetableUploadDialog;
