import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, FileDown, FileUp, MoreHorizontal, UserCog, Pencil, Trash2, Download, X, Search, GraduationCap } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import { Box, Flex, Text, Spinner, EmptyState } from "@chakra-ui/react";
import BulkUploadStudentsModal from "@components/students/BulkUploadStudentsModal";
import StudentDetailsSidebar from "@components/students/StudentDetailsSidebar";
import AddStudentForm from "@components/students/AddStudentForm";
import DeleteConfirmationModal from "@components/students/DeleteConfirmationModal";
import { StudentServices } from "@services/student.service";
import { StudentHook } from "@hooks/student.hook";
import type { Student } from "@type/student.type";
import { 
    PaginationRoot, 
    PaginationItems, 
    PaginationPrevTrigger, 
    PaginationNextTrigger 
} from "@components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const StudentsPage = () => {
    const { data: students = [], isLoading: loading } = StudentHook.useStudents();
    const addMutation = StudentHook.useAddStudent();
    const updateMutation = StudentHook.useUpdateStudent();
    const bulkDeleteMutation = StudentHook.useBulkDeleteStudents();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [selectedProgram, setSelectedProgram] = useState("all");
    const [selectedSession, setSelectedSession] = useState("all");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const filteredStudents = useMemo(() => {
        let filtered = students;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (s) =>
                    s.fullName.toLowerCase().includes(q) ||
                    s.surname.toLowerCase().includes(q) ||
                    (s.otherName && s.otherName.toLowerCase().includes(q)) ||
                    s.email.toLowerCase().includes(q) ||
                    (s.registrationNo && s.registrationNo.toLowerCase().includes(q)) ||
                    (s.matricNumber && s.matricNumber.toLowerCase().includes(q)) ||
                    (s.phone && s.phone.toLowerCase().includes(q))
            );
        }

        if (selectedLevel !== "all") {
            filtered = filtered.filter((s) => s.level === selectedLevel);
        }

        return filtered;
    }, [students, searchQuery, selectedLevel, selectedProgram, selectedSession]);

    const levels = useMemo(() => {
        const uniqueLevels = Array.from(new Set(students.map((s) => s.level))).filter(Boolean);
        return ["all", ...uniqueLevels].sort();
    }, [students]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedLevel("all");
        setSelectedProgram("all");
        setSelectedSession("all");
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const paginatedStudents = filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedLevel, selectedProgram, selectedSession]);

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        const allIds = filteredStudents.map((s) => s.id);
        const allSelected = allIds.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : allIds);
    };

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveDropdownId(activeDropdownId === id ? null : id);
    };

    const handleExport = () => {
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
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement("a");
        link.href = "/admin/documents/Students_Sample_File.csv";
        link.setAttribute("download", "Students_Sample_File.csv");
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    };

    const handleBulkDownload = async () => {
        if (selectedIds.length === 0) return;
        try {
            const blob = await StudentServices.bulkDownloadStudents(selectedIds);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "students_data.csv");
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            toaster.success({ title: "Download started" });
        } catch {
            // Error toast handled by axios interceptor
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setIdsToDelete(selectedIds);
        setIsDeleteModalOpen(true);
    };

    const selectStyle: React.CSSProperties = {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "13px",
        color: "#475569",
        background: "white",
        outline: "none",
        minWidth: "140px",
        cursor: "pointer",
    };

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
                    <Box as="button" onClick={handleDownloadTemplate} display="flex" alignItems="center" gap="2" px="4" py="2.5" bg="white" border="xs" borderColor="#1D7AD9" color="#1D7AD9" borderRadius="md" fontSize="sm" fontWeight="bold" cursor="pointer" _hover={{ bg: "blue.50" }}>
                        <FileDown size={18} /> Download Sample File
                    </Box>
                    <Box as="button" onClick={() => setShowUpload(true)} display="flex" alignItems="center" gap="2" px="4" py="2.5" bg="white" border="xs" borderColor="#1D7AD9" color="#1D7AD9" borderRadius="md" fontSize="sm" fontWeight="bold" cursor="pointer" _hover={{ bg: "blue.50" }}>
                        <FileUp size={18} /> Upload CSV
                    </Box>
                    <Box as="button" onClick={() => { setStudentToEdit(null); setShowAddForm(true); }} bg="#1D7AD9" color="white" px="6" py="2.5" borderRadius="md" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="bold" cursor="pointer" _hover={{ bg: "blue.700" }} border="none">
                        <Plus size={18} /> Add Students
                    </Box>
                </Flex>
            </Flex>

            {/* Search & Filters Card */}
            <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" p="6" mb="4">
                <Flex alignItems="center" justifyContent="space-between" gap="4" flexWrap="wrap">
                    <Box position="relative" flex="1" maxW="md">
                        <input
                            type="text"
                            placeholder="Search by name, email or student ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: "100%", background: "white", border: "1px solid #e2e8f0", fontSize: "12px", padding: "8px 12px 8px 36px", borderRadius: "8px", outline: "none", color: "#334155" }}
                        />
                        <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="fg.subtle" pointerEvents="none">
                            <Search size={16} />
                        </Box>
                    </Box>
                    <Flex alignItems="center" gap="3" flexWrap="wrap">
                        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} style={selectStyle}>
                            {levels.map((l) => (
                                <option key={l} value={l}>{l === "all" ? "All Levels" : l}</option>
                            ))}
                        </select>
                        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} style={selectStyle}>
                            <option value="all">All Programs</option>
                        </select>
                        <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} style={selectStyle}>
                            <option value="all">All Sessions</option>
                        </select>
                        <Box as="button" onClick={clearFilters} display="flex" alignItems="center" gap="2" px="6" py="2" bg="white" border="xs" borderColor="border.muted" borderRadius="md" fontSize="xs" fontWeight="semibold" color="fg.muted" cursor="pointer" _hover={{ bg: "slate.50" }}>
                            <X size={16} /> Clear Filters
                        </Box>
                    </Flex>
                </Flex>
            </Box>

            {/* Export Table header */}
            <Flex alignItems="center" justifyContent="space-between" mb="4">
                <Text fontSize="lg" fontWeight="bold" color="fg.muted">Students ({filteredStudents.length})</Text>
                <Box as="button" onClick={handleExport} display="flex" alignItems="center" gap="2" px="4" py="2" bg="white" border="xs" borderColor="border.muted" borderRadius="md" fontSize="xs" fontWeight="semibold" color="fg.muted" cursor="pointer" _hover={{ bg: "slate.50" }}>
                    <Download size={16} color="#94a3b8" /> Export Table
                </Box>
            </Flex>

            {/* Table */}
            {loading ? (
                <Flex alignItems="center" justifyContent="center" minH="400px">
                    <Flex direction="column" alignItems="center" gap="4">
                        <Spinner size="xl" color="blue.500" borderWidth="3px" />
                        <Text color="fg.muted">Loading students...</Text>
                    </Flex>
                </Flex>
            ) : paginatedStudents.length === 0 ? (
                <EmptyState.Root>
                    <EmptyState.Content>
                        <EmptyState.Indicator>
                            <GraduationCap />
                        </EmptyState.Indicator>
                        <EmptyState.Title>No Students Found</EmptyState.Title>
                        <EmptyState.Description>
                            Try changing your search or filter criteria
                        </EmptyState.Description>
                    </EmptyState.Content>
                </EmptyState.Root>
            ) : (
                <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" overflow="hidden" maxW={{ base: "100%", lg: "calc(100vw - 340px)" }}>
                    <Box overflowX="auto">
                        <Box as="table" w="full" textAlign="left">
                            <Box as="thead">
                                <Box as="tr" bg="slate.50" borderY="xs" borderColor="border.muted" fontSize="11px" fontWeight="semibold" color="fg.muted" textTransform="uppercase" whiteSpace="nowrap">
                                    <Box as="th" bg="slate.50" px="6" py="4" w="12" textAlign="center" position="sticky" left="0" zIndex="20">
                                        <input
                                            type="checkbox"
                                            checked={filteredStudents.length > 0 && selectedIds.length > 0 && selectedIds.length === filteredStudents.length}
                                            onChange={toggleSelectAll}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">Reg No.</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">Mat. No.</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">First Name</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">Other Names</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="200px">Email</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="140px">Phone No</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="100px">Gender</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">Admission Mode</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">Entry Qualification</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">Faculty</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">Department</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="100px">Level</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">Degree Course</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="120px">Course Duration</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="150px">Degree Award Code</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" minW="100px">Status</Box>
                                    <Box as="th" bg="slate.50" px="6" py="4" textAlign="right" pr="12" position="sticky" right="0" zIndex="20">Action</Box>
                                </Box>
                            </Box>
                            <Box as="tbody" fontSize="xs">
                                {paginatedStudents.map((s) => (
                                    <Box as="tr" key={s.id} _hover={{ bg: "slate.50" }} borderBottom="xs" borderColor="border.muted" bg={selectedIds.includes(s.id) ? "blue.50" : undefined} cursor="pointer" whiteSpace="nowrap">
                                        <Box as="td" px="6" py="5" textAlign="center" position="sticky" left="0" zIndex="10" bg={selectedIds.includes(s.id) ? "blue.50" : "white"} borderBottom="xs" borderColor="border.muted">
                                            <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelection(s.id)} onClick={(e) => e.stopPropagation()} style={{ cursor: "pointer" }} />
                                        </Box>
                                        <Box as="td" px="6" py="5" color="fg.subtle" fontWeight="medium">{s.registrationNo || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.matricNumber || "—"}</Box>
                                        <Box as="td" px="6" py="5" fontWeight="bold" color="fg.muted">{s.surname}</Box>
                                        <Box as="td" px="6" py="5" fontWeight="medium" color="fg.muted">{s.otherName || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.email}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.phone || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted" textTransform="capitalize">{s.gender || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted" textTransform="capitalize">{s.admissionMode || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.entryQualification || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.faculty || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.department || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.level || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.degreeCourse || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.courseDuration || "—"}</Box>
                                        <Box as="td" px="6" py="5" color="fg.muted">{s.degreeAwarded || "—"}</Box>
                                        <Box as="td" px="6" py="5">
                                            <Text as="span" px="3" py="1" borderRadius="full" fontSize="10px" fontWeight="bold" bg={s.status === "ACTIVE" ? "green.100" : "red.100"} color={s.status === "ACTIVE" ? "green.700" : "red.700"}>
                                                {s.status === "ACTIVE" ? "Active" : "Inactive"}
                                            </Text>
                                        </Box>
                                        <Box as="td" px="6" py="5" textAlign="right" pr="12" position="sticky" right="0" zIndex={activeDropdownId === s.id ? "50" : "10"} bg={selectedIds.includes(s.id) ? "blue.50" : "white"} borderBottom="xs" borderColor="border.muted" ref={dropdownRef}>
                                            <Box position="relative">
                                                <Box as="button" onClick={(e: React.MouseEvent) => toggleDropdown(s.id, e)} p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="fg.subtle">
                                                    <MoreHorizontal size={20} />
                                                </Box>

                                                {activeDropdownId === s.id && (
                                                    <Box position="absolute" right="0" top="8" w="48" bg="white" borderRadius="md" boxShadow="none" border="xs" borderColor="border.muted" zIndex="50" overflow="hidden" textAlign="left">
                                                        <Box p="1">
                                                            <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedStudent(s); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="green.600" _hover={{ bg: "green.50" }} borderRadius="lg" cursor="pointer" border="none" bg="transparent">
                                                                <UserCog size={16} /> Assign Role
                                                            </Box>
                                                            <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setStudentToEdit(s); setShowAddForm(true); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="amber.600" _hover={{ bg: "amber.50" }} borderRadius="lg" cursor="pointer" border="none" bg="transparent">
                                                                <Pencil size={16} /> Edit details
                                                            </Box>
                                                            <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setIdsToDelete([s.id]); setIsDeleteModalOpen(true); setActiveDropdownId(null); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="red.600" _hover={{ bg: "red.50" }} borderRadius="lg" cursor="pointer" border="none" bg="transparent">
                                                                <Trash2 size={16} /> Delete student
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Pagination - separate card below table */}
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
                        size="sm"
                    >
                        <Flex gap="2">
                            <PaginationPrevTrigger />
                            <PaginationItems />
                            <PaginationNextTrigger />
                        </Flex>
                    </PaginationRoot>
                </Flex>
            )}

            {/* Floating Action Bar */}
            {selectedIds.length > 1 && (
                <Flex position="fixed" bottom="8" left="50%" transform="translateX(-50%)" bg="white" px={{ base: "4", md: "6" }} py="3" borderRadius="md" boxShadow="none" border="xs" borderColor="border.muted" alignItems="center" gap={{ base: "3", md: "6" }} zIndex="50" flexWrap="wrap" justifyContent="center" w={{ base: "90%", md: "auto" }}>
                    <Text fontSize="sm" fontWeight="bold" color="fg.muted">{selectedIds.length} items selected</Text>
                    <Box w="px" h="6" bg="fg.subtle" />
                    <Box as="button" onClick={handleBulkDownload} display="flex" alignItems="center" gap="2" bg="#1D7AD9" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" _hover={{ bg: "blue.700" }} cursor="pointer" border="none">
                        <Download size={16} /> Bulk Download
                    </Box>
                    <Box as="button" onClick={handleBulkDelete} display="flex" alignItems="center" gap="2" bg="red.500" color="white" px="4" py="2" borderRadius="lg" fontSize="xs" fontWeight="bold" _hover={{ bg: "red.600" }} cursor="pointer" border="none">
                        <Trash2 size={16} /> Bulk Delete
                    </Box>
                    <Box w="px" h="6" bg="fg.subtle" />
                    <Box as="button" onClick={() => setSelectedIds([])} p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" color="fg.subtle" cursor="pointer" border="none" bg="transparent" title="Unselect all">
                        <X size={20} />
                    </Box>
                </Flex>
            )}

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
                onSubmit={async (data) => {
                    if (studentToEdit) {
                        await updateMutation.mutateAsync({ id: studentToEdit.id, payload: data });
                    } else {
                        await addMutation.mutateAsync({ ...data, type: "STUDENT" });
                    }
                    setShowAddForm(false);
                    setStudentToEdit(null);
                }}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setIdsToDelete([]); }}
                onConfirm={async (reason) => {
                    await bulkDeleteMutation.mutateAsync({ ids: idsToDelete, reason });
                    setIsDeleteModalOpen(false);
                    setIdsToDelete([]);
                    setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
                }}
                title="Delete Students"
                description="This action cannot be undone. This will permanently delete the selected student records from the system."
                itemCount={idsToDelete.length}
            />
        </Box>
    );
};

export default StudentsPage;