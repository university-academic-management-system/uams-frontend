import { useCallback, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { type CourseFormData } from "@schemas/program.schema";
import useCourseForm, { defaultCourseFormData } from "@forms/course.form";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Download, Edit, Trash2, X, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { CourseHook } from "@hooks/course.hook";
import { CourseServices } from "@services/course.service";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import {
  createListCollection,
  Box,
  Flex,
  Text,
  Input,
  Textarea,
  Button,
  InputGroup,
  Select,
  Portal,
  Table,
  EmptyState,
  VStack,
  Menu,
  Dialog,
  CloseButton,
  Field,
  Checkbox,
} from "@chakra-ui/react";
import { Switch } from "@components/ui/switch";
import {
  LuFileSpreadsheet,
  LuFileText,
  LuPlus,
  LuFileUp,
} from "react-icons/lu";
import BulkUploadCoursesModal from "@components/programs/BulkUploadCoursesModal";


const creditUnitCollection = createListCollection({
  items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((value) => ({
    label: value,
    value: value,
  })),
});

const semesterCollection = createListCollection({
  items: [
    { label: "1st Semester", value: "FIRST" },
    { label: "2nd Semester", value: "SECOND" },
    { label: "3rd Semester", value: "THIRD" },
  ],
});

const levelCollection = createListCollection({
  items: [
    { label: "100", value: "L100" },
    { label: "200", value: "L200" },
    { label: "300", value: "L300" },
    { label: "400", value: "L400" },
    { label: "500", value: "L500" },
  ],
});

const courseTypeCollection = createListCollection({
  items: [
    { label: "Core", value: "CORE" },
    { label: "Elective", value: "ELECTIVE" },
    { label: "GST", value: "GST" },
    { label: "SIWES", value: "SIWES" },
    { label: "Project", value: "PROJECT" },
  ],
});

const semesterFilterCollection = createListCollection({
  items: [
    { label: "All Semesters", value: "" },
    { label: "1st Semester", value: "FIRST" },
    { label: "2nd Semester", value: "SECOND" },
  ],
});

const levelFilterCollection = createListCollection({
  items: [
    { label: "All Levels", value: "" },
    { label: "100", value: "L100" },
    { label: "200", value: "L200" },
    { label: "300", value: "L300" },
    { label: "400", value: "L400" },
    { label: "500", value: "L500" },
  ],
});

const CoursesTab = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({ level: "", semester: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const requestSort = useCallback((key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const form = useCourseForm();

  const { data: courses = [] } = CourseHook.useCourses(filters);
  const { data: programTypes = [] } = CourseHook.useProgramTypes();
  const { mutate: createCourse, isPending: isCreating } = CourseHook.useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = CourseHook.useUpdateCourse();
  const { mutate: deleteCourse } = CourseHook.useDeleteCourse();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isSaving = isCreating || isUpdating;

  const formatSemesterName = useCallback((name: string) => {
    if (!name) return name;
    if (name.toLowerCase() === "semester 1" || name.toUpperCase() === "FIRST") return "1st Semester";
    if (name.toLowerCase() === "semester 2" || name.toUpperCase() === "SECOND") return "2nd Semester";
    if (name.toLowerCase() === "semester 3" || name.toUpperCase() === "THIRD") return "3rd Semester";
    return name;
  },[]);

  const formatLevel = useCallback((level: string) => {
    if (!level) return level;
    return level.toUpperCase().startsWith("L") ? level.substring(1) : level;
  }, []);

  const filtered = useMemo(() => {
    return courses.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) =>
        !searchTerm ||
        (c.title || c.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        c.code?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [courses, searchTerm]);

  const programTypeCollection = createListCollection({
    items: (programTypes as { id: string; name: string }[]).map((pt) => ({ label: pt.name, value: pt.id })),
  });



  const handleSave = useCallback((data: CourseFormData) => {
    const onSuccessCb = () => {
      setIsDialogOpen(false);
      form.reset(defaultCourseFormData);
      setIsEditing(false);
      setEditingCourseId(null);
    };

    if (isEditing && editingCourseId) {
      updateCourse({ id: editingCourseId, data }, { onSuccess: onSuccessCb });
    } else {
      createCourse(data, { onSuccess: onSuccessCb });
    }
  }, [isEditing, editingCourseId, updateCourse, createCourse, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = useCallback((course: any) => {
    setIsEditing(true);
    setEditingCourseId(course.id);
    setIsDialogOpen(true);
    form.reset({
      title: course.title || course.name || "",
      code: course.code || "",
      units: String(course.units ?? course.creditUnits ?? course.creditUnit ?? "3"),
      description: course.description || "",
      semester: typeof course.semester === "string" ? course.semester : (course.semester?.name || "FIRST"),
      level: typeof course.level === "string" ? course.level : (course.level?.name || "L100"),
      programTypeId: course.programmeId || course.programmeTypeId || course.programTypeId || "",
      courseType: course.courseType || "CORE",
      allowCarryover: course.isCarryoverAllowed ?? course.allowCarryover ?? true,
    });
  }, [form]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("Delete this course?")) {
      deleteCourse(id);
    }
  }, [deleteCourse]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectedIds.length === filtered.length ? [] : filtered.map((c: any) => c.id),
    );
  }, [selectedIds, filtered]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected courses?`,
      )
    ) {
      try {
        await Promise.all(
          selectedIds.map((id) => CourseServices.deleteCourse(id)),
        );
        toaster.success({ title: `${selectedIds.length} courses deleted` });
        setSelectedIds([]);
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      } catch {
        // Error toast handled by axios interceptor
      }
    }
  }, [selectedIds, queryClient]);

  const handleExportExcel = useCallback(() => {
    exportToExcel(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      courses.map((c: any) => ({
        Code: c.code,
        "Course Title": c.title || c.name,
        Programme: c.programmeId || c.programme?.name || "—",
        Level: typeof c.level === "string" ? formatLevel(c.level) : (formatLevel(c.level?.name) || "N/A"),
        Semester: typeof c.semester === "string" ? formatSemesterName(c.semester) : (formatSemesterName(c.semester?.name) || "N/A"),
        "Credit Units": c.units ?? c.creditUnits ?? c.creditUnit,
        "Course Type": c.courseType || "N/A",
        Carryover: c.isCarryoverAllowed ? "Yes" : "No",
        Status: c.status || "ACTIVE",
      })),
      "Courses",
      "Courses",
    );
  }, [courses, formatLevel, formatSemesterName]);

  const handleExportPDF = useCallback(() => {
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Courses List", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);

      let y = 35;
      doc.text("S/N", 14, y);
      doc.text("CODE", 25, y);
      doc.text("TITLE", 50, y);
      doc.text("LEVEL", 130, y);
      doc.text("UNITS", 160, y);

      doc.line(14, y + 2, 200, y + 2);
      y += 10;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      courses.forEach((c: any, i: number) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${i + 1}`, 14, y);
        doc.text(`${c.code || "N/A"}`, 25, y);
        doc.text(`${(c.title || c.name || "N/A").substring(0, 30)}`, 50, y);
        doc.text(`${typeof c.level === "string" ? formatLevel(c.level) : (formatLevel(c.level?.name) || "N/A")}`, 130, y);
        doc.text(`${c.units ?? c.creditUnits ?? c.creditUnit ?? "N/A"}`, 160, y);
        y += 10;
      });

      doc.save("Courses_Report.pdf");
      toaster.success({ title: "PDF Report downloaded" });
    });
  }, [courses, formatLevel]);



  const renderSortIcon = useCallback((key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={14} style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle", opacity: 0.5 }} />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp size={14} style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle" }} color="#1D7AD9" />;
    }
    return <ArrowDown size={14} style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle" }} color="#1D7AD9" />;
  }, [sortConfig]);

  const sortedAndFiltered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [...filtered].sort((a: any, b: any) => {
      if (!sortConfig) return 0;

      const { key, direction } = sortConfig;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let valA: any = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let valB: any = "";

      if (key === "code") {
        valA = a.code || "";
        valB = b.code || "";
      } else if (key === "title") {
        valA = a.title || a.name || "";
        valB = b.title || b.name || "";
      } else if (key === "level") {
        valA = typeof a.level === "string" ? a.level : (a.level?.name || "");
        valB = typeof b.level === "string" ? b.level : (b.level?.name || "");
      } else if (key === "semester") {
        valA = typeof a.semester === "string" ? a.semester : (a.semester?.name || "");
        valB = typeof b.semester === "string" ? b.semester : (b.semester?.name || "");
      } else if (key === "units") {
        valA = a.units ?? a.creditUnits ?? a.creditUnit ?? 0;
        valB = b.units ?? b.creditUnits ?? b.creditUnit ?? 0;
      } else if (key === "courseType") {
        valA = a.courseType || "CORE";
        valB = b.courseType || "CORE";
      } else if (key === "isCarryoverAllowed") {
        valA = a.isCarryoverAllowed ? 1 : 0;
        valB = b.isCarryoverAllowed ? 1 : 0;
      } else if (key === "status") {
        valA = a.status || "ACTIVE";
        valB = b.status || "ACTIVE";
      } else if (key === "programmeId") {
        valA = a.programmeId || a.programme?.name || "";
        valB = b.programmeId || b.programme?.name || "";
      }

      if (typeof valA === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return direction === "asc"
          ? (valA > valB ? 1 : -1)
          : (valA < valB ? 1 : -1);
      }
    });
  }, [filtered, sortConfig]);



  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)} size="lg" role="alertdialog" onExitComplete={() => { form.reset(defaultCourseFormData); setIsEditing(false); setEditingCourseId(null); }} placement="center" closeOnInteractOutside={false}>
    <Flex direction="column" gap="8">
      <Flex position="absolute" top="0" right="0" zIndex="10">
        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger asChild>
            <Button
              colorPalette="accent"
              size="xl"
              display="flex"
              alignItems="center"
              gap="2"
              fontSize="md"
              cursor="pointer"
              boxShadow="none"
            >
              <Plus size={20} /> Add Course
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg="white"
                boxShadow="xl"
                borderRadius="md"
                border="xs"
                borderColor="border.muted"
                minW="180px"
              >
                <Dialog.Trigger asChild>
                  <Menu.Item
                    value="single"
                    closeOnSelect={false}
                    onClick={() => { setIsEditing(false); form.reset(defaultCourseFormData); setIsDialogOpen(true); }}
                    cursor="pointer"
                    py="3"
                    px="4"
                  >
                    <LuPlus size={18} />
                    <Box flex="1" ml="2">
                      Single Course
                    </Box>
                  </Menu.Item>
                </Dialog.Trigger>
                <BulkUploadCoursesModal>
                  <Menu.Item
                    value="bulk"
                    closeOnSelect={false}
                    cursor="pointer"
                    py="3"
                    px="4"
                    _hover={{ bg: "slate.50" }}
                  >
                    <LuFileUp size={18} />
                    <Box flex="1" ml="2">
                      Bulk Upload (Excel)
                    </Box>
                  </Menu.Item>
                </BulkUploadCoursesModal>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
      <Box
        bg="white"
        borderRadius="md"
        borderWidth="xs"
        borderColor="border.muted"
        boxShadow="none"
      >
        {/* Desktop Toolbar */}
        <Flex p="6" alignItems="center" hideBelow="md">
          <InputGroup
            startElement={<Search size={20} color="gray" />}
            width="380px"
          >
            <Input
              colorPalette="accent"
              placeholder="Search by title, code, or level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              border="1px"
              borderColor="border.muted"
              size="lg"
              ps="11"
            />
          </InputGroup>

          <Flex gap="3" ml="auto" alignItems="center">
            <Select.Root
              collection={levelFilterCollection}
              value={[filters.level]}
              onValueChange={(e) =>
                setFilters((p) => ({ ...p, level: e.value[0] }))
              }
              size="lg"
              width="180px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger
                  bg="white"
                  border="xs"
                  borderColor="border.muted"
                >
                  <Select.ValueText placeholder="Level" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {levelFilterCollection.items.length === 0 ? (
                      <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                        No options available
                      </Box>
                    ) : (
                      levelFilterCollection.items.map((item: { label: string, value: string }) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))
                    )}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Select.Root
              collection={semesterFilterCollection}
              value={[filters.semester]}
              onValueChange={(e) =>
                setFilters((p) => ({ ...p, semester: e.value[0] }))
              }
              size="lg"
              width="180px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger
                  bg="white"
                  border="xs"
                  borderColor="border.muted"
                >
                  <Select.ValueText placeholder="Semester" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {semesterFilterCollection.items.length === 0 ? (
                      <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                        No options available
                      </Box>
                    ) : (
                      semesterFilterCollection.items.map((item: { label: string, value: string }) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))
                    )}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="xl" variant="outline" border="xs" borderColor="border.muted" disabled={courses.length === 0}>
                  <Download size={20} /> Export table
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    bg="white"
                    boxShadow="xl"
                    borderRadius="md"
                    border="xs"
                    borderColor="border.muted"
                    minW="180px"
                  >
                    <Menu.Item
                      value="excel"
                      onClick={handleExportExcel}
                      cursor="pointer"
                      py="3"
                      px="4"
                      _hover={{ bg: "slate.50" }}
                    >
                      <LuFileSpreadsheet size={18} />
                      <Box flex="1" ml="2">
                        Export as Excel
                      </Box>
                    </Menu.Item>
                    <Menu.Item
                      value="pdf"
                      onClick={handleExportPDF}
                      cursor="pointer"
                      py="3"
                      px="4"
                      _hover={{ bg: "slate.50" }}
                    >
                      <LuFileText size={18} />
                      <Box flex="1" ml="2">
                        Export as PDF
                      </Box>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        </Flex>

        {/* Mobile Toolbar */}
        <Flex p="4" direction="column" gap="4" hideFrom="md">
          <InputGroup
            startElement={<Search size={20} color="gray" />}
            width="full"
          >
            <Input
              colorPalette="accent"
              placeholder="Search by title, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              border="1px"
              borderColor="border.muted"
              size="lg"
              ps="11"
            />
          </InputGroup>

          <Flex gap="3" direction="column" width="full">
            <Flex gap="3" width="full">
              <Select.Root
                collection={levelFilterCollection}
                value={[filters.level]}
                onValueChange={(e) =>
                  setFilters((p) => ({ ...p, level: e.value[0] }))
                }
                size="lg"
                flex="1"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                    <Select.ValueText placeholder="Level" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {levelFilterCollection.items.map((item: { label: string, value: string }) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>

              <Select.Root
                collection={semesterFilterCollection}
                value={[filters.semester]}
                onValueChange={(e) =>
                  setFilters((p) => ({ ...p, semester: e.value[0] }))
                }
                size="lg"
                flex="1"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                    <Select.ValueText placeholder="Semester" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {semesterFilterCollection.items.map((item: { label: string, value: string }) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Flex>

            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="lg" variant="outline" border="xs" borderColor="border.muted" disabled={courses.length === 0} width="full">
                  <Download size={20} /> Export table
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    bg="white"
                    boxShadow="xl"
                    borderRadius="md"
                    border="xs"
                    borderColor="border.muted"
                    minW="180px"
                  >
                    <Menu.Item value="excel" onClick={handleExportExcel} cursor="pointer" py="3" px="4" _hover={{ bg: "slate.50" }}>
                      <LuFileSpreadsheet size={18} />
                      <Box flex="1" ml="2">Export as Excel</Box>
                    </Menu.Item>
                    <Menu.Item value="pdf" onClick={handleExportPDF} cursor="pointer" py="3" px="4" _hover={{ bg: "slate.50" }}>
                      <LuFileText size={18} />
                      <Box flex="1" ml="2">Export as PDF</Box>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        </Flex>

        <Table.ScrollArea maxW={{ base: "xl", md: "full" }} maxH="calc(100vh - 285px)">
          <Table.Root w="full" variant="outline" interactive>
            <Table.Header bg="bg.subtle" position="sticky" top="0" zIndex={10}>
              <Table.Row borderY="xs" borderColor="border.muted">
                <Table.ColumnHeader px="6" py="4" w="12" textAlign="center" position="sticky" left="0" zIndex="11" bg="bg.subtle">
                  <Checkbox.Root
                    variant="outline"
                    checked={
                      filtered.length > 0 &&
                      selectedIds.length === filtered.length
                    }
                    onCheckedChange={toggleSelectAll}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("sn")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    S/N {renderSortIcon("sn")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("code")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    COURSE CODE {renderSortIcon("code")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("title")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    COURSE TITLE {renderSortIcon("title")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("programmeId")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    PROGRAMME {renderSortIcon("programmeId")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("level")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    LEVEL {renderSortIcon("level")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("semester")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    SEMESTER {renderSortIcon("semester")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("units")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    CREDIT UNITS {renderSortIcon("units")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("courseType")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    COURSE TYPE {renderSortIcon("courseType")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("isCarryoverAllowed")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    CARRYOVER <br></br>ALLOWED{renderSortIcon("isCarryoverAllowed")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("status")}
                  userSelect="none"
                >
                  <Flex alignItems="center" gap="1">
                    STATUS {renderSortIcon("status")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  textAlign="center"
                  position="sticky"
                  right="0"
                  zIndex="11"
                  bg="bg.subtle"
                >
                  ACTIONS
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={9} py="12">
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <Search size={40} />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>
                            {searchTerm
                              ? `No results found for "${searchTerm}"`
                              : "No Courses Found"}
                          </EmptyState.Title>
                          <EmptyState.Description>
                            {searchTerm
                              ? "Try adjusting your search or filters to find what you're looking for."
                              : "Get started by adding your first course to the system."}
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sortedAndFiltered.map((course: any, index: number) => (
                  <Table.Row
                    key={course.id}
                    borderColor="border.muted"
                    fontSize="sm"
                    color="fg.muted"
                    bg={selectedIds.includes(course.id) ? "blue.50" : undefined}
                    data-group
                  >
                    <Table.Cell px="6" py="4" textAlign="center" position="sticky" left="0" zIndex="2" bg={selectedIds.includes(course.id) ? "blue.50" : "white"}>
                      <Checkbox.Root
                        variant="outline"
                        checked={selectedIds.includes(course.id)}
                        onCheckedChange={() => toggleSelection(course.id)}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell px="6" py="4" fontWeight="medium">
                      {course.code}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.title || course.name}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.programmeId || course.programme?.name || "—"}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {typeof course.level === "string" ? formatLevel(course.level) : (formatLevel(course.level?.name) || "—")}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {typeof course.semester === "string" ? formatSemesterName(course.semester) : (formatSemesterName(course.semester?.name) || "—")}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.units ?? course.creditUnits ?? course.creditUnit ?? "—"}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.courseType ? course.courseType.charAt(0).toUpperCase() + course.courseType.slice(1).toLowerCase() : "Core"}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      {course.isCarryoverAllowed ? "Yes" : "No"}
                    </Table.Cell>
                    <Table.Cell px="6" py="4">
                      <Box
                        px="2" py="1" borderRadius="full" fontSize="10px" fontWeight="bold" display="inline-block"
                        bg={course.status === "ACTIVE" ? "green.50" : "red.50"}
                        color={course.status === "ACTIVE" ? "green.600" : "red.600"}
                      >
                        {course.status || "ACTIVE"}
                      </Box>
                    </Table.Cell>
                    <Table.Cell px="3" py="4" textAlign="center" position="sticky" right="0" zIndex="2" bg={selectedIds.includes(course.id) ? "blue.50" : "white"}>
                      <Flex justifyContent="center" gap="0">
                        <Dialog.Trigger asChild>
                          <Button
                            onClick={() => handleEditClick(course)}
                            variant="ghost"
                            colorPalette="gray"
                            color="fg.muted"
                            size="xl"
                            borderRadius="md"
                            minW="auto"
                          >
                            <Edit size={16} />
                          </Button>
                        </Dialog.Trigger>
                        <Button
                          onClick={() => handleDelete(course.id)}
                          variant="ghost"
                          colorPalette="gray"
                          color="fg.muted"
                          size="xl"
                          borderRadius="md"
                          minW="auto"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <Flex
          position="fixed"
          bottom="8"
          left="50%"
          transform="translateX(-50%)"
          bg="white"
          px="6"
          py="3"
          borderRadius="md"
          boxShadow="lg"
          border="xs"
          borderColor="border.muted"
          alignItems="center"
          gap="6"
          zIndex="50"
          width={{ base: "calc(100% - 2rem)", md: "auto" }}
          justifyContent={{ base: "space-between", md: "center" }}
        >
          <Text fontSize="sm" fontWeight="bold" color="fg.muted">
            {selectedIds.length} items selected
          </Text>
          <Box w="px" h="6" bg="fg.subtle" />
          <Button
            onClick={handleBulkDelete}
            size="xl"
            borderRadius="md"
            fontSize="xs"
            colorPalette="accent"
          >
            <Trash2 size={16} /> Delete
          </Button>
          <Box w="px" h="6" bg="fg.subtle" />
          <Button
            onClick={() => setSelectedIds([])}
            variant="ghost"
            size="xl"
            borderRadius="md"
            title="Unselect all"
          >
            <X size={20} />
          </Button>
        </Flex>
      )}

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="md" overflow="hidden" colorPalette="accent">
              <Dialog.Header p="6">
                <VStack align="start" gap={1}>
                  <Dialog.Title
                    fontSize="lg"
                    fontWeight="bold"
                    color="fg.muted"
                  >
                    {isEditing ? "Edit Course" : "Add New Course"}
                  </Dialog.Title>

                  <Dialog.Description fontSize="sm" color="fg.muted">
                    Fill in the details below to{" "}
                    {isEditing
                      ? "update the course"
                      : "create a new course"}
                    .
                  </Dialog.Description>
                </VStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton colorPalette="gray" />
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <form onSubmit={form.handleSubmit(handleSave)}>
                <Dialog.Body p="8">
                                <Flex direction="column" gap="6">
                                  <Flex gap="4">
                    <Field.Root flex="6.5" invalid={!!form.formState.errors.title}>
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        Course Title
                      </Field.Label>
                      <Input
                        {...form.register("title")}
                        placeholder="e.g. Data Structures"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                      <Field.ErrorText>{form.formState.errors.title?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root flex="3.5" invalid={!!form.formState.errors.code}>
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        Course Code
                      </Field.Label>
                      <Input
                        {...form.register("code")}
                        placeholder="e.g. CSC 201"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                      <Field.ErrorText>{form.formState.errors.code?.message}</Field.ErrorText>
                    </Field.Root>
                  </Flex>

                  <Flex gap="4">
                    <Field.Root flex="1" invalid={!!form.formState.errors.courseType}>
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        Course Type
                      </Field.Label>
                      <Controller
                        control={form.control}
                        name="courseType"
                        render={({ field }) => (
                          <Select.Root
                            collection={courseTypeCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={(e) => field.onChange(e.value[0])}
                            size="lg"
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select type" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content>
                                  {courseTypeCollection.items.length === 0 ? (
                                    <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                      No options available
                                    </Box>
                                  ) : (
                                    courseTypeCollection.items.map((item: { label: string, value: string }) => (
                                      <Select.Item key={item.value} item={item}>
                                        <Select.ItemText>{item.label}</Select.ItemText>
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))
                                  )}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )}
                      />
                      <Field.ErrorText>{form.formState.errors.courseType?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root flex="1" invalid={!!form.formState.errors.programTypeId}>
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        Program Type
                      </Field.Label>
                      <Controller
                        control={form.control}
                        name="programTypeId"
                        render={({ field }) => (
                          <Select.Root
                            collection={programTypeCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={(e) => field.onChange(e.value[0])}
                            size="lg"
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select program" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content>
                                  {programTypeCollection.items.length === 0 ? (
                                    <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                      No options available
                                    </Box>
                                  ) : (
                                    (programTypeCollection.items as { label: string, value: string }[]).map((item) => (
                                      <Select.Item key={item.value} item={item}>
                                        <Select.ItemText>{item.label}</Select.ItemText>
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))
                                  )}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )}
                      />
                      <Field.ErrorText>{form.formState.errors.programTypeId?.message}</Field.ErrorText>
                    </Field.Root>
                  </Flex>

                  <Flex gap="4">
                    <Field.Root flex="1" invalid={!!form.formState.errors.level}>
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        Level
                      </Field.Label>
                      <Controller
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <Select.Root
                            collection={levelCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={(e) => field.onChange(e.value[0])}
                            size="lg"
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select level" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content>
                                  {levelCollection.items.length === 0 ? (
                                    <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                      No options available
                                    </Box>
                                  ) : (
                                    levelCollection.items.map((item: { label: string, value: string }) => (
                                      <Select.Item key={item.value} item={item}>
                                        <Select.ItemText>{item.label}</Select.ItemText>
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))
                                  )}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )}
                      />
                      <Field.ErrorText>{form.formState.errors.level?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root flex="1" invalid={!!form.formState.errors.semester}>
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        Semester
                      </Field.Label>
                      <Controller
                        control={form.control}
                        name="semester"
                        render={({ field }) => (
                          <Select.Root
                            collection={semesterCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={(e) => field.onChange(e.value[0])}
                            size="lg"
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select semester" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content>
                                  {semesterCollection.items.length === 0 ? (
                                    <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                      No options available
                                    </Box>
                                  ) : (
                                    semesterCollection.items.map((item: { label: string, value: string }) => (
                                      <Select.Item key={item.value} item={item}>
                                        <Select.ItemText>{item.label}</Select.ItemText>
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))
                                  )}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )}
                      />
                      <Field.ErrorText>{form.formState.errors.semester?.message}</Field.ErrorText>
                    </Field.Root>
                  </Flex>

                  <Flex gap="4">
                    <Field.Root flex="1" invalid={!!form.formState.errors.units}>
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        Credit Units
                      </Field.Label>
                      <Controller
                        control={form.control}
                        name="units"
                        render={({ field }) => (
                          <Select.Root
                            collection={creditUnitCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={(e) => field.onChange(e.value[0])}
                            size="lg"
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select units" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content>
                                  {creditUnitCollection.items.length === 0 ? (
                                    <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                      No options available
                                    </Box>
                                  ) : (
                                    creditUnitCollection.items.map((item: { label: string, value: string }) => (
                                      <Select.Item key={item.value} item={item}>
                                        <Select.ItemText>{item.label}</Select.ItemText>
                                        <Select.ItemIndicator />
                                      </Select.Item>
                                    ))
                                  )}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )}
                      />
                      <Field.ErrorText>{form.formState.errors.units?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root flex="1">
                      <Field.Label
                        fontSize="sm"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        Allow Carryover
                      </Field.Label>
                      <Box pt="2">
                        <Controller
                          control={form.control}
                          name="allowCarryover"
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onCheckedChange={(e) => field.onChange(!!e.checked)}
                              colorPalette="blue"
                            >
                              {field.value ? "Yes" : "No"}
                            </Switch>
                          )}
                        />
                      </Box>
                    </Field.Root>
                  </Flex>

                  <Field.Root invalid={!!form.formState.errors.description}>
                    <Field.Label
                      fontSize="sm"
                      fontWeight="medium"
                      color="fg.muted"
                    >
                      Description
                    </Field.Label>
                    <Textarea
                      {...form.register("description")}
                      rows={3}
                      size="xl"
                      placeholder="Enter course description..."
                      _placeholder={{ color: "fg.subtle" }}
                    />
                    <Field.ErrorText>{form.formState.errors.description?.message}</Field.ErrorText>
                  </Field.Root>
                </Flex>
              </Dialog.Body>

              <Dialog.Footer
                p="6"
                gap="3"
              >
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    colorPalette="gray"
                    size="xl"
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  type="submit"
                  size="xl"
                  loading={isSaving}
                  loadingText="Saving..."
                  disabled={!form.formState.isValid || isSaving}
                >
                  {isEditing ? "Update Course" : "Create Course"}
                </Button>
              </Dialog.Footer>
            </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
    </Flex>
    </Dialog.Root>
  );
};

export default CoursesTab;
