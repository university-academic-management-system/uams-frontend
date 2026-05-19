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
  Pagination,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu";
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


  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);


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
          <InputGroup startElement={<LuSearch />} width="260px" size="lg">
            <Input
              placeholder="Search by Name, Email or Mat. Num"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="lg"
            />
          </InputGroup>

          <Flex gap="3" align="center">
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
              collection={sessionCollection}
              value={[sessionFilter]}
              onValueChange={(e) => setSessionFilter(e.value[0])}
              size="lg"
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
                  {sessionCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Flex>
        </Flex>

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
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Students;