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
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
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

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
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
          <InputGroup startElement={<LuSearch />} width="260px">
            <Input
              placeholder="Search by Name, Email or Mat. Num"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fontSize="xs"
            />
          </InputGroup>

          <Flex gap="3" align="center">
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
                  {LEVEL_OPTIONS.map((opt) => (
                    <Select.Item key={opt} item={opt}>
                      {opt === "All" ? "All Levels" : opt}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>

            <Select.Root
              collection={sessionCollection}
              value={[sessionFilter]}
              onValueChange={(e) => setSessionFilter(e.value[0])}
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
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Students;