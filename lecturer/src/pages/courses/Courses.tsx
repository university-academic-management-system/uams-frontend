import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Flex,
  InputGroup,
  Input,
  Select,
  createListCollection,
  EmptyState,
  VStack,
  Table,
  Button,
  Center,
  Spinner,
  IconButton,
  Pagination,
  ButtonGroup,
  HStack,
  Menu,
  Portal,
  Badge, // ← added Badge
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
} from "react-icons/lu";
import { CourseHook } from "@hooks/course.hook";
import { useCurrentUser } from "@hooks/currentUser.hook";
import useAuthStore from "@stores/auth.store";
import type { CourseLevel, Semester as CourseSemester } from "../../types/course.type";
import { useNavigate } from "react-router";

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
  return level.replace(/^L/, "") 
};

const normalizeSemester = (semester: string) => {
  return semester.charAt(0) + semester.slice(1).toLowerCase() + " Semester";
};

// Action cell component (menu)
const CourseActionCell = ({ courseId }: { courseId: string }) => {
  const navigate = useNavigate();

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton size="sm" variant="ghost">
          <LuEllipsis />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              value="students"
              onClick={() => navigate(`/courses/${courseId}/students`)}
            >
              <LuUsers /> Students
            </Menu.Item>
            <Menu.Item
              value="results"
              onClick={() => navigate(`/courses/${courseId}/results`)}
            >
              <LuChartBar /> Results
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
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

  const { data: allCourses = [], isLoading: allLoading, error: allError } = CourseHook.useAllCourses();
  const { data: assignedCourses = [], isLoading: assignedLoading, error: assignedError } = CourseHook.useAllCourses();

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
            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan={columns.length} textAlign="center" py={10}>
                  <Center>
                    <Spinner size="lg" color="accent.500" />
                  </Center>
                </Table.Cell>
              </Table.Row>
            )}

            {!isLoading && error && (
              <Table.Row>
                <Table.Cell colSpan={columns.length} textAlign="center" py={10}>
                  <EmptyState.Root>
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <LuCircleAlert />
                      </EmptyState.Indicator>
                      <VStack textAlign="center">
                        <EmptyState.Title>Failed to load courses</EmptyState.Title>
                        <EmptyState.Description>{error.message}</EmptyState.Description>
                      </VStack>
                    </EmptyState.Content>
                  </EmptyState.Root>
                </Table.Cell>
              </Table.Row>
            )}

            {!isLoading && !error && paginatedCourses.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={columns.length} textAlign="center" py={10}>
                  <EmptyState.Root>
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <LuBookOpen />
                      </EmptyState.Indicator>
                      <VStack textAlign="center">
                        <EmptyState.Title>No courses found</EmptyState.Title>
                        <EmptyState.Description>
                          {courses.length === 0
                            ? "No courses have been created yet."
                            : "Try adjusting your search or filters."}
                        </EmptyState.Description>
                      </VStack>
                    </EmptyState.Content>
                  </EmptyState.Root>
                </Table.Cell>
              </Table.Row>
            )}

            {!isLoading && !error && paginatedCourses.length > 0 &&
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
                    <CourseActionCell courseId={course.id} />
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