import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  InputGroup,
  Select,
  createListCollection,
  Pagination,
  IconButton,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { LuSearch, LuChevronLeft, LuChevronRight, LuDownload } from "react-icons/lu";
import type { Student } from "@type/student.type";
import { STUDENT_LEVELS } from "@type/student.type";
import { StudentHook } from "@hooks/student.hook";
import StudentsTable from "@components/shared/StudentsTable";
import { exportToExcel } from "@utils/excel.util";
import { toaster } from "@components/ui/toaster";
import useAuthStore from "@stores/auth.store";

const LEVEL_OPTIONS = ["All", ...STUDENT_LEVELS];
const ITEMS_PER_PAGE = 10;

const levelCollection = createListCollection({
  items: LEVEL_OPTIONS.map((opt) => ({
    label: opt === "All" ? "All Levels" : opt.replace(/^L/, ""),
    value: opt,
  })),
});

// Dynamic session generation moved inside the component

const Students = () => {
  const { user } = useAuthStore();

  const sessionCollection = useMemo(() => {
    let currentYear = new Date().getFullYear();
    if (user?.currentSession) {
      const yearStr = user.currentSession.split("/")[0];
      const parsedYear = parseInt(yearStr, 10);
      if (!isNaN(parsedYear)) {
        currentYear = parsedYear;
      }
    }
    const startYear = 1999;
    const sessions = ["All"];
    for (let year = currentYear; year >= startYear; year--) {
      sessions.push(`${year}/${year + 1}`);
    }
    return createListCollection({
      items: sessions.map((opt) => ({
        label: opt === "All" ? "All Sessions" : opt,
        value: opt,
      })),
    });
  }, [user?.currentSession]);

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

  // Export handler
  const handleExport = () => {
    const exportData = filteredStudents.map((s) => ({
      "Full Name": `${s.studentProfile?.firstName || ""} ${s.studentProfile?.lastName || ""} ${s.studentProfile?.otherName || ""}`.trim(),
      "Email": s.email,
      "Matric Number": s.studentProfile?.matricNumber || "—",
      "Registration Number": s.studentProfile?.registrationNo || "—",
      "Phone": s.studentProfile?.phone || "—",
      "Level": s.studentProfile?.level || "—",
      "Admission Year": s.studentProfile?.admissionYear || "—",
      "Admission Session": s.studentProfile?.admissionSession || "—",
      "Current Session": s.studentProfile?.currentSession || "—",
      "Academic Standing": s.studentProfile?.academicStanding || "—",
    }));
    exportToExcel(exportData, "Students_List", "Students");
    toaster.success({ title: "Exported successfully" });
  };

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
          <InputGroup startElement={<LuSearch />} width="300px">
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

            
            <Button
              onClick={handleExport}
              display="flex"
              alignItems="center"
              size="lg"
              gap="2"
              px="4"
              py="2"
              bg="accent"
              rounded="md"
              color="white"
              cursor="pointer"
            >
              <LuDownload size={16} /> Export Table
            </Button>
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
                  render={(page) => (
                    <IconButton
                      variant={{ base: "ghost", _selected: "outline" }}
                    >
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
    </Box>
  );
};

export default Students;