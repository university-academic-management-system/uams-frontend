import { useState, useMemo, useCallback } from "react";
import { Plus, FileUp, MoreHorizontal, UserCog, Pencil, Trash2, Download, X, Search, GraduationCap, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import {
  Box, Flex, Text, Spinner,
  Portal,
  EmptyState,
  Input,
  InputGroup,
  Button,
  VStack,
  Table,
  Checkbox,
  Popover,
  ActionBar,
  CloseButton,
  Select,
  createListCollection,
  Menu,
} from "@chakra-ui/react";
import BulkUploadStudentsModal from "@components/students/BulkUploadStudentsModal";
import StudentDetailsSidebar from "@components/students/StudentDetailsSidebar";
import AddStudentForm from "@components/students/AddStudentForm";
import DeleteConfirmationModal from "@components/students/DeleteConfirmationModal";
import { StudentHook } from "@hooks/student.hook";
import type { Student, StudentStatus, StudentLevel } from "@type/student.type";
import {
    PaginationRoot,
    PaginationItems,
    PaginationPrevTrigger,
    PaginationNextTrigger
} from "@components/ui/pagination";

const ITEMS_PER_PAGE = 50;

const STUDENT_STATUSES: StudentStatus[] = ['ACTIVE', 'SUSPENDED', 'DELETED'];
const STUDENT_LEVELS: StudentLevel[] = ['L100', 'L200', 'L300', 'L400', 'L500', 'L600', 'L700', 'L800'];

const STATUSES_COLLECTION = createListCollection({
    items: [
        { label: "All Statuses", value: "" },
        ...STUDENT_STATUSES.map(s => ({ label: s.charAt(0) + s.slice(1).toLowerCase(), value: s }))
    ]
});

const LEVELS_COLLECTION = createListCollection({
    items: [
        { label: "All Levels", value: "" },
        ...STUDENT_LEVELS.map(l => ({ label: l, value: l }))
    ]
});

const StudentsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    const requestSort = useCallback((key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    const renderSortIcon = useCallback((key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown size={14} style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle", opacity: 0.5 }} />;
        }
        if (sortConfig.direction === "asc") {
            return <ArrowUp size={14} style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle" }} color="#1D7AD9" />;
        }
        return <ArrowDown size={14} style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle" }} color="#1D7AD9" />;
    }, [sortConfig]);

    const apiFilters = useMemo(() => {
        const filters: Record<string, string> = {};
        if (selectedStatus) filters.status = selectedStatus;
        if (selectedLevel) filters.level = selectedLevel;
        if (selectedSession) filters.session = selectedSession;
        return Object.keys(filters).length > 0 ? filters : undefined;
    }, [selectedStatus, selectedLevel, selectedSession]);

    const { data: students = [], isLoading: loading } = StudentHook.useStudents(apiFilters);
    const addMutation = StudentHook.useAddStudent();
    const updateMutation = StudentHook.useUpdateStudent();
    const bulkDeleteMutation = StudentHook.useBulkDeleteStudents();
    const bulkDownloadMutation = StudentHook.useBulkDownloadStudents();

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;

        const q = searchQuery.toLowerCase();
        return students.filter(
            (s) =>
                s.fullName.toLowerCase().includes(q) ||
                s.surname.toLowerCase().includes(q) ||
                (s.otherName && s.otherName.toLowerCase().includes(q)) ||
                s.email.toLowerCase().includes(q) ||
                (s.registrationNo && s.registrationNo.toLowerCase().includes(q)) ||
                (s.matricNumber && s.matricNumber.toLowerCase().includes(q)) ||
                (s.phone && s.phone.toLowerCase().includes(q))
        );
    }, [students, searchQuery]);

    const clearFilters = useCallback(() => {
        setSearchQuery("");
        setSelectedStatus("");
        setSelectedLevel("");
        setSelectedSession("");
        setCurrentPage(1);
    }, []);

    const sortedAndFilteredStudents = useMemo(() => {
        const sorted = [...filteredStudents];
        if (!sortConfig) return sorted;
        
        const { key, direction } = sortConfig;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return sorted.sort((a: any, b: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const valA: any = a[key] || "";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const valB: any = b[key] || "";
            
            if (typeof valA === "string") {
                return direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else {
                return direction === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
            }
        });
    }, [filteredStudents, sortConfig]);

    const totalPages = Math.ceil(sortedAndFilteredStudents.length / ITEMS_PER_PAGE);
    const paginatedStudents = sortedAndFilteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    }, []);

    const toggleSelectAll = useCallback(() => {
        const allIds = filteredStudents.map((s) => s.id);
        const allSelected = allIds.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : allIds);
    }, [filteredStudents, selectedIds]);

    const handleExport = useCallback(() => {
        const exportData = filteredStudents.map((s) => ({
            "Full Name": s.fullName, Email: s.email, "Reg No": s.registrationNo || "—",
            "Mat No": s.matricNumber || "—", Surname: s.surname, "Other Name": s.otherName || "—",
            Phone: s.phone || "—", Gender: s.gender || "—",
            Faculty: s.faculty || "—", Level: s.level || "—", "Admission Mode": s.admissionMode || "—",
            "Entry Qualification": s.entryQualification || "—", "Degree Course": s.degreeCourse || "—",
            "Program Duration": s.courseDuration || "—", "Degree Awarded": s.degreeAwarded || "—",
        }));
        exportToExcel(exportData, "Students_List", "Students");
        toaster.success({ title: "Exported successfully" });
    }, [filteredStudents]);

    const handleBulkDownload = useCallback(async () => {
        if (selectedIds.length === 0) return;
        try {
            const blob = await bulkDownloadMutation.mutateAsync(selectedIds) as unknown as Blob;
            if (blob) {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "students_data.csv");
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch {
            // Error toast handled by axios interceptor
        }
    }, [selectedIds, bulkDownloadMutation]);

    const handleBulkDelete = useCallback(() => {
        if (selectedIds.length === 0) return;
        setIdsToDelete(selectedIds);
        setIsDeleteModalOpen(true);
    }, [selectedIds]);

    const handleSingleDelete = useCallback((id: string) => {
        setIdsToDelete([id]);
        setIsDeleteModalOpen(true);
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddEditSubmit = useCallback(async (data: any) => {
        if (studentToEdit) {
            await updateMutation.mutateAsync({ id: studentToEdit.id, payload: data });
        } else {
            await addMutation.mutateAsync({ ...data, type: "STUDENT" });
        }
        setShowAddForm(false);
        setStudentToEdit(null);
    }, [studentToEdit, updateMutation, addMutation]);

    const handleConfirmDelete = useCallback(async (reason: string) => {
        await bulkDeleteMutation.mutateAsync({ ids: idsToDelete, reason });
        setIsDeleteModalOpen(false);
        setIdsToDelete([]);
        setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
    }, [idsToDelete, bulkDeleteMutation]);

    return (
        <Box>
            {/* Header */}
            <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems={{ base: "flex-start", md: "center" }} mb="10" gap="4">
                <Box maxW="xl">
                    <Text fontSize="3xl" fontWeight="bold" color="fg.muted">Students</Text>
                    <Text color="fg.muted" mt="2">
                        {students.length} total students • {filteredStudents.length} filtered
                    </Text>
                </Box>
                <Flex alignItems="center" gap="3" flexWrap="wrap">
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <Button size="xl" variant="solid" flexShrink={0} bg="accent" color="white" display="flex" alignItems="center" borderRadius="md">
                                <Plus size={16} /> Add Student
                            </Button>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content bg="white" borderRadius="md" boxShadow="none" border="xs" borderColor="border.muted" minW="150px" overflow="hidden" py="1" zIndex="popover">
                                    <Menu.Item value="single" asChild>
                                        <Box as="button" onClick={() => { setStudentToEdit(null); setShowAddForm(true); }} w="full" textAlign="left" px="4" py="2.5" fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ bg: "slate.50" }} cursor="pointer" border="none" bg="transparent" display="flex" alignItems="center" gap="2">
                                            <UserCog size={16} /> Single
                                        </Box>
                                    </Menu.Item>
                                    <Menu.Item value="bulk" asChild>
                                        <Box as="button" onClick={() => setShowUpload(true)} w="full" textAlign="left" px="4" py="2.5" fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ bg: "slate.50" }} cursor="pointer" border="none" bg="transparent" display="flex" alignItems="center" gap="2">
                                            <FileUp size={16} /> Bulk
                                        </Box>
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                </Flex>
            </Flex>

            {/* Table Card (Contains Search, Filters, and Table) */}
            <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" boxShadow="none">
                <Flex p="6" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="4" colorPalette="accent">
                    <InputGroup startElement={<Search size={20} color="gray" />} flex="1" minW="220px" maxW="400px">
                        <Input
                            size="lg"
                            type="text"
                            placeholder="Search by name, email or student ID..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            bg="white"
                            border="xs"
                            borderColor="border.muted"
                            ps="11"
                        />
                    </InputGroup>

                    <Flex gap="3" alignItems="center" flexWrap="wrap">
                        <Select.Root 
                            collection={STATUSES_COLLECTION} 
                            value={selectedStatus ? [selectedStatus] : []} 
                            onValueChange={(e) => { setSelectedStatus(e.value[0] || ""); setCurrentPage(1); }} 
                            size="lg" 
                            width="140px"
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                    <Select.ValueText placeholder="Status" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator>
                                        <ChevronDown size={16} color="#64748b" />
                                    </Select.Indicator>
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {STATUSES_COLLECTION.items.map((item) => (
                                            <Select.Item item={item} key={item.value}>
                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                        
                        <Select.Root 
                            collection={LEVELS_COLLECTION} 
                            value={selectedLevel ? [selectedLevel] : []} 
                            onValueChange={(e) => { setSelectedLevel(e.value[0] || ""); setCurrentPage(1); }} 
                            size="lg" 
                            width="140px"
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                    <Select.ValueText placeholder="Level" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator>
                                        <ChevronDown size={16} color="#64748b" />
                                    </Select.Indicator>
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {LEVELS_COLLECTION.items.map((item) => (
                                            <Select.Item item={item} key={item.value}>
                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                        
                        <Input
                            size="lg"
                            placeholder="Session (e.g. 2025/2026)"
                            value={selectedSession}
                            onChange={(e) => { setSelectedSession(e.target.value); setCurrentPage(1); }}
                            bg="white"
                            border="xs"
                            borderColor="border.muted"
                            width="170px"
                        />

                        <Button onClick={clearFilters} variant="ghost" color="fg.muted" size="xl" px="3" aria-label="Clear filters">
                            <X size={16} />
                        </Button>

                        <Button onClick={handleExport} size="xl" variant="subtle" border="xs" borderColor="border.muted" bg="slate.50" color="fg.muted">
                            <Download size={20} /> Export table
                        </Button>
                    </Flex>
                </Flex>

                <Box overflowX="auto" maxW={{ base: "100%", lg: "calc(100vw - 340px)" }}>
                    <Table.Root w="full" textAlign="left" variant="outline" interactive>
                        <Table.Header bg="bg.subtle">
                            <Table.Row borderY="xs" borderColor="border.muted">
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" w="12" textAlign="center" position="sticky" left="0" zIndex="20" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">
                                    <Checkbox.Root
                                        variant="outline"
                                        checked={filteredStudents.length > 0 && selectedIds.length > 0 && selectedIds.length === filteredStudents.length}
                                        onCheckedChange={toggleSelectAll}
                                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("registrationNo")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Reg No. {renderSortIcon("registrationNo")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("matricNumber")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Mat. No. {renderSortIcon("matricNumber")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("surname")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">First Name {renderSortIcon("surname")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("otherName")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Other Names {renderSortIcon("otherName")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="200px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("email")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Email {renderSortIcon("email")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="140px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("phone")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Phone No {renderSortIcon("phone")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="100px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("gender")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Gender {renderSortIcon("gender")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("admissionMode")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Admission Mode {renderSortIcon("admissionMode")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("entryQualification")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Entry Qualification {renderSortIcon("entryQualification")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("faculty")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Faculty {renderSortIcon("faculty")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("department")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Department {renderSortIcon("department")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="100px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("level")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Level {renderSortIcon("level")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("degreeCourse")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Degree Course {renderSortIcon("degreeCourse")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="120px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("courseDuration")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Course Duration {renderSortIcon("courseDuration")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("degreeAwarded")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Degree Award Code {renderSortIcon("degreeAwarded")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="100px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap" cursor="pointer" onClick={() => requestSort("status")} userSelect="none" _hover={{ bg: "slate.100" }}>
                                    <Flex alignItems="center" gap="1">Status {renderSortIcon("status")}</Flex>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" textAlign="right" pr="12" position="sticky" right="0" zIndex="20" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Action</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body fontSize="xs">
                            {loading ? (
                                <Table.Row>
                                    <Table.Cell colSpan={18} py="12" textAlign="center">
                                        <Flex direction="column" alignItems="center" gap="4">
                                            <Spinner size="xl" color="blue.500" borderWidth="3px" />
                                            <Text color="fg.muted">Loading students...</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : paginatedStudents.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={18} py="12">
                                        <EmptyState.Root>
                                            <EmptyState.Content>
                                                <EmptyState.Indicator>
                                                    <GraduationCap />
                                                </EmptyState.Indicator>
                                                <VStack textAlign="center">
                                                    <EmptyState.Title>No Students Found</EmptyState.Title>
                                                    <EmptyState.Description>
                                                        Try changing your search or filter criteria
                                                    </EmptyState.Description>
                                                </VStack>
                                            </EmptyState.Content>
                                        </EmptyState.Root>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                paginatedStudents.map((s) => (
                                    <Table.Row key={s.id} _hover={{ bg: "slate.50" }} borderBottom="xs" borderColor="border.muted" bg={selectedIds.includes(s.id) ? "blue.50" : "transparent"} cursor="pointer" whiteSpace="nowrap">
                                        <Table.Cell px="6" py="5" textAlign="center" position="sticky" left="0" zIndex="10" bg={selectedIds.includes(s.id) ? "blue.50" : "white"} borderBottom="xs" borderColor="border.muted">
                                            <Checkbox.Root
                                                variant="outline"
                                                checked={selectedIds.includes(s.id)}
                                                onCheckedChange={() => toggleSelection(s.id)}
                                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                            >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                            </Checkbox.Root>
                                        </Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.subtle" fontWeight="medium">{s.registrationNo || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.matricNumber || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" fontWeight="bold" color="fg.muted">{s.surname}</Table.Cell>
                                        <Table.Cell px="6" py="5" fontWeight="medium" color="fg.muted">{s.otherName || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.email}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.phone || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted" textTransform="capitalize">{s.gender || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted" textTransform="capitalize">{s.admissionMode || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.entryQualification || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.faculty || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.department || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.level || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.degreeCourse || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.courseDuration || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5" color="fg.muted">{s.degreeAwarded || "—"}</Table.Cell>
                                        <Table.Cell px="6" py="5">
                                            <Text as="span" px="3" py="1" borderRadius="full" fontSize="10px" fontWeight="bold" bg={s.status === "ACTIVE" ? "green.100" : "red.100"} color={s.status === "ACTIVE" ? "green.700" : "red.700"}>
                                                {s.status === "ACTIVE" ? "Active" : "Inactive"}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell px="6" py="5" textAlign="right" pr="12" position="sticky" right="0" zIndex="10" bg={selectedIds.includes(s.id) ? "blue.50" : "white"} borderBottom="xs" borderColor="border.muted">
                                            <Popover.Root positioning={{ placement: "bottom-end" }}>
                                                <Popover.Trigger asChild>
                                                    <Button variant="ghost" size="sm" onClick={(e: React.MouseEvent) => e.stopPropagation()} borderRadius="full" px="0" color="fg.subtle">
                                                        <MoreHorizontal size={20} />
                                                    </Button>
                                                </Popover.Trigger>
                                                <Portal>
                                                    <Popover.Positioner zIndex="popover">
                                                        <Popover.Content bg="white" borderRadius="md" boxShadow="md" border="xs" borderColor="border.muted" w="48" overflow="hidden" outline="none">
                                                            <Popover.Body p="1">
                                                                <Button variant="ghost" colorPalette="green" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedStudent(s); }} w="full" justifyContent="flex-start" size="sm">
                                                                    <UserCog size={16} /> Assign Role
                                                                </Button>
                                                                <Button variant="ghost" colorPalette="orange" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setStudentToEdit(s); setShowAddForm(true); }} w="full" justifyContent="flex-start" size="sm">
                                                                    <Pencil size={16} /> Edit details
                                                                </Button>
                                                                <Button variant="ghost" colorPalette="red" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleSingleDelete(s.id); }} w="full" justifyContent="flex-start" size="sm">
                                                                    <Trash2 size={16} /> Delete student
                                                                </Button>
                                                            </Popover.Body>
                                                        </Popover.Content>
                                                    </Popover.Positioner>
                                                </Portal>
                                            </Popover.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>

                {totalPages > 1 && (
                    <Flex alignItems="center" justifyContent="space-between" p="4" bg="white" borderTop="xs" borderColor="border.muted">
                        <Text fontSize="sm" color="fg.muted">
                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students
                        </Text>
                        <PaginationRoot
                            count={filteredStudents.length}
                            pageSize={ITEMS_PER_PAGE}
                            page={currentPage}
                            onPageChange={(e) => setCurrentPage(e.page)}
                            variant="outline"
                            size="lg"
                        >
                            <Flex gap="2">
                                <PaginationPrevTrigger />
                                <PaginationItems />
                                <PaginationNextTrigger />
                            </Flex>
                        </PaginationRoot>
                    </Flex>
                )}
            </Box>

            <ActionBar.Root
                open={selectedIds.length > 1}
                onOpenChange={(e) => {
                    if (!e.open) setSelectedIds([]);
                }}
                closeOnInteractOutside={false}
            >
                <Portal>
                    <ActionBar.Positioner zIndex="50">
                        <ActionBar.Content borderRadius="md" p="2">
                            <ActionBar.SelectionTrigger>
                                {selectedIds.length} items selected
                            </ActionBar.SelectionTrigger>
                            <ActionBar.Separator />
                            <Button
                                onClick={handleBulkDownload}
                                size="xl"
                                borderRadius="md"
                                bg="#1D7AD9"
                                color="white"
                                display="flex"
                                alignItems="center"
                                gap="2"
                                cursor="pointer"
                                border="none"
                            >
                                <Download size={16} /> Bulk Download
                            </Button>
                            <Button
                                onClick={handleBulkDelete}
                                size="xl"
                                borderRadius="md"
                                bg="red.500"
                                color="white"
                                display="flex"
                                alignItems="center"
                                gap="2"
                                cursor="pointer"
                                border="none"
                            >
                                <Trash2 size={16} /> Bulk Delete
                            </Button>
                            <ActionBar.CloseTrigger asChild>
                                <CloseButton size="xl" />
                            </ActionBar.CloseTrigger>
                        </ActionBar.Content>
                    </ActionBar.Positioner>
                </Portal>
            </ActionBar.Root>

            <BulkUploadStudentsModal isOpen={showUpload} onClose={() => setShowUpload(false)} onUploaded={() => { setShowUpload(false); }} />

            {/* Assign Role Sidebar */}
            {selectedStudent && (
                <StudentDetailsSidebar
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}

            {/* Add/Edit Student Form */}
            <AddStudentForm
                isOpen={showAddForm}
                initialData={studentToEdit}
                onClose={() => { setShowAddForm(false); setStudentToEdit(null); }}
                onSubmit={handleAddEditSubmit}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setIdsToDelete([]); }}
                onConfirm={handleConfirmDelete}
                title="Delete Students"
                description="This action cannot be undone. This will permanently delete the selected student records from the system."
                itemCount={idsToDelete.length}
            />
        </Box>
    );
};

export default StudentsPage;