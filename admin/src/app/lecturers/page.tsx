import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Plus, FileUp, UserCog, X } from "lucide-react";
import { exportToExcel } from "@utils/excel.util";
import {
  Box, Flex, Text,
  Portal,
  Menu,
  Button,
  Dialog,
} from "@chakra-ui/react";
const LecturersFilters = lazy(() => import("@components/lecturers/LecturersFilters"));
const BulkUploadStaffModal = lazy(() => import("@components/lecturers/BulkUploadStaffModal"));
const AssignCourseModal = lazy(() => import("@components/lecturers/AssignCourseModal"));
const AddStaffForm = lazy(() => import("@components/lecturers/AddStaffForm"));
const LecturersTable = lazy(() => import("@components/lecturers/LecturersTable"));
const LecturersTableActionBar = lazy(() => import("@components/lecturers/LecturersTableActionBar"));
import { StaffHook } from "@hooks/staff.hook";
import type { Staff, CreateLecturerPayload } from "@type/staff.type";
import {
  PaginationRoot,
  PaginationItems,
  PaginationPrevTrigger,
  PaginationNextTrigger
} from "@components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const StaffPage = () => {
  const { data: staffList = [], isLoading: loading } = StaffHook.useStaff();
  const deleteMutation = StaffHook.useDeleteStaff();
  const bulkDeleteMutation = StaffHook.useBulkDeleteStaff();
  const addStaffMutation = StaffHook.useAddStaff();
  const updateStaffMutation = StaffHook.useUpdateStaff();
  const assignCourseMutation = StaffHook.useAssignCourse();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
  const [confirmText, setConfirmText] = useState("");

  // Action modals state
  const [showAssignCourse, setShowAssignCourse] = useState(false);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);

  // Removed fetchStaff and useEffect as TanStack Query handles it now

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const requestSort = useCallback((key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const staffs: Staff[] = useMemo(() => staffList?.data || [] as Staff[], [staffList]);
  const filteredStaff = useMemo(() => {
    let result = staffs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          `${s.staffProfile?.surname || ''} ${s.staffProfile?.firstName || ''} ${s.staffProfile?.otherName || ''}`.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.staffProfile?.staffNumber?.toLowerCase().includes(q)
      );
    }

    if (selectedStatus) {
      result = result.filter(
        (s) => s.status?.toUpperCase() === selectedStatus.toUpperCase()
      );
    }

    if (sortConfig !== null) {
      result = [...result].sort((a, b) => {
        const getValue = (staff: Staff) => {
          // Handle nested staffProfile properties
          const nestedMap: Record<string, string> = {
            'fullName': `${staff.staffProfile?.surname || ''} ${staff.staffProfile?.firstName || ''} ${staff.staffProfile?.otherName || ''}`,
            'staffNumber': staff.staffProfile?.staffNumber || '',
            'phone': staff.staffProfile?.phone || '',
            'department': staff.staffProfile?.department || '',
            'faculty': staff.staffProfile?.faculty || '',
          };
          return nestedMap[sortConfig.key] ?? (staff as unknown as Record<string, unknown>)[sortConfig.key] ?? "";
        };

        const aValue = getValue(a);
        const bValue = getValue(b);

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [staffs, searchQuery, selectedStatus, sortConfig]);

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    const allIds = filteredStaff.map((s) => s.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : allIds);
  }, [filteredStaff, selectedIds]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length === 0) return;
    setConfirmText(`This action cannot be undone. This will permanently delete ${selectedIds.length} selected lecturers and remove their data from our systems.`);
    setConfirmCallback(() => async () => {
      try {
        await bulkDeleteMutation.mutateAsync(selectedIds);
        setSelectedIds([]);
      } catch {
        // Error handled by mutation
      }
    });
    setConfirmOpen(true);
  }, [selectedIds, bulkDeleteMutation]);

  const handleDelete = useCallback((staff: Staff) => {
    const fullName = `${staff.staffProfile?.surname || ''} ${staff.staffProfile?.firstName || ''} ${staff.staffProfile?.otherName || ''}`;
    setConfirmText(`This action cannot be undone. This will permanently delete lecturer "${fullName}" and remove their data from our systems.`);
    setConfirmCallback(() => async () => {
      try {
        await deleteMutation.mutateAsync(staff.id);
      } catch {
        // Error handled by mutation
      }
    });
    setConfirmOpen(true);
  }, [deleteMutation]);

  const handleBulkDownload = useCallback(() => {
    exportToExcel(
      staffs
        .filter((s) => selectedIds.includes(s.id))
        .map((s) => ({
          "Staff ID": s.staffProfile?.staffNumber,
          Name: `${s.staffProfile?.surname || ''} ${s.staffProfile?.firstName || ''} ${s.staffProfile?.otherName || ''}`,
          Email: s.email,
          Phone: s.staffProfile?.phone || "N/A",
          Department: s.staffProfile?.department,
          Faculty: s.staffProfile?.faculty,
          Title: s.staffProfile?.title,
          "Total Assigned Courses": s.staffProfile?.lecturedCourses?.length || 0,
        })),
      "selected_lecturers",
      "Lecturers"
    );
  }, [staffs, selectedIds]);

  const handleAssignCourse = useCallback(async (data: { courseIds: string[]; session: string }) => {
    if (!selectedStaff) return;
    try {
      await assignCourseMutation.mutateAsync({
        courseIds: data.courseIds,
        lecturerId: selectedStaff?.staffProfile?.id || '',
        session: data.session
      });

      setShowAssignCourse(false);
      setSelectedStaff(null);
    } catch {
      // Error handled by mutation
    }
  }, [selectedStaff, assignCourseMutation]);

  const handleAddEditSubmit = useCallback(async (payload: CreateLecturerPayload) => {
    try {
      if (staffToEdit) {
        await updateStaffMutation.mutateAsync({ id: staffToEdit.id, payload });
      } else {
        await addStaffMutation.mutateAsync(payload);
      }
      setShowAddEditForm(false);
      setStaffToEdit(null);
    } catch {
      // Error handled by mutation
    }
  }, [staffToEdit, updateStaffMutation, addStaffMutation]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedStatus("");
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(() => {
    const exportData = filteredStaff.map((s) => ({
      "Staff ID": s.staffProfile?.staffNumber,
      Name: `${s.staffProfile?.surname || ''} ${s.staffProfile?.firstName || ''} ${s.staffProfile?.otherName || ''}`,
      Email: s.email,
      Phone: s.staffProfile?.phone || "N/A",
      Department: s.staffProfile?.department,
      Faculty: s.staffProfile?.faculty,
      Title: s.staffProfile?.title,
      "Total Assigned Courses": s.staffProfile?.lecturedCourses?.length || 0,
    }));
    exportToExcel(exportData, "Lecturers_List", "Lecturers");
  }, [filteredStaff]);

  return (
    <Box w="full" overflow="hidden">
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
                flexShrink={0}
                bg="accent"
                color="white"
                cursor="pointer"
                border="none"
                display="flex"
                alignItems="center"
                borderRadius="md"
              >
                <Plus size={16} /> Add Lecturer
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
                      setStaffToEdit(null);
                      setShowAddEditForm(true);
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
                    onClick={() => setShowUploadModal(true)}
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
        <Suspense fallback={<Box p="8" textAlign="center">Loading lecturers...</Box>}>
          <LecturersFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            clearFilters={clearFilters}
            handleExport={handleExport}
            setCurrentPage={setCurrentPage}
            isExportDisabled={filteredStaff.length === 0}
          />

          <LecturersTable
            paginatedStaff={paginatedStaff}
            filteredStaffLength={filteredStaff.length}
            selectedIds={selectedIds}
            loading={loading}
            sortConfig={sortConfig}
            requestSort={requestSort}
            toggleSelectAll={toggleSelectAll}
            toggleSelection={toggleSelection}
            handleDelete={handleDelete}
            setSelectedStaff={setSelectedStaff}
            setStaffToEdit={setStaffToEdit}
            setShowAssignCourse={setShowAssignCourse}
            setShowAddEditForm={setShowAddEditForm}
            searchQuery={searchQuery}
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
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredStaff.length)} of{" "}
              {filteredStaff.length} lecturers
            </Text>
            <PaginationRoot
              count={filteredStaff.length}
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
        <LecturersTableActionBar
          selectedIds={selectedIds}
          clearSelection={() => setSelectedIds([])}
          handleBulkDownload={handleBulkDownload}
          handleBulkDelete={handleBulkDelete}
        />

        <BulkUploadStaffModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploaded={() => {
            setShowUploadModal(false);
          }}
        />

        <AssignCourseModal
          isOpen={showAssignCourse}
          onClose={() => { setShowAssignCourse(false); setSelectedStaff(null); }}
          onAssign={handleAssignCourse}
          staffName={`${selectedStaff?.staffProfile?.surname || ''} ${selectedStaff?.staffProfile?.firstName || ''} ${selectedStaff?.staffProfile?.otherName || ''}`}
        />

        <AddStaffForm
          isOpen={showAddEditForm}
          onClose={() => { setShowAddEditForm(false); setStaffToEdit(null); }}
          onSubmit={handleAddEditSubmit}
          initialData={staffToEdit}
        />
      </Suspense>

      <Dialog.Root open={confirmOpen} onOpenChange={(e) => setConfirmOpen(e.open)} role="alertdialog" placement="center" closeOnInteractOutside={false}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="white" borderRadius="md" maxW="md" p="6" position="relative" colorPalette="accent">
            <Dialog.CloseTrigger asChild>
              <Button onClick={() => setConfirmOpen(false)} position="absolute" variant="ghost" size="lg" colorPalette="gray">
                <X size={20} />
              </Button>
            </Dialog.CloseTrigger>

            <Dialog.Header p="0" mb="3">
              <Dialog.Title fontSize="lg" fontWeight="bold" color="fg.muted">
                Are you sure?
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body p="0" mb="6">
              <Text fontSize="sm" color="fg.muted">
                {confirmText}
              </Text>
            </Dialog.Body>

            <Dialog.Footer p="0" display="flex" justifyContent="flex-end" gap="3">
              <Button onClick={() => setConfirmOpen(false)} size="xl" variant="outline" borderColor="border.muted" color="fg.muted" bg="white" _hover={{ bg: "slate.50" }}>
                Cancel
              </Button>
              <Button onClick={() => { confirmCallback?.(); setConfirmOpen(false); }} size="xl" bg="red.500" color="white" _hover={{ bg: "red.600" }}>
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};

export default StaffPage;