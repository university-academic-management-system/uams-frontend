import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
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
import { useStudents } from "@hooks/student.hook";
import { StudentsDataTable } from "@components/shared/students-data-table";
import { AcademicLineChart } from "@components/shared/academic-students-chart";
import { RegistrationPieChart } from "@components/shared/registration-pie-chart";
import { formatLevel } from "@utils/function.util";
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

// Display labels
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
  const { data: students = [], isLoading, error } = useStudents();

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

  // Students that pass the shared filters (search + level + session), NOT filtered by degree
  const baseFiltered = useMemo(() => {
    if (!students.length) return [];
    return students.filter((student: Student) => {
      const profile = student.studentProfile;
      if (!profile) return false;
      const matchesLevel = level === "All" || profile.level === level;
      const matchesSession = sessionFilter === "All" || profile.currentSession === sessionFilter;
      const fullName = `${profile.firstName || ""} ${profile.lastName || ""} ${profile.otherName || ""}`.toLowerCase();
      const matchesSearch =
        !debouncedSearch ||
        fullName.includes(debouncedSearch.toLowerCase()) ||
        student.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        profile.matricNumber?.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesLevel && matchesSession && matchesSearch;
    });
  }, [students, level, sessionFilter, debouncedSearch]);

  // Group base-filtered students by degree — each tab reads its own bucket
  const studentsByDegree = useMemo(() => {
    const buckets: Record<degreeAwarded, Student[]> = {
      "BS.c": [],
      "MS.c": [],
      "Ph.D": [],
      POSTGRADUATE: [],
    };
    baseFiltered.forEach((s) => {
      const deg = normalizeDegree(s.studentProfile?.degreeAwarded);
      if (deg) buckets[deg].push(s);
    });
    return buckets;
  }, [baseFiltered]);

  // Live counts per tab (reflect current filters)
  const degreeCounts = useMemo(
    () => ({
      "BS.c": studentsByDegree["BS.c"].length,
      "MS.c": studentsByDegree["MS.c"].length,
      "Ph.D": studentsByDegree["Ph.D"].length,
      POSTGRADUATE: studentsByDegree.POSTGRADUATE.length,
    }),
    [studentsByDegree]
  );

  // Chart data computed per degree bucket
  const chartDataByDegree = useMemo(() => {
    const compute = (list: Student[]) => {
      const uniqueLevels = Array.from(
        new Set(list.map((s) => formatLevel(s.studentProfile?.level)).filter(Boolean))
      ).sort();

      const levelStats = uniqueLevels
        .map((lvl) => {
          const inLevel = list.filter((s) => formatLevel(s.studentProfile?.level) === lvl);
          const avgCgpa = inLevel.reduce((sum, s) => sum + (s.studentProfile?.cgpa || 0), 0) / (inLevel.length || 1);
          const avgGpa = inLevel.reduce((sum, s) => sum + (s.studentProfile?.gpa || 0), 0) / (inLevel.length || 1);
          const carryovers = inLevel.filter((s) => (s.studentProfile?.carryoverCourses || 0) > 0).length;
          return {
            level: lvl,
            levelLabel: `${lvl} Level`,
            avgCgpa: Number(avgCgpa.toFixed(2)),
            avgGpa: Number(avgGpa.toFixed(2)),
            carryovers,
          };
        })
        .sort((a, b) => parseInt(a.level, 10) - parseInt(b.level, 10));

      const registered = list.filter((s) => s.studentProfile?.registrationStatus === "REGISTERED").length;
      const unregistered = list.length - registered;
      const registrationData = [
        { name: "Registered", value: registered },
        { name: "Unregistered", value: unregistered },
      ];

      return { levelStats, registrationData };
    };

    return {
      "BS.c": compute(studentsByDegree["BS.c"]),
      "MS.c": compute(studentsByDegree["MS.c"]),
      "Ph.D": compute(studentsByDegree["Ph.D"]),
      POSTGRADUATE: compute(studentsByDegree.POSTGRADUATE),
    } as Record<degreeAwarded, ReturnType<typeof compute>>;
  }, [studentsByDegree]);

  const currentTabStudents = studentsByDegree[selectedDegree] ?? [];
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;


  const handleExportExcel = () => {
    const exportData = currentTabStudents.map((s) => ({
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

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({ orientation: "landscape" });
      const tableColumn = ["Full Name", "Email", "Matric Number", "Level", "Degree Awarded", "Current Session"];
      const tableRows = currentTabStudents.map((s) => [
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
    } catch (err) {
      console.error("PDF export failed:", err);
      toaster.error({ title: "PDF export failed", description: "Please try again later." });
    }
  };

  return (
    <Box maxW="100vw" overflowX="hidden">
      <Tabs.Root
        value={selectedDegree}
        onValueChange={(e) => setSelectedDegree(e.value as degreeAwarded)}
        variant="line"
        colorPalette="accent"
      >
        {/* Tab triggers */}
        <Tabs.List mb="6">
          {INTERNAL_DEGREES.map((deg) => (
            <Tabs.Trigger key={deg} value={deg}>
              {DISPLAY_LABELS[deg]} ({degreeCounts[deg]})
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Box bg="bg" rounded="md" p="4">
          {/* Shared filters — sit above all tab panels */}
          <Flex
            align="center"
            justify="space-between"
            gap="3"
            mb="5"
            wrap="wrap"
            direction={{ base: "column", sm: "row" }}
            colorPalette="accent"
          >
            <InputGroup startElement={<LuSearch />} width={{ base: "100%", sm: "300px" }}>
              <Input
                placeholder="Search by Name, Email or Mat. Num"
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
                width={{ base: "100%", sm: "140px" }}
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
                width={{ base: "100%", sm: "180px" }}
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

              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    display="flex"
                    alignItems="center"
                    size="xl"
                    bg="accent"
                    color="white"
                    width={{ base: "100%", sm: "auto" }}
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

          {/* Per-degree tab panels */}
          {INTERNAL_DEGREES.map((deg) => (
            <Tabs.Content key={deg} value={deg}>
              {studentsByDegree[deg].length > 0 && (
                <Box mb={6} p={4} rounded="md" borderColor="border.muted" bg="bg.panel">
                  <Flex direction="column" gap={9}>
                    <AcademicLineChart data={chartDataByDegree[deg].levelStats} />
                    <RegistrationPieChart data={chartDataByDegree[deg].registrationData} />
                  </Flex>
                </Box>
              )}
              <Box overflowX="auto">
                <StudentsDataTable
                  students={studentsByDegree[deg].slice(startIndex, startIndex + ITEMS_PER_PAGE)}
                  isLoading={isLoading}
                  error={error}
                />
              </Box>
            </Tabs.Content>
          ))}

          {/* Pagination — keyed to the active tab's list */}
          {currentTabStudents.length > ITEMS_PER_PAGE && (
            <Flex alignItems="center" justifyContent="flex-end" mt="4">
              <Pagination.Root
                count={currentTabStudents.length}
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
      </Tabs.Root>
    </Box>
  );
};

export default Students;