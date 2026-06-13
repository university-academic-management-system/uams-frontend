import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Flex,
  InputGroup,
  Input,
  Select,
  createListCollection,
  VStack,
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
  LuClipboardCheck,
} from "react-icons/lu";
import { useAllCourses } from "@hooks/course.hook";
import { useCurrentUser } from "@hooks/currentUser.hook";
import useAuthStore from "@stores/auth.store";
import type { Course, CourseLevel, Semester as CourseSemester } from "../../types/course.type";
import CourseStudentsTable from "@components/shared/CourseStudentsTable";
import CourseResultsView from "@components/shared/CourseResultsView";
import EmptyStateView from "@components/shared/empty-state";
import { HODResultsDrawer } from "@components/shared/HODResultsDrawer";

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

const normalizeLevel = (level: string) => {
  return level.replace(/^L/, "");
};

const normalizeSemester = (semester: string) => {
  return semester.charAt(0) + semester.slice(1).toLowerCase() + " Semester";
};

// Action cell component with three drawers
const CourseActionCell = ({ course, courseId, courseTitle }: { course: Course; courseId: string; courseTitle: string }) => {
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isHODResultsOpen, setIsHODResultsOpen] = useState(false);

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
              <Menu.Item value="results" onClick={() => setIsResultsOpen(true)}>
                <LuChartBar /> Results
              </Menu.Item>
              <Menu.Item value="hod-results" onClick={() => setIsHODResultsOpen(true)}>
                <LuClipboardCheck /> Result Approvals
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {/* Students Drawer */}
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

      {/* Results Drawer */}
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

      {/* HOD Result Approvals Drawer */}
      <HODResultsDrawer
        course={course}
        isOpen={isHODResultsOpen}
        onClose={() => setIsHODResultsOpen(false)}
      />
    </>
  );
};

// Skeleton component
const CoursesSkeleton = () => {
  return (
    <Box p="4" bg="bg" rounded="md">
      <Flex align="center" justify="space-between" gap="3" mb="5" wrap="wrap">
        <Skeleton h="10" w={{ base: "100%", sm: "300px" }} rounded="md" />
        <Flex gap="3" align="center" wrap="wrap">
          <Skeleton h="10" w="140px" rounded="md" />
          <Skeleton h="10" w="180px" rounded="md" />
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

const Courses = () => {
  const { user } = useAuthStore();
  const { isHOD } = useCurrentUser();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [semester, setSemester] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allCourses = [], isLoading: allLoading, error: allError } = useAllCourses();
  const { data: assignedCourses = [], isLoading: assignedLoading, error: assignedError } = useAllCourses();

  const courses = isHOD ? allCourses : assignedCourses;
  const isLoading = allLoading || assignedLoading;
  const error = isHOD ? allError : assignedError;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, level, semester]);

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

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const columns = ["S/N", "Code", "Title", "Units", "Level", "Semester", "Course Type", "Actions"];

  if (isLoading) {
    return <CoursesSkeleton />;
  }

  return (
    <Box p="4" bg="bg" rounded="md">
      {/* Filters row */}
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
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Flex>
      </Flex>

      {/* Table */}
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
              paginatedCourses.map((course, idx) => (
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
                    <CourseActionCell course={course} courseId={course.id} courseTitle={`${course.title} (${course.code})`} />
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Pagination */}
      {filteredCourses.length > ITEMS_PER_PAGE && (
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
    </Box>
  );
};

export default Courses;