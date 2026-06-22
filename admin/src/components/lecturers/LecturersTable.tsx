import React, { useMemo, useCallback, useState } from "react";
import {
  Table,
  Checkbox,
  Button,
  Flex,
  Skeleton,
  VStack,
  Popover,
  Portal,
  EmptyState,
  Badge
} from "@chakra-ui/react";
import {
  MoreHorizontal,
  UserCog,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
} from "lucide-react";
import type { Staff } from "@type/staff.type";
import AssignedCoursesDrawer from "./assigned-courses-drawer";

interface LecturersTableProps {
  paginatedStaff: Staff[];
  filteredStaffLength: number;
  selectedIds: string[];
  loading: boolean;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  requestSort: (key: string) => void;
  toggleSelectAll: () => void;
  toggleSelection: (id: string) => void;
  handleDelete: (staff: Staff) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  setStaffToEdit: (staff: Staff | null) => void;
  setShowAssignCourse: (show: boolean) => void;
  setShowAddEditForm: (show: boolean) => void;
  searchQuery?: string;
}

const LecturersTable = ({
  paginatedStaff,
  filteredStaffLength,
  selectedIds,
  loading,
  sortConfig,
  requestSort,
  toggleSelectAll,
  toggleSelection,
  handleDelete,
  setSelectedStaff,
  setStaffToEdit,
  setShowAssignCourse,
  setShowAddEditForm,
  searchQuery,
}: LecturersTableProps) => {
  const renderSortIcon = useCallback(
    (key: string) => {
      if (!sortConfig || sortConfig.key !== key) {
        return (
          <ArrowUpDown
            size={14}
            style={{
              marginLeft: "6px",
              display: "inline-block",
              verticalAlign: "middle",
              opacity: 0.5,
            }}
          />
        );
      }
      if (sortConfig.direction === "asc") {
        return (
          <ArrowUp
            size={14}
            style={{
              marginLeft: "6px",
              display: "inline-block",
              verticalAlign: "middle",
            }}
            color="#1D7AD9"
          />
        );
      }
      return (
        <ArrowDown
          size={14}
          style={{
            marginLeft: "6px",
            display: "inline-block",
            verticalAlign: "middle",
          }}
          color="#1D7AD9"
        />
      );
    },
    [sortConfig]
  );

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const memoizedTableRows = useMemo(() => {
    return paginatedStaff.map((s) => (
      <Table.Row
        key={s.id}
        _hover={{ bg: "slate.50" }}
        cursor="pointer"
        whiteSpace="nowrap"
      >
        <Table.Cell
          textAlign="center"
          position="sticky"
          left="0"
          zIndex={1}
          bg="white"
          borderRight="1px solid"
          borderColor="border.muted"
        >
          <Checkbox.Root
            checked={selectedIds.includes(s.id)}
            onCheckedChange={() => toggleSelection(s.id)}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>
        </Table.Cell>
        <Table.Cell fontWeight="medium">
          {s.staffProfile?.staffNumber || "—"}
        </Table.Cell>
        <Table.Cell fontWeight="bold">
          {`${s.staffProfile?.surname || ''} ${s.staffProfile?.firstName || ''} ${s.staffProfile?.otherName || ''}`}
        </Table.Cell>
        <Table.Cell textTransform="capitalize">
          {s.staffProfile?.gender?.toLowerCase() || "—"}
        </Table.Cell>
        <Table.Cell>
          {s.email}
        </Table.Cell>
        <Table.Cell>
          {s.staffProfile?.phone || "—"}
        </Table.Cell>
        <Table.Cell>
          {s.staffProfile?.department || "—"}
        </Table.Cell>
        <Table.Cell>
          {s.staffProfile?.title || "—"}
        </Table.Cell>
        <Table.Cell>
          <Flex gap="1.5" wrap="wrap" maxW="150px">
            {s.staffProfile?.staffRoles?.map((role, idx) => (
              <Badge
                key={idx}
                px="2"
                py="1"
                fontSize="10px"
                fontWeight="bold"
                textAlign="center"
                bg="gray.100"
                color="gray.600"
              >
                {role.replace("_", " ")}
              </Badge>
            ))}
          </Flex>
        </Table.Cell>
        <Table.Cell>
          <Badge
            px="2"
            py="1"
            fontSize="10px"
            fontWeight="bold"
            textAlign="center"
            bg={s.status?.toUpperCase() === "ACTIVE" ? "green.50" : "red.50"}
            color={s.status?.toUpperCase() === "ACTIVE" ? "green.600" : "red.600"}
          >
            {s.status}
          </Badge>
        </Table.Cell>
        <Table.Cell>
          <AssignedCoursesDrawer
            lecturedCourses={s.staffProfile!.lecturedCourses}
            staffName={[s.staffProfile?.surname, s.staffProfile?.firstName,s.staffProfile?.otherName].filter(Boolean).join(" ")}
          />
        </Table.Cell>
        <Table.Cell
          textAlign="right"
          position="sticky"
          right="0"
          zIndex={1}
          bg="white"
          borderLeft="1px solid"
          borderColor="border.muted"
        >
          <Popover.Root
            positioning={{ placement: "bottom-end" }}
            open={openPopoverId === s.id}
            onOpenChange={(e) => setOpenPopoverId(e.open ? s.id : null)}
          >
            <Popover.Trigger asChild>
              <Button
                variant="ghost"
                size="md"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                px="0"
                color="fg.subtle"
              >
                <MoreHorizontal size={20} />
              </Button>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner zIndex="popover">
                <Popover.Content
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  border="xs"
                  borderColor="border.muted"
                  w="48"
                  overflow="hidden"
                  outline="none"
                >
                  <Popover.Body p="1">
                    <Button
                      variant="ghost"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setOpenPopoverId(null);
                        setSelectedStaff(s);
                        setShowAssignCourse(true);
                      }}
                      w="full"
                      justifyContent="flex-start"
                      size="sm"
                    >
                      <UserCog size={16} /> Assign Course
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setOpenPopoverId(null);
                        setStaffToEdit(s);
                        setShowAddEditForm(true);
                      }}
                      w="full"
                      justifyContent="flex-start"
                      size="sm"
                    >
                      <Pencil size={16} /> Edit details
                    </Button>
                    <Button
                      variant="ghost"
                      colorPalette="red"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setOpenPopoverId(null);
                        handleDelete(s);
                      }}
                      w="full"
                      justifyContent="flex-start"
                      size="sm"
                    >
                      <Trash2 size={16} /> Delete Lecturer
                    </Button>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </Table.Cell>
      </Table.Row>
    ));
  }, [
    paginatedStaff,
    selectedIds,
    toggleSelection,
    handleDelete,
    setSelectedStaff,
    setStaffToEdit,
    setShowAssignCourse,
    setShowAddEditForm,
    openPopoverId,
    setOpenPopoverId,
  ]);

  return (
    <Table.ScrollArea
      maxW={{ base: "xl", md: "full" }}
      maxH="calc(100vh - 240px)"
    >
      <Table.Root
        stickyHeader
        w="full"
        variant="outline"
        interactive
        size="lg"
        colorPalette="accent"
      >
        <Table.Header position="sticky" top="0" zIndex={10}>
          <Table.Row bg="bg.muted">
            <Table.ColumnHeader
              position="sticky"
              left="0"
              zIndex={11}
              bg="bg.muted"
              borderRight="xs"
              borderColor="border.muted"
              w="12"
              textAlign="center"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Checkbox.Root
                checked={
                  filteredStaffLength > 0 &&
                  selectedIds.length > 0 &&
                  selectedIds.length === filteredStaffLength
                }
                onCheckedChange={toggleSelectAll}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("staffNumber")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Staff ID {renderSortIcon("staffNumber")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("fullName")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Name {renderSortIcon("fullName")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("gender")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Gender {renderSortIcon("gender")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("email")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Email {renderSortIcon("email")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("phone")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Phone No {renderSortIcon("phone")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("department")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Department {renderSortIcon("department")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("title")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Title {renderSortIcon("title")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader 
              bg="bg.muted"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Roles
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("status")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Status {renderSortIcon("status")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader 
              bg="bg.muted"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Course(s)
            </Table.ColumnHeader>
            <Table.ColumnHeader
              textAlign="right"
              position="sticky"
              right="0"
              zIndex={11}
              bg="bg.muted"
              borderLeft="xs"
              borderColor="border.muted"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Action
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body fontSize="sm">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Table.Row key={i}>
                <Table.Cell
                  position="sticky"
                  left="0"
                  zIndex={1}
                  bg="white"
                  borderRight="1px solid"
                  borderColor="border.muted"
                >
                  <Skeleton h="4" w="4" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton h="4" w="full" />
                </Table.Cell>
                <Table.Cell
                  position="sticky"
                  right="0"
                  zIndex={1}
                  bg="white"
                  borderLeft="1px solid"
                  borderColor="border.muted"
                >
                  <Skeleton h="4" w="4" ml="auto" />
                </Table.Cell>
              </Table.Row>
            ))
          ) : paginatedStaff.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={12} py="12">
                <EmptyState.Root>
                  <EmptyState.Content>
                    <EmptyState.Indicator>
                      <Users />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                      <EmptyState.Title>No Lecturers Found</EmptyState.Title>
                      <EmptyState.Description>
                        {searchQuery
                          ? "Try adjusting your search criteria"
                          : "Add a new lecturer to get started"}
                      </EmptyState.Description>
                    </VStack>
                    {!searchQuery && (
                      <Button
                        onClick={() => {
                          setStaffToEdit(null);
                          setShowAddEditForm(true);
                        }}
                        size="xl"
                        bg="accent"
                        color="white"
                        px="6"
                      >
                        Add Lecturer
                      </Button>
                    )}
                  </EmptyState.Content>
                </EmptyState.Root>
              </Table.Cell>
            </Table.Row>
          ) : (
            memoizedTableRows
          )}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default LecturersTable;
