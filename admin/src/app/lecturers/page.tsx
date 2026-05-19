import { useState, useMemo, useCallback } from "react";
import { Plus, FileUp, MoreHorizontal, UserCog, Pencil, Trash2, Download, X, Users, Search } from "lucide-react";
import { exportToExcel } from "@utils/excel.util";
import {
  Box, Flex, Text, Input, Spinner,
  Portal,
  EmptyState,
  Menu,
  InputGroup,
  Button,
  VStack,
  Table,
  Dialog,
  Badge,
  Checkbox,
  Popover,
  ActionBar,
  CloseButton
} from "@chakra-ui/react";
import BulkUploadStaffModal from "@components/lecturers/BulkUploadStaffModal";
import AssignCourseModal from "@components/lecturers/AssignCourseModal";
import AddStaffForm from "@components/lecturers/AddStaffForm";
import { StaffHook } from "@hooks/staff.hook";
import type { Staff } from "@type/staff.type";
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
  const [staffToEdit, setStaffToEdit] = useState<any>(null);

  // Removed fetchStaff and useEffect as TanStack Query handles it now

  const filteredStaff = useMemo(() => {
    let result = staffList;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.staffNumber?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [staffList, searchQuery]);

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
      } catch (err) {
        // Error handled by mutation
      }
    });
    setConfirmOpen(true);
  }, [selectedIds, bulkDeleteMutation]);

  const handleDelete = useCallback((staff: Staff) => {
    setConfirmText(`This action cannot be undone. This will permanently delete lecturer "${staff.fullName}" and remove their data from our systems.`);
    setConfirmCallback(() => async () => {
      try {
        await deleteMutation.mutateAsync(staff.id);
      } catch (err) {
        // Error handled by mutation
      }
    });
    setConfirmOpen(true);
  }, [deleteMutation]);

  const handleAssignCourse = useCallback(async (data: { courseIds: string[]; session: string }) => {
    if (!selectedStaff) return;
    try {
      await Promise.all(
        data.courseIds.map((courseId) =>
          assignCourseMutation.mutateAsync({
            courseId,
            lecturerId: selectedStaff.id,
            session: data.session
          })
        )
      );
      setShowAssignCourse(false);
      setSelectedStaff(null);
    } catch (err) {
      // Error handled by mutation
    }
  }, [selectedStaff, assignCourseMutation]);

  const handleAddEditSubmit = useCallback(async (payload: any) => {
    try {
      if (staffToEdit) {
        await updateStaffMutation.mutateAsync({ id: staffToEdit.id, payload });
      } else {
        await addStaffMutation.mutateAsync(payload);
      }
      setShowAddEditForm(false);
      setStaffToEdit(null);
    } catch (err) {
      // Error handled by mutation
    }
  }, [staffToEdit, updateStaffMutation, addStaffMutation]);

  // const clearFilters = () => {
  //   setSearchQuery("");
  //   setFilterDepartment("");
  //   setFilterRank("");
  //   setCurrentPage(1);
  // };

  return (
    <Box maxW={{ base: "100%", lg: "calc(100vw - 340px)" }}>
      <Box mb="6">
        <Text fontSize="2xl" fontWeight="bold" color="fg.muted">Lecturers</Text>
        <Text fontSize="sm" color="fg.subtle">Manage department lecturers and their roles</Text>
      </Box>
      <Flex justifyContent="space-between" gap="3" flexWrap="wrap" alignItems="center" w="full" mb="6">
        <InputGroup startElement={<Search size={20} color="#94a3b8" />} flex="1" maxW={{ base: "full", md: "400px" }}>
          <Input
            size="xl"
            placeholder="Search by name, email or staff ID"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            bg="white"
            border="1px"
            borderColor="border.muted"
            borderRadius="md"
            w="full"
            _focus={{ borderColor: "accent", boxShadow: "none" }}
          />
        </InputGroup>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button size="xl" flexShrink={0} bg="accent" color="white" cursor="pointer" border="none" display="flex" alignItems="center" borderRadius="md">
              <Plus size={16} /> Add Lecturer
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content bg="white" borderRadius="md" boxShadow="none" border="xs" borderColor="border.muted" minW="150px" overflow="hidden" py="1" zIndex="popover">
                <Menu.Item value="single" asChild>
                  <Box as="button" onClick={() => { setStaffToEdit(null); setShowAddEditForm(true); }} w="full" textAlign="left" px="4" py="2.5" fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ bg: "slate.50" }} cursor="pointer" border="none" bg="transparent" display="flex" alignItems="center" gap="2">
                    <UserCog size={16} /> Single
                  </Box>
                </Menu.Item>
                <Menu.Item value="bulk" asChild>
                  <Box as="button" onClick={() => setShowUploadModal(true)} w="full" textAlign="left" px="4" py="2.5" fontSize="sm" fontWeight="medium" color="fg.muted" _hover={{ bg: "slate.50" }} cursor="pointer" border="none" bg="transparent" display="flex" alignItems="center" gap="2">
                    <FileUp size={16} /> Bulk
                  </Box>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>

      {/* Table */}
      <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" overflow="hidden">
        <Box overflowX="auto">
          <Table.Root w="full" textAlign="left" variant="outline" interactive>
            <Table.Header bg="slate.50">
              <Table.Row borderY="xs" borderColor="border.muted">
                <Table.ColumnHeader bg="slate.50" px="6" py="4" w="12" textAlign="center" position="sticky" left="0" zIndex="20" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">
                  <Checkbox.Root
                    variant="outline"
                    checked={filteredStaff.length > 0 && selectedIds.length > 0 && selectedIds.length === filteredStaff.length}
                    onCheckedChange={toggleSelectAll}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Staff ID</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Name</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="200px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Email</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="140px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Phone No</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Department</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="150px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Rank</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" minW="200px" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Course(s)</Table.ColumnHeader>
                <Table.ColumnHeader bg="slate.50" px="6" py="4" textAlign="right" pr="12" position="sticky" right="0" zIndex="20" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body fontSize="xs">
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={9} py="12" textAlign="center">
                    <Flex direction="column" alignItems="center" gap="4">
                      <Spinner size="xl" color="blue.500" borderWidth="3px" />
                      <Text color="fg.muted">Loading lecturers...</Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ) : paginatedStaff.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={9} py="12">
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <Users />
                            </EmptyState.Indicator>
                            <VStack textAlign="center">
                                <EmptyState.Title>No Lecturers Found</EmptyState.Title>
                                <EmptyState.Description>
                                    {searchQuery ? "Try adjusting your search criteria" : "Add a new lecturer to get started"}
                                </EmptyState.Description>
                            </VStack>
                            {!searchQuery && (
                                <Button onClick={() => { setStaffToEdit(null); setShowAddEditForm(true); }} size="xl" bg="accent" color="white" px="6">
                                    Add Lecturer
                                </Button>
                            )}
                        </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedStaff.map((s) => (
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
                    <Table.Cell px="6" py="5" fontWeight="bold" color="fg.muted">{s.staffNumber}</Table.Cell>
                    <Table.Cell px="6" py="5" fontWeight="bold" color="fg.muted">{s.fullName}</Table.Cell>
                    <Table.Cell px="6" py="5" color="fg.muted">{s.email}</Table.Cell>
                    <Table.Cell px="6" py="5" color="fg.muted">{s.phone || "—"}</Table.Cell>
                    <Table.Cell px="6" py="5" color="fg.muted">{s.department}</Table.Cell>
                    <Table.Cell px="6" py="5" color="fg.muted">{s.level}</Table.Cell>
                    <Table.Cell px="6" py="5">
                      <Flex gap="1.5" wrap="wrap" maxW="200px">
                        {s.courses?.split(", ").map((course, idx) => (
                          <Badge key={idx} px="2" py="1" fontSize="10px" fontWeight="bold" textAlign="center" minW={course === "N/A" ? "60px" : "auto"} bg={course === "N/A" ? "gray.50" : "green.50"} color={course === "N/A" ? "gray.600" : "green.600"}>
                            {course}
                          </Badge>
                        ))}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell px="6" py="5" textAlign="right" pr="12" position="sticky" right="0" zIndex="10" bg={selectedIds.includes(s.id) ? "blue.50" : "white"} borderBottom="xs" borderColor="border.muted">
                      <Popover.Root positioning={{ placement: "bottom-end" }}>
                        <Popover.Trigger asChild>
                          <Box as="button" onClick={(e: React.MouseEvent) => e.stopPropagation()} p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="fg.subtle">
                            <MoreHorizontal size={20} />
                          </Box>
                        </Popover.Trigger>
                        <Portal>
                          <Popover.Positioner zIndex="popover">
                            <Popover.Content bg="white" borderRadius="md" boxShadow="md" border="xs" borderColor="border.muted" w="48" overflow="hidden" outline="none">
                              <Popover.Body p="1">
                                <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedStaff(s); setShowAssignCourse(true); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="green.600" _hover={{ bg: "green.50" }} borderRadius="md" cursor="pointer" border="none" bg="transparent">
                                  <UserCog size={16} /> Assign Course
                                </Box>
                                <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setStaffToEdit(s); setShowAddEditForm(true); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="amber.600" _hover={{ bg: "amber.50" }} borderRadius="md" cursor="pointer" border="none" bg="transparent">
                                  <Pencil size={16} /> Edit details
                                </Box>
                                <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(s); }} w="full" display="flex" alignItems="center" gap="2" px="3" py="2" fontSize="sm" fontWeight="medium" color="red.600" _hover={{ bg: "red.50" }} borderRadius="md" cursor="pointer" border="none" bg="transparent">
                                  <Trash2 size={16} /> Delete Lecturer
                                </Box>
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
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredStaff.length)} of {filteredStaff.length} lecturers
              </Text>
              <PaginationRoot 
                  count={filteredStaff.length} 
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
                onClick={() => { exportToExcel(staffList.filter((s) => selectedIds.includes(s.id)).map((s) => ({ "Staff ID": s.staffNumber, Name: s.fullName, Email: s.email, Phone: s.phone || "N/A", Department: s.department, Level: s.level, Courses: s.courses })), "selected_lecturers", "Lecturers"); }} 
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
        staffName={selectedStaff?.fullName}
      />

      <AddStaffForm
        isOpen={showAddEditForm}
        onClose={() => { setShowAddEditForm(false); setStaffToEdit(null); }}
        onSubmit={handleAddEditSubmit}
        initialData={staffToEdit}
      />

      <Dialog.Root open={confirmOpen} onOpenChange={(e) => setConfirmOpen(e.open)} role="alertdialog" placement="center" closeOnInteractOutside={false}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="white" borderRadius="md" maxW="md" p="6" position="relative" colorPalette="accent">
            <Dialog.CloseTrigger asChild>
              <Box as="button" onClick={() => setConfirmOpen(false)} position="absolute" top="4" right="4" p="1" _hover={{ bg: "slate.50" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="fg.subtle">
                <X size={20} />
              </Box>
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