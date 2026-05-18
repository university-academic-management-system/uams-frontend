import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
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
} from "@chakra-ui/react";
import { LuSearch, LuBookOpen, LuCircleAlert } from "react-icons/lu";
import { CourseHook } from "@hooks/course.hook";
import { useCurrentUser } from "@hooks/currentUser.hook";
import useAuthStore from "@stores/auth.store";
import type { CourseLevel, Semester as CourseSemester } from "@/types/course.type";

const ITEMS_PER_PAGE = 10;

// --- Static filter collections (defined outside component, like Students page) ---

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

const getSessionOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1999;
  const sessions = ["All"];
  for (let year = currentYear; year >= startYear; year--) {
    sessions.push(`${year}/${year + 1}`);
  }
  return sessions;
};

const SESSION_OPTIONS = getSessionOptions();
const sessionCollection = createListCollection({
  items: SESSION_OPTIONS.map((opt) => ({
    label: opt === "All" ? "All Sessions" : opt,
    value: opt,
  })),
});

// ---------------------------------------------------------------------------------

const Courses = () => {
  const { user } = useAuthStore();
  const currentSession = user?.currentSession || "All";
  const { isHOD } = useCurrentUser();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [semester, setSemester] = useState("All");
  const [session, setSession] = useState(currentSession);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allCourses = [], isLoading: allLoading, error: allError } = CourseHook.useAllCourses();
  const { data: assignedCourses = [], isLoading: assignedLoading, error: assignedError } = CourseHook.useAllCourses();

  const courses = isHOD ? allCourses : assignedCourses;
  const isLoading = allLoading || assignedLoading;
  const error = isHOD ? allError : assignedError;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
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
    if (session !== "All") filtered = filtered.filter((c) => c.session === session);
    return filtered;
  }, [courses, debouncedSearch, level, semester, session]);

  const totalCount = courses.length;
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

  const columns = ["Code", "Title", "Units", "Level", "Semester", "Session", "Course Type"];

  return (
    <Box>
      <Flex mb="6" gap="1" align="baseline">
        <Heading color="fg.muted" mb="1">
          Courses{" "}
        </Heading>
        <Text as="span" color="fg.subtle" lineHeight="1.5">
          ({totalCount} total)
        </Text>
      </Flex>

      <Box bg="bg" rounded="md" p="4">
        {/* Filters row */}
        <Flex align="center" justify="space-between" gap="3" mb="5" wrap="wrap" colorPalette="accent">
          <InputGroup startElement={<LuSearch />} width="260px">
            <Input
              placeholder="Search by title or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fontSize="xs"
            />
          </InputGroup>

          <Flex gap="3" align="center">
            {/* Level filter */}
            <Select.Root
              collection={levelCollection}
              value={[level]}
              onValueChange={(e) => setLevel(e.value[0])}
              size="md"
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

            {/* Semester filter */}
            <Select.Root
              collection={semesterCollection}
              value={[semester]}
              onValueChange={(e) => setSemester(e.value[0])}
              size="md"
              width="160px"
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

            {/* Session filter */}
            <Select.Root
              collection={sessionCollection}
              value={[session]}
              onValueChange={(e) => setSession(e.value[0])}
              size="md"
              width="160px"
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
                  {SESSION_OPTIONS.map((opt) => (
                    <Select.Item key={opt} item={opt}>
                      {opt === "All" ? "All Sessions" : opt}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Flex>
        </Flex>

        {/* Table */}
        <Table.ScrollArea>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                {columns.map((col) => (
                  <Table.ColumnHeader key={col}>{col}</Table.ColumnHeader>
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
                paginatedCourses.map((course) => (
                  <Table.Row key={course.id}>
                    <Table.Cell>{course.code}</Table.Cell>
                    <Table.Cell>{course.title}</Table.Cell>
                    <Table.Cell>{course.units}</Table.Cell>
                    <Table.Cell>{course.level}</Table.Cell>
                    <Table.Cell>{course.semester}</Table.Cell>
                    <Table.Cell>{course.session || "—"}</Table.Cell>
                    <Table.Cell>{course.courseType}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        {/* Pagination */}
        {filteredCourses.length > 0 && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            bg="bg"
            rounded="md"
            border="1px solid"
            borderColor="border.muted"
            p="4"
            mt="4"
            wrap="wrap"
            gap="2"
          >
            <Text fontSize="sm" color="fg.muted">
              Showing{" "}
              <Text as="span" fontWeight="semibold">
                {filteredCourses.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, filteredCourses.length)}
              </Text>{" "}
              of <Text as="span" fontWeight="semibold">{filteredCourses.length}</Text> courses
            </Text>
            <Flex alignItems="center" gap="2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || totalPages === 0}
                size="sm"
                variant="outline"
                borderColor="border.muted"
                bg="white"
                color="fg.muted"
              >
                Previous
              </Button>

              {totalPages === 0 ? (
                <Button
                  size="sm"
                  variant="solid"
                  bg="accent.500"
                  color="white"
                  minW="36px"
                >
                  1
                </Button>
              ) : (
                Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  const isActive = currentPage === pageNum;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      size="sm"
                      variant={isActive ? "solid" : "outline"}
                      bg={isActive ? "accent.500" : "white"}
                      color={isActive ? "white" : "fg.muted"}
                      borderColor={isActive ? "transparent" : "border.muted"}
                      minW="36px"
                    >
                      {pageNum}
                    </Button>
                  );
                })
              )}

              <Button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                size="sm"
                variant="outline"
                borderColor="border.muted"
                bg="white"
                color="fg.muted"
              >
                Next
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Courses;