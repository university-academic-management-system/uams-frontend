import { useState, useMemo, useEffect, useRef, useCallback, memo } from "react";
import {
  Box,
  Flex,
  InputGroup,
  Input,
  Select,
  createListCollection,
  Table,
  IconButton,
  Pagination,
  ButtonGroup,
  Menu,
  Portal,
  Badge,
  Drawer,
  CloseButton,
  Skeleton,
  Button,
  Dialog,
  Field,
  Stack,
  Text,
  Grid,
  useDisclosure,
  DataList,
  FileUpload,
} from "@chakra-ui/react";
import {
  LuSearch,
  LuBookOpen,
  LuCircleAlert,
  LuChevronLeft,
  LuChevronRight,
  LuUsers,
  LuEllipsis,
  LuChartBar,
  LuDownload,
  LuUpload,
  LuFileText,
  LuCalendarDays,
  LuFileDown,
  LuFileUp,
} from "react-icons/lu";
import { useAllCourses } from "@hooks/course.hook";
import { useCurrentUser } from "@hooks/currentUser.hook";
import useAuthStore from "@stores/auth.store";
import type { Course, CourseLevel, Semester as CourseSemester } from "../../types/course.type";
import CourseStudentsTable from "@components/shared/CourseStudentsTable";
import CourseResultsView from "@components/shared/CourseResultsView";
import EmptyStateView from "@components/shared/empty-state";
import { ResultHook } from "@hooks/result.hook";
import { toaster } from "@components/ui/toaster";
import axiosClient from "@configs/axios.config";
import AttendanceDrawer from "@components/shared/attendance-drawer";
import moment from "moment";
import { useTotals } from "@hooks/dashboard.hook";
import { sleep } from "@utils/sleep.util";
import { useSearchParams } from "react-router";

const ITEMS_PER_PAGE = 10;

const COURSE_LEVELS: CourseLevel[] = ["L100", "L200", "L300", "L400"];
const levelCollection = createListCollection({
  items: [
    { label: "All Levels", value: "All" },
    ...COURSE_LEVELS.map((l) => ({
      label: l.replace(/^L/, "") + " Level",
      value: l,
    })),
  ],
});

const COURSE_SEMESTERS: CourseSemester[] = ["FIRST", "SECOND", "THIRD"];
const semesterCollection = createListCollection({
  items: [
    { label: "All Semesters", value: "All" },
    ...COURSE_SEMESTERS.map((s) => ({
      label: s.charAt(0) + s.slice(1).toLowerCase() + " Semester",
      value: s,
    })),
  ],
});

const generateSessionOptions = (): string[] => {
  const currentYear = moment().year();
  const startYear = 1999;
  const sessions: string[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    sessions.push(`${year}/${year + 1}`);
  }
  return sessions;
};

const sessionCollection = createListCollection({
  items: generateSessionOptions().map((session) => ({
    label: session,
    value: session,
  })),
});

const normalizeLevel = (level: string) => {
  return level.replace(/^L/, "");
};

const normalizeSemester = (semester: string) => {
  return semester.charAt(0) + semester.slice(1).toLowerCase() + " Semester";
};


// ─── Upload Results Dialog (fully functional) ────────────────────────────────
const GlobalUploadDialog = ({
  isOpen,
  onClose,
  courses,
}: {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
}) => {
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sessionOptions = useMemo(() => generateSessionOptions(), []);

  const sessionCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "Select session", value: "" },
          ...sessionOptions.map((s) => ({ label: s, value: s })),
        ],
      }),
    [sessionOptions]
  );

  const filteredCourses = useMemo(() => {
    return courses;
  }, [courses]);

  const courseCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "Select a course", value: "" },
          ...filteredCourses.map((c) => ({ label: `${c.code} – ${c.title}`, value: c.id })),
        ],
      }),
    [filteredCourses]
  );

  useEffect(() => {
    sleep(0).then(() => setSelectedCourseId(""));
  }, []);

  const { mutate: upload, isPending } = ResultHook.useUploadDraft({
    onSuccess: (data) => { // FIX: accept the data argument
      console.log("Upload success:", data);
      toaster.success({ title: "Upload successful", description: "Results have been uploaded." });
      onClose();
      setSelectedSession("");
      setSelectedCourseId("");
      setSelectedFile(null);
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!selectedSession || !selectedCourseId || !selectedFile) {
      toaster.warning({
        title: "Missing data",
        description: "Please fill all fields and select a file.",
      });
      return;
    }

    upload({
      courseId: selectedCourseId,
      session: selectedSession,
      file: selectedFile,
    });
  };

  const templateUrl = "/lecturer/result-template.xlsx";
  const downloadTemplate = () => {
    const a = document.createElement('a');
    a.href = templateUrl;
    a.download = 'result-template.xlsx';
    a.click();
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Upload Results</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="5">
                <Flex justify="flex-end">
                  <Button size="sm" colorPalette="accent" onClick={downloadTemplate}>
                    <LuDownload /> Download Template
                  </Button>
                </Flex>

                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="4">
                  <Field.Root>
                    <Field.Label>Session</Field.Label>
                    <Select.Root
                      collection={sessionCollection}
                      value={[selectedSession]}
                      onValueChange={(e) => setSelectedSession(e.value[0])}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {sessionCollection.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Course</Field.Label>
                    <Select.Root
                      collection={courseCollection}
                      value={[selectedCourseId]}
                      onValueChange={(e) => setSelectedCourseId(e.value[0])}
                      disabled={filteredCourses.length === 0}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select a course" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {courseCollection.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Field.Root>
                </Grid>

                <Field.Root>
                  <Field.Label>Upload Filled Template</Field.Label>
                  <Button
                    variant="outline"
                    justifyContent="center"
                    width="full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Text color="accent.500" display="flex" alignItems="center" gap={2}>
                      <LuFileText /> Select File
                    </Text>
                  </Button>
                  {selectedFile && (
                    <Text fontSize="sm" color="fg.muted" mt={2}>
                      {selectedFile.name}
                    </Text>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".xlsx, .xls"
                    onChange={handleFileSelect}
                  />
                </Field.Root>

                <Text fontSize="xs" color="fg.muted">
                  Ensure the file follows the template format.
                </Text>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button colorPalette="blue" onClick={handleSubmit} loading={isPending}>
                <LuUpload /> Upload
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

// ─── Action Cell (Result Approvals only for ERO) ────────────────────────────
const CourseActionCell = memo(({ course, courseId, courseTitle }: { course: Course; courseId: string; courseTitle: string }) => {
  const { user } = useAuthStore();
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const attendanceDisclosure = useDisclosure();
  const uploadFinalResultsDisclosure = useDisclosure();

  const downloadDraftResult = useCallback(async () => {
    const key = course?.resultUpload?.draftFile?.key;
    if (!key) {
      toaster.error({
        title: "Download Failed",
        description: "No draft file key found for this course.",
      });
      return;
    }

    const toastId = toaster.create({
      title: "Downloading...",
      description: "Fetching the draft file from storage.",
      type: "info",
    });

    try {
      const response = await axiosClient.get(`/storage/stream/${encodeURIComponent(key)}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      let filename = key.split("/").pop() || "draft-result.xlsx";
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toaster.dismiss(toastId);
      toaster.success({
        title: "Success",
        description: "Draft result downloaded successfully.",
      });
    } catch (error) {
      toaster.dismiss(toastId);
      console.error("Failed to download draft result:", error);
    }
  }, [course]);

  const isERO = user?.role?.toUpperCase() === "ERO" || user?.roles?.some((r:string) => r.toUpperCase() === "ERO");

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton size="sm" variant="ghost">
            <LuEllipsis />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="students" onClick={() => setIsStudentsOpen(true)}>
                <LuUsers /> Students
              </Menu.Item>
              <Menu.Item value="attendance" onClick={() => attendanceDisclosure.setOpen(true)}>
                <LuCalendarDays /> Attendance
              </Menu.Item>
              <Menu.Item value="results" onClick={() => setIsResultsOpen(true)}>
                <LuChartBar /> Results
              </Menu.Item>
              {isERO && (
                <>
                  {course?.resultUpload?.draftFile && <Menu.Item value="download-draft-result" onClick={downloadDraftResult}>
                    <LuFileDown /> Downlaod draft result
                  </Menu.Item>}
                  {!course?.resultUpload?.finalFile && (<Menu.Item
                    value="upload-final-result"
                    onClick={uploadFinalResultsDisclosure.onOpen}>
                    <LuFileUp /> Upload final result
                  </Menu.Item>)}
                </>
              )}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <Drawer.Root size="xl" open={isStudentsOpen} onOpenChange={(e) => setIsStudentsOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="bg">
              <Drawer.Header>
                <Drawer.Title>{courseTitle}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <CourseStudentsTable courseId={courseId} />
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <Drawer.Root size="full" open={isResultsOpen} onOpenChange={(e) => setIsResultsOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="bg">
              <Drawer.Header>
                <Drawer.Title>Course Results Details: {courseTitle}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <CourseResultsView courseId={courseId} course={course} />
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <AttendanceDrawer course={course} setOpen={attendanceDisclosure.setOpen} open={attendanceDisclosure.open} />
      <UploadFinalResultsDialog course={course} open={uploadFinalResultsDisclosure.open} setOpen={uploadFinalResultsDisclosure.setOpen} />
    </>
  );
});

const UploadFinalResultsDialog = ({ course, open, setOpen }: { course: Course; open: boolean; setOpen: (open: boolean) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const { mutate: uploadFinal, isPending } = ResultHook.useUploadFinal();
  const [sp] = useSearchParams();

  const handleUpload = useCallback(() => {
    const uploadId = course?.resultUpload?.id;
    if (!file) {
      toaster.error({
        title: "Upload Failed",
        description: "Please select an Excel file to upload.",
      });
      return;
    }

    uploadFinal(
      { resultUploadId: uploadId || "", file, session: sp.get("session") || "", courseId: course.id },
      {
        onSuccess: () => {
          toaster.success({
            title: "Success",
            description: "Final result uploaded and queued for processing successfully.",
          });
          setFile(null);
          setOpen(false);
        },
      }
    );
  }, [course, file, uploadFinal, setOpen,sp]);

  return (
    <Dialog.Root placement={"center"} open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Upload Final Results</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <DataList.Root>
                <DataList.Item>
                  <DataList.ItemLabel>Course</DataList.ItemLabel>
                  <DataList.ItemValue>{course?.title} - {course?.code}</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>Session</DataList.ItemLabel>
                  <DataList.ItemValue>{sp.get("session")}</DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <FileUpload.Root
                w="full"
                mt="6"
                maxFiles={1}
                accept={[
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "application/vnd.ms-excel",
                ]}
                onFileAccept={(details) => {
                  setFile(details.files[0] || null);
                }}
              >
                <FileUpload.HiddenInput />
                <FileUpload.Trigger asChild>
                  <Button variant="outline" size="sm" w="full">
                    <LuUpload /> Select final result Excel file
                  </Button>
                </FileUpload.Trigger>
                <FileUpload.List showSize clearable />
              </FileUpload.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" disabled={isPending}>Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={handleUpload}
                disabled={isPending || !file}
                loading={isPending}
                loadingText="Submitting..."
              >
                Submit
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
const CoursesSkeleton = () => {
  return (
    <Box p="4" bg="bg" rounded="md">
      <Flex align="center" justify="space-between" gap="3" mb="5" wrap="wrap">
        <Skeleton h="10" w={{ base: "100%", sm: "300px" }} rounded="md" />
        <Flex gap="3" align="center" wrap="wrap">
          <Skeleton h="10" w="140px" rounded="md" />
          <Skeleton h="10" w="180px" rounded="md" />
          <Skeleton h="10" w="130px" rounded="md" />
        </Flex>
      </Flex>
      <Table.ScrollArea>
        <Table.Root size="lg" variant="outline" stickyHeader>
          <Table.Header>
            <Table.Row>
              {["S/N", "Code", "Title", "Units", "Level", "Semester", "Course Type", "Actions"].map((col) => (
                <Table.ColumnHeader key={col} bg="bg.muted">
                  <Skeleton h="4" w="20" />
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Array.from({ length: 5 }).map((_, i) => (
              <Table.Row key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <Table.Cell key={j}>
                    <Skeleton h="4" w={j === 2 ? "32" : "16"} />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <Flex justify="flex-end" mt={4}>
        <Skeleton h="8" w="40" rounded="md" />
      </Flex>
    </Box>
  );
};

// ─── Main Courses Component ─────────────────────────────────────────────────
const Courses = () => {
  const { isHOD, isERO } = useCurrentUser();
  const [sp, setSp] = useSearchParams();
  const { data: settings } = useTotals();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [level, setLevel] = useState(() => {
    return sp.get("level") || "All"
  });
  const [semester, setSemester] = useState(() => {
    return sp.get("semester") || "All"
  });
  const [session, setSession] = useState(() => {
    return sp.get("session") || settings?.currentSession || ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    if (settings?.currentSession) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession((prev:string) => prev || settings.currentSession)
      setSp({ session: settings.currentSession });
    }
  }, [settings?.currentSession,setSp]);

  useEffect(() => {
    sleep(0).then(() => {
      if (session) {
        setSp({ session });
      }
    })
  }, [session]);

  useEffect(() => {
    sleep(0).then(() => {
      if (level) {
        setSp({ level });
      }
    })
  }, [level]);

  useEffect(() => {
    sleep(0).then(() => {
      if (semester) {
        setSp({ semester });
      }
    })
  }, [semester]);

  const queryParams = useMemo(() => ({
    level: level !== "All" ? level : undefined,
    semester: semester !== "All" ? semester : undefined,
    session: session || undefined,
  }), [level, semester, session]);

  const { data: allCourses, isLoading: allLoading, error: allError } = useAllCourses(queryParams);
  const { data: assignedCourses, isLoading: assignedLoading, error: assignedError } = useAllCourses(queryParams);

  const courses = useMemo(() => {
    if (isHOD || isERO) {
      return allCourses ?? [];
    }
    return assignedCourses ?? [];
  }, [isHOD, isERO, allCourses, assignedCourses]);

  const isLoading = allLoading || assignedLoading;
  const error = isHOD ? allError : assignedError;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    sleep(0).then(() => setCurrentPage(1));
  }, [debouncedSearch, level, semester, session]);

  const filteredCourses = useMemo(() => {
    let filtered = courses;
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
    }
    if (level !== "All") filtered = filtered.filter((c) => c.level === level);
    if (semester !== "All") filtered = filtered.filter((c) => c.semester === semester);
    return filtered;
  }, [courses, debouncedSearch, level, semester]);

  // const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const columns = ["S/N", "Code", "Title", "Units", "Level", "Semester", "Course Type", "Actions"];

  if (isLoading) {
    return <CoursesSkeleton />;
  }

  return (
    <Box p="4" bg="bg" rounded="md">
      <Flex align="center" justify="space-between" gap="3" mb="5" wrap="wrap" colorPalette="accent">
        <InputGroup startElement={<LuSearch />} width={{ base: "100%", sm: "300px" }}>
          <Input
            placeholder="Search by title or code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
          />
        </InputGroup>

        <Flex gap="3" align="center" wrap="wrap">

          <Select.Root
            collection={sessionCollection}
            value={[session]}
            onValueChange={(e) => setSession(e.value[0])}
            size="lg"
            width="180px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="All Sessions" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {sessionCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          <Select.Root
            collection={levelCollection}
            value={[level]}
            onValueChange={(e) => setLevel(e.value[0])}
            size="lg"
            width="140px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="All Levels" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {levelCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          <Select.Root
            collection={semesterCollection}
            value={[semester]}
            onValueChange={(e) => setSemester(e.value[0])}
            size="lg"
            width="180px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="All Semesters" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {semesterCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          <Button size="lg" colorPalette="blue" onClick={() => setUploadDialogOpen(true)}>
            <LuUpload /> Upload Results
          </Button>
        </Flex>
      </Flex>

      <Table.ScrollArea>
        <Table.Root size="lg" variant="outline" stickyHeader>
          <Table.Header>
            <Table.Row>
              {columns.map((col) => (
                <Table.ColumnHeader bg="bg.muted" key={col}>
                  {col}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {error && (
              <Table.Row>
                <Table.Cell colSpan={columns.length} textAlign="center" py={10}>
                  <EmptyStateView
                    icon={<LuCircleAlert />}
                    title="Failed to load courses"
                    description={error.message}
                  />
                </Table.Cell>
              </Table.Row>
            )}

            {!error && filteredCourses.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={columns.length} textAlign="center" py={10}>
                  <EmptyStateView
                    icon={<LuBookOpen />}
                    title="No courses found"
                    description={
                      courses.length === 0
                        ? "No courses have been created yet."
                        : "Try adjusting your search or filters."
                    }
                  />
                </Table.Cell>
              </Table.Row>
            )}

            {!error && filteredCourses.length > 0 &&
              paginatedCourses?.map((course, idx) => (
                <Table.Row key={course.id}>
                  <Table.Cell>{startIndex + idx + 1}</Table.Cell>
                  <Table.Cell>{course.code}</Table.Cell>
                  <Table.Cell>{course.title}</Table.Cell>
                  <Table.Cell>{course.units}</Table.Cell>
                  <Table.Cell>{normalizeLevel(course.level)}</Table.Cell>
                  <Table.Cell>{normalizeSemester(course.semester)}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette="gray">{course.courseType}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <CourseActionCell
                      course={course}
                      courseId={course.id}
                      courseTitle={`${course.title} (${course.code})`}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {filteredCourses?.length > ITEMS_PER_PAGE && (
        <Flex justify="flex-end" mt={4}>
          <Pagination.Root
            count={filteredCourses.length}
            pageSize={ITEMS_PER_PAGE}
            page={currentPage}
            onPageChange={(e) => setCurrentPage(e.page)}
          >
            <ButtonGroup variant="ghost" size="sm" gap="1">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                    {page.value}
                  </IconButton>
                )}
              />
              <Pagination.NextTrigger asChild>
                <IconButton>
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Flex>
      )}

      <GlobalUploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        courses={filteredCourses}
      />
    </Box>
  );
};

export default Courses;





