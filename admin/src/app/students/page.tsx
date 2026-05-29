import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import {
  Plus,
  FileUp,
  UserCog,
} from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import {
  Box,
  Flex,
  Text,
  Portal,
  Button,
  Menu,
} from "@chakra-ui/react";
const BulkUploadStudentsModal = lazy(() => import("@components/students/BulkUploadStudentsModal"));
const StudentDetailsSidebar = lazy(() => import("@components/students/StudentDetailsSidebar"));
const AddStudentForm = lazy(() => import("@components/students/AddStudentForm"));
const DeleteConfirmationModal = lazy(() => import("@components/students/DeleteConfirmationModal"));
import { StudentHook } from "@hooks/student.hook";
import type { Student, CreateStudentPayload } from "@type/student.type";
import type { StudentFormData } from "@schemas/student.schema";
import {
  PaginationRoot,
  PaginationItems,
  PaginationPrevTrigger,
  PaginationNextTrigger,
} from "@components/ui/pagination";

const ITEMS_PER_PAGE = 20;

const StudentsFilters = lazy(() => import("@components/students/StudentsFilters"));
const StudentsTable = lazy(() => import("@components/students/StudentsTable"));
const StudentsTableActionBar = lazy(() => import("@components/students/StudentsTableActionBar"));

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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const requestSort = useCallback(
    (key: string) => {
      let direction: "asc" | "desc" = "asc";
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "asc"
      ) {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig],
  );



  const apiFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    if (selectedStatus) filters.status = selectedStatus;
    if (selectedLevel) filters.level = selectedLevel;
    if (selectedSession) filters.session = selectedSession;
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [selectedStatus, selectedLevel, selectedSession]);

  const { data: students = [], isLoading: loading } =
    StudentHook.useStudents(apiFilters);
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
        (s.phone && s.phone.toLowerCase().includes(q)),
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
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return direction === "asc"
          ? valA > valB
            ? 1
            : -1
          : valA < valB
            ? 1
            : -1;
      }
    });
  }, [filteredStudents, sortConfig]);

  const totalPages = Math.ceil(
    sortedAndFilteredStudents.length / ITEMS_PER_PAGE,
  );
  const paginatedStudents = sortedAndFilteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const handleSingleDelete = useCallback((id: string) => {
    setIdsToDelete([id]);
    setIsDeleteModalOpen(true);
  }, []);



  const toggleSelectAll = useCallback(() => {
    const allIds = filteredStudents.map((s) => s.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : allIds);
  }, [filteredStudents, selectedIds]);

  const handleExport = useCallback(() => {
    const exportData = filteredStudents.map((s) => ({
      "Full Name": s.fullName,
      Email: s.email,
      "Reg No": s.registrationNo || "—",
      "Mat No": s.matricNumber || "—",
      Surname: s.surname,
      "Other Name": s.otherName || "—",
      Phone: s.phone || "—",
      Gender: s.gender || "—",
      Faculty: s.faculty || "—",
      Level: s.level ? s.level.replace(/^L/i, '') : "—",
      "Admission Mode": s.admissionMode || "—",
      "Entry Qualification": s.entryQualification || "—",
      "Degree Course": s.degreeCourse || "—",
      "Program Duration": s.courseDuration || "—",
      "Degree Awarded": s.degreeAwarded || "—",
    }));
    exportToExcel(exportData, "Students_List", "Students");
    toaster.success({ title: "Exported successfully" });
  }, [filteredStudents]);

  const handleBulkDownload = useCallback(async () => {
    if (selectedIds.length === 0) return;
    try {
      const blob = (await bulkDownloadMutation.mutateAsync(
        selectedIds,
      )) as unknown as Blob;
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

  const handleAddEditSubmit = useCallback(
    async (data: StudentFormData) => {
      if (studentToEdit) {
        await updateMutation.mutateAsync({
          id: studentToEdit.id,
          payload: data,
        });
      } else {
        await addMutation.mutateAsync({ ...data, type: "STUDENT" } as CreateStudentPayload);
      }
      setShowAddForm(false);
      setStudentToEdit(null);
    },
    [studentToEdit, updateMutation, addMutation],
  );

  const handleConfirmDelete = useCallback(
    async (reason: string) => {
      await bulkDeleteMutation.mutateAsync({ ids: idsToDelete, reason });
      setIsDeleteModalOpen(false);
      setIdsToDelete([]);
      setSelectedIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
    },
    [idsToDelete, bulkDeleteMutation],
  );

  return (
    <Box overflow="hidden">
      {/* Header */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="flex-end"
        alignItems={{ base: "flex-start", md: "center" }}
        mb="10"
        gap="4"
      >
        <Flex alignItems="center" gap="3" flexWrap="wrap">
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                size="xl"
                variant="solid"
                flexShrink={0}
                bg="accent"
                color="white"
                display="flex"
                alignItems="center"
                borderRadius="md"
              >
                <Plus size={16} /> Add Student
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content
                  bg="white"
                  borderRadius="md"
                  boxShadow="none"
                  border="xs"
                  borderColor="border.muted"
                  minW="150px"
                  overflow="hidden"
                  py="1"
                  zIndex="popover"
                >
                  <Menu.Item 
                    value="single"
                    onClick={() => {
                      setStudentToEdit(null);
                      setShowAddForm(true);
                    }}
                    cursor="pointer"
                    px="4"
                    py="2.5"
                    fontSize="sm"
                    fontWeight="medium"
                    color="fg.muted"
                    _hover={{ bg: "slate.50" }}
                  >
                    <UserCog size={16} /> Single
                  </Menu.Item>
                  <Menu.Item 
                    value="bulk"
                    onClick={() => setShowUpload(true)}
                    cursor="pointer"
                    px="4"
                    py="2.5"
                    fontSize="sm"
                    fontWeight="medium"
                    color="fg.muted"
                    _hover={{ bg: "slate.50" }}
                  >
                    <FileUp size={16} /> Bulk
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Flex>

      {/* Table Card (Contains Search, Filters, and Table) */}
      <Box
        bg="white"
        borderRadius="md"
        border="xs"
        borderColor="border.muted"
        overflow="hidden"
        mt="-4"
      >
        <Suspense fallback={<Box p="8" textAlign="center">Loading students...</Box>}>
          <StudentsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            selectedSession={selectedSession}
            setSelectedSession={setSelectedSession}
            clearFilters={clearFilters}
            handleExport={handleExport}
            setCurrentPage={setCurrentPage}
            isExportDisabled={filteredStudents.length === 0}
          />

          <StudentsTable
            paginatedStudents={paginatedStudents}
            filteredStudentsLength={filteredStudents.length}
            selectedIds={selectedIds}
            loading={loading}
            sortConfig={sortConfig}
            requestSort={requestSort}
            toggleSelectAll={toggleSelectAll}
            toggleSelection={toggleSelection}
            handleSingleDelete={handleSingleDelete}
            setSelectedStudent={setSelectedStudent}
            setStudentToEdit={setStudentToEdit}
            setShowAddForm={setShowAddForm}
          />
        </Suspense>

        {totalPages > 1 && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            p="4"
            bg="white"
            borderTop="xs"
            borderColor="border.muted"
          >
            <Text fontSize="sm" color="fg.muted">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)}{" "}
              of {filteredStudents.length} students
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

      <Suspense fallback={null}>
        <StudentsTableActionBar
          selectedIds={selectedIds}
          clearSelection={() => setSelectedIds([])}
          handleBulkDownload={handleBulkDownload}
          handleBulkDelete={handleBulkDelete}
        />

        <BulkUploadStudentsModal
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onUploaded={() => {
            setShowUpload(false);
          }}
        />

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
          onClose={() => {
            setShowAddForm(false);
            setStudentToEdit(null);
          }}
          onSubmit={handleAddEditSubmit}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setIdsToDelete([]);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Students"
          description="This action cannot be undone. This will permanently delete the selected student records from the system."
          itemCount={idsToDelete.length}
        />
      </Suspense>
    </Box>
  );
};

export default StudentsPage;
