import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  InputGroup,
  Select,
  Button,
  createListCollection,
<<<<<<< HEAD
  Pagination,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu";
=======
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4
import type { Student } from "@type/student.type";
import { STUDENT_LEVELS } from "@type/student.type";
import { StudentHook } from "@hooks/student.hook";
import StudentsTable from "@components/shared/StudentsTable";

const LEVEL_OPTIONS = ["All", ...STUDENT_LEVELS];
const ITEMS_PER_PAGE = 10;

const levelCollection = createListCollection({
  items: LEVEL_OPTIONS.map((opt) => ({
    label: opt === "All" ? "All Levels" : opt,
    value: opt,
  })),
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

const Students = () => {
  const { data: students = [], isLoading, error } = StudentHook.useStudents();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, level, sessionFilter]);

  const filteredStudents = useMemo(() => {
    if (!students.length) return [];
    return students.filter((student: Student) => {
      const levelName = student.studentProfile?.level || "";
      const matchesLevel = level === "All" || levelName === level;
      const sessionName = student.studentProfile?.currentSession || "";
      const matchesSession = sessionFilter === "All" || sessionName === sessionFilter;
      const fullName = `${student.studentProfile?.firstName || ""} ${student.studentProfile?.lastName || ""} ${student.studentProfile?.otherName || ""}`.toLowerCase();
      const matchesSearch =
        !debouncedSearch ||
        fullName.includes(debouncedSearch.toLowerCase()) ||
        student.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        student.studentProfile?.matricNumber?.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesLevel && matchesSession && matchesSearch;
    });
  }, [students, level, sessionFilter, debouncedSearch]);
<<<<<<< HEAD

=======
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

<<<<<<< HEAD

=======
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, level, sessionFilter]);

  return (
    <Box>
      <Flex mb="6" gap="1" align="baseline">
        <Heading color="fg.muted" mb="1">
          Students{" "}
        </Heading>
        <Text as="span" color="fg.subtle" lineHeight="1.5">
          ({filteredStudents.length} total)
        </Text>
      </Flex>

      <Box bg="bg" rounded="md" p="4">
        <Flex align="center" justify="space-between" gap="3" mb="5" wrap="wrap" colorPalette="accent">
<<<<<<< HEAD
          <InputGroup startElement={<LuSearch />} width="260px" size="lg">
=======
          <InputGroup startElement={<LuSearch />} width="260px">
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4
            <Input
              placeholder="Search by Name, Email or Mat. Num"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
<<<<<<< HEAD
              size="lg"
=======
              fontSize="xs"
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4
            />
          </InputGroup>

          <Flex gap="3" align="center">
            <Select.Root
              collection={levelCollection}
              value={[level]}
              onValueChange={(e) => setLevel(e.value[0])}
<<<<<<< HEAD
              size="lg"
=======
              size="md"
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4
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
<<<<<<< HEAD
                  {levelCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
=======
                  {LEVEL_OPTIONS.map((opt) => (
                    <Select.Item key={opt} item={opt}>
                      {opt === "All" ? "All Levels" : opt}
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>

            <Select.Root
              collection={sessionCollection}
              value={[sessionFilter]}
              onValueChange={(e) => setSessionFilter(e.value[0])}
<<<<<<< HEAD
              size="lg"
=======
              size="md"
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4
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
<<<<<<< HEAD
                  {sessionCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
=======
                  {SESSION_OPTIONS.map((opt) => (
                    <Select.Item key={opt} item={opt}>
                      {opt === "All" ? "All Sessions" : opt}
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Flex>
        </Flex>

<<<<<<< HEAD
        <StudentsTable
          students={paginatedStudents}
          isLoading={isLoading}
          error={error}
        />

        {filteredStudents.length >= 20 && (
          <Flex
            alignItems="center"
            justifyContent="flex-end"
            mt="4"
          >

            <Pagination.Root
              count={filteredStudents.length}
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
                  render={(page) => {
                    return (
                      <IconButton
                        variant={{ base: "ghost", _selected: "outline" }}
                      >
                        {page.value}
                      </IconButton>
                    );
                  }}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton>
                    <LuChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
=======
      
        <StudentsTable 
          students={paginatedStudents} 
          isLoading={isLoading} 
          error={error} 
        />

        {filteredStudents.length > 0 && (
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
                {filteredStudents.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, filteredStudents.length)}
              </Text>{" "}
              of <Text as="span" fontWeight="semibold">{filteredStudents.length}</Text> students
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
>>>>>>> 3a7a3705d69314048601013ec2698c1171c7afb4
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Students;