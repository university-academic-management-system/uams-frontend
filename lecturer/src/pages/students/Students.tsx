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
  Tabs,
  SelectItemIndicator,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { LuSearch, LuChevronLeft, LuChevronRight, LuDownload, LuFileSpreadsheet, LuFileText } from "react-icons/lu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Student, degreeAwarded } from "@type/student.type";
import { STUDENT_LEVELS } from "@type/student.type";
import { StudentHook } from "@hooks/student.hook";
import StudentsTable from "@components/shared/StudentsTable";
import { exportToExcel } from "@utils/excel.util";
import { toaster } from "@components/ui/toaster";
import useAuthStore from "@stores/auth.store";

// Internal keys (matching the type)
const INTERNAL_DEGREES: degreeAwarded[] = ["BS.c", "MS.c", "Ph.D", "POSTGRADUATE"];

// Normalise API degree string to internal key
const normalizeDegree = (raw: string | undefined): degreeAwarded | null => {
  if (!raw) return null;
  const upper = raw.toUpperCase().replace(/\./g, "");
  if (upper === "BSC") return "BS.c";
  if (upper === "MSC") return "MS.c";
  if (upper === "PHD") return "Ph.D";
  if (upper === "POSTGRADUATE") return "POSTGRADUATE";
  return null;
};

// Display labels (as they appear in API: B.SC, M.SC, PH.D, POSTGRADUATE)
const DISPLAY_LABELS: Record<degreeAwarded, string> = {
  "BS.c": "B.SC",
  "MS.c": "M.SC",
  "Ph.D": "PH.D",
  POSTGRADUATE: "POSTGRADUATE",
};

const LEVEL_OPTIONS = ["All", ...STUDENT_LEVELS];
const ITEMS_PER_PAGE = 10;

const levelCollection = createListCollection({
  items: LEVEL_OPTIONS.map((opt) => ({
    label: opt === "All" ? "All Levels" : opt.replace(/^L/, ""),
    value: opt,
  })),
});

const Students = () => {
  const { user } = useAuthStore();
  const { data: students = [], isLoading, error } = StudentHook.useStudents();

  const sessionCollection = useMemo(() => {
    let currentYear = new Date().getFullYear();
    if (user?.currentSession) {
      const yearStr = user.currentSession.split("/")[0];
      const parsedYear = parseInt(yearStr, 10);
      if (!isNaN(parsedYear)) currentYear = parsedYear;
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

  // Count students per internal degree key, using normalisation
  const degreeCounts = useMemo(() => {
    const counts: Record<degreeAwarded, number> = {
      "BS.c": 0,
      "MS.c": 0,
      "Ph.D": 0,
      POSTGRADUATE: 0,
    };
    students.forEach((s) => {
      const rawDeg = s.studentProfile?.degreeAwarded;
      const norm = normalizeDegree(rawDeg);
      if (norm && norm in counts) counts[norm]++;
    });
    return counts;
  }, [students]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [selectedDegree, setSelectedDegree] = useState<degreeAwarded>("BS.c");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, level, sessionFilter, selectedDegree]);

  const filteredStudents = useMemo(() => {
    if (!students.length) return [];
    return students.filter((student: Student) => {
      const profile = student.studentProfile;
      if (!profile) return false;

      const matchesLevel = level === "All" || profile.level === level;
      const matchesSession = sessionFilter === "All" || profile.currentSession === sessionFilter;
      const matchesDegree = normalizeDegree(profile.degreeAwarded) === selectedDegree;

      const fullName = `${profile.firstName || ""} ${profile.lastName || ""} ${profile.otherName || ""}`.toLowerCase();
      const matchesSearch =
        !debouncedSearch ||
        fullName.includes(debouncedSearch.toLowerCase()) ||
        student.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        profile.matricNumber?.toLowerCase().includes(debouncedSearch.toLowerCase());

      return matchesLevel && matchesSession && matchesDegree && matchesSearch;
    });
  }, [students, level, sessionFilter, selectedDegree, debouncedSearch]);

  // Excel export
  const handleExportExcel = () => {
    const exportData = filteredStudents.map((s) => ({
      "Full Name": `${s.studentProfile?.firstName || ""} ${s.studentProfile?.lastName || ""} ${s.studentProfile?.otherName || ""}`.trim(),
      "Email": s.email,
      "Matric Number": s.studentProfile?.matricNumber || "—",
      "Registration Number": s.studentProfile?.registrationNo || "—",
      "Phone": s.studentProfile?.phone || "—",
      "Level": s.studentProfile?.level || "—",
      "Degree Awarded": s.studentProfile?.degreeAwarded || "—",
      "Admission Year": s.studentProfile?.admissionYear || "—",
      "Admission Session": s.studentProfile?.admissionSession || "—",
      "Current Session": s.studentProfile?.currentSession || "—",
      "Academic Standing": s.studentProfile?.academicStanding || "—",
    }));
    exportToExcel(exportData, "Students_List", "Students");
    toaster.success({ title: "Exported as Excel successfully" });
  };

  // PDF export using jsPDF + autoTable
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({ orientation: "landscape" });
      const tableColumn = [
        "Full Name",
        "Email",
        "Matric Number",
        "Level",
        "Degree Awarded",
        "Current Session",
      ];
      const tableRows = filteredStudents.map((s) => [
        `${s.studentProfile?.firstName || ""} ${s.studentProfile?.lastName || ""} ${s.studentProfile?.otherName || ""}`.trim(),
        s.email,
        s.studentProfile?.matricNumber || "—",
        s.studentProfile?.level || "—",
        s.studentProfile?.degreeAwarded || "—",
        s.studentProfile?.currentSession || "—",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 248, 255] },
        margin: { top: 20, left: 10, right: 10 },
      });

      doc.save("Students_List.pdf");
      toaster.success({ title: "Exported as PDF successfully" });
    } catch (error) {
      console.error("PDF export failed:", error);
      toaster.error({ title: "PDF export failed", description: "Please try again later." });
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Box>
      <Flex mb="6" gap="1" align="baseline">
        <Heading fontSize="2xl" color="fg.muted" mb="1">
          Students{" "}
        </Heading>
        <Text as="span" color="fg.subtle" lineHeight="1.5">
          ({filteredStudents.length} total)
        </Text>
      </Flex>

      <Tabs.Root
        value={selectedDegree}
        onValueChange={(e) => setSelectedDegree(e.value as degreeAwarded)}
        mb={6}
        variant="enclosed"
      >
        <Tabs.List mb="6">
          {INTERNAL_DEGREES.map((deg) => (
            <Tabs.Trigger key={deg} value={deg}>
              {DISPLAY_LABELS[deg]} ({degreeCounts[deg]})
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

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
                      <SelectItemIndicator />
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
                      <SelectItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>

            {/* Export Dropdown Menu */}
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  display="flex"
                  alignItems="center"
                  size="lg"
                  gap="2"
                  bg="accent"
                  color="white"
                  cursor="pointer"
                >
                  <LuDownload size={16} /> Export Table
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="excel" onClick={handleExportExcel}>
                      <LuFileSpreadsheet /> Export as Excel
                    </Menu.Item>
                    <Menu.Item value="pdf" onClick={handleExportPDF}>
                      <LuFileText /> Export as PDF
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        </Flex>

        <StudentsTable
          students={paginatedStudents}
          isLoading={isLoading}
          error={error}
        />

        {filteredStudents.length >= 20 && (
          <Flex alignItems="center" justifyContent="flex-end" mt="4">
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
    </Box>
  );
};

export default Students;