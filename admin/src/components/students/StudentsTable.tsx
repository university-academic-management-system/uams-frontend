import React, { useMemo, useCallback, useState } from "react";
import {
  Table,
  Checkbox,
  Text,
  Button,
  Flex,
  Skeleton,
  VStack,
  Popover,
  Portal,
  EmptyState,
} from "@chakra-ui/react";
import {
  MoreHorizontal,
  UserCog,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GraduationCap,
} from "lucide-react";
import type { Student } from "@type/student.type";

interface StudentsTableProps {
  paginatedStudents: Student[];
  filteredStudentsLength: number;
  selectedIds: string[];
  loading: boolean;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  requestSort: (key: string) => void;
  toggleSelectAll: () => void;
  toggleSelection: (id: string) => void;
  handleSingleDelete: (id: string) => void;
  setSelectedStudent: (student: Student | null) => void;
  setStudentToEdit: (student: Student | null) => void;
  setShowAddForm: (show: boolean) => void;
}

const StudentsTable = ({
  paginatedStudents,
  filteredStudentsLength,
  selectedIds,
  loading,
  sortConfig,
  requestSort,
  toggleSelectAll,
  toggleSelection,
  handleSingleDelete,
  setSelectedStudent,
  setStudentToEdit,
  setShowAddForm,
}: StudentsTableProps) => {
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
    return paginatedStudents.map((s) => (
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
          {s.registrationNo || "—"}
        </Table.Cell>
        <Table.Cell>{s.matricNumber || "—"}</Table.Cell>
        <Table.Cell fontWeight="bold">{s.surname}</Table.Cell>
        <Table.Cell fontWeight="medium">{s.otherName || "—"}</Table.Cell>
        <Table.Cell>{s.email}</Table.Cell>
        <Table.Cell>{s.phone || "—"}</Table.Cell>
        <Table.Cell textTransform="capitalize">{s.gender || "—"}</Table.Cell>
        <Table.Cell textTransform="capitalize">
          {s.admissionMode || "—"}
        </Table.Cell>
        <Table.Cell>{s.entryQualification || "—"}</Table.Cell>
        <Table.Cell>{s.faculty || "—"}</Table.Cell>
        <Table.Cell>{s.department || "—"}</Table.Cell>
        <Table.Cell>{s.level ? s.level.replace(/^L/i, "") : "—"}</Table.Cell>
        <Table.Cell>{s.degreeCourse || "—"}</Table.Cell>
        <Table.Cell>{s.courseDuration ? `${s.courseDuration} ${Number(s.courseDuration) === 1 ? 'Year' : 'Years'}` : "—"}</Table.Cell>
        <Table.Cell>{s.degreeAwarded || "—"}</Table.Cell>
        <Table.Cell>
          <Text
            as="span"
            px="3"
            py="1"
            borderRadius="full"
            fontSize="10px"
            fontWeight="bold"
            bg={s.status === "ACTIVE" ? "green.100" : "red.100"}
            color={s.status === "ACTIVE" ? "green.700" : "red.700"}
          >
            {s.status === "ACTIVE" ? "Active" : "Inactive"}
          </Text>
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
                        setSelectedStudent(s);
                      }}
                      w="full"
                      justifyContent="flex-start"
                      size="sm"
                    >
                      <UserCog size={16} /> Assign Role
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setOpenPopoverId(null);
                        setStudentToEdit(s);
                        setShowAddForm(true);
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
                        handleSingleDelete(s.id);
                      }}
                      w="full"
                      justifyContent="flex-start"
                      size="sm"
                    >
                      <Trash2 size={16} /> Delete student
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
    paginatedStudents,
    selectedIds,
    toggleSelection,
    handleSingleDelete,
    setSelectedStudent,
    setStudentToEdit,
    setShowAddForm,
    openPopoverId,
    setOpenPopoverId,
  ]);

  return (
    <Table.ScrollArea
      maxW={{ base: "xl", md: "full" }}
      maxH="calc(100vh - 285px)"
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
              borderRight="1px solid"
              borderColor="border.muted"
              px="6"
              py="4"
              w="12"
              textAlign="center"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              letterSpacing="wider"
              whiteSpace="nowrap"
            >
              <Checkbox.Root
                checked={
                  filteredStudentsLength > 0 &&
                  selectedIds.length > 0 &&
                  selectedIds.length === filteredStudentsLength
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
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("registrationNo")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Reg No. {renderSortIcon("registrationNo")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("matricNumber")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Mat. No. {renderSortIcon("matricNumber")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("surname")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                First Name {renderSortIcon("surname")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("otherName")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Other Names {renderSortIcon("otherName")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="200px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("email")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Email {renderSortIcon("email")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="140px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("phone")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Phone No {renderSortIcon("phone")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="100px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("gender")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Gender {renderSortIcon("gender")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("admissionMode")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Admission Mode {renderSortIcon("admissionMode")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("entryQualification")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Entry Qual. {renderSortIcon("entryQualification")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("faculty")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Faculty {renderSortIcon("faculty")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("department")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Department {renderSortIcon("department")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="100px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("level")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Level {renderSortIcon("level")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("degreeCourse")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Degree Course {renderSortIcon("degreeCourse")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("courseDuration")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Duration {renderSortIcon("courseDuration")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="150px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("degreeAwarded")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Degree Awarded {renderSortIcon("degreeAwarded")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              px="6"
              py="4"
              minW="100px"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
              cursor="pointer"
              onClick={() => requestSort("status")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
            >
              <Flex alignItems="center" gap="1">
                Status {renderSortIcon("status")}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              position="sticky"
              right="0"
              zIndex={11}
              bg="bg.muted"
              borderLeft="1px solid"
              borderColor="border.muted"
              px="6"
              py="4"
              w="12"
              textAlign="right"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              whiteSpace="nowrap"
            >
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body fontSize="xs">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Table.Row key={i}>
                <Table.Cell position="sticky" left="0" zIndex={0} bg="white" borderRight="1px solid" borderColor="border.muted">
                  <Skeleton h="4" w="4" />
                </Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                <Table.Cell position="sticky" right="0" zIndex={0} bg="white" borderLeft="1px solid" borderColor="border.muted">
                  <Skeleton h="4" w="4" />
                </Table.Cell>
              </Table.Row>
            ))
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
            memoizedTableRows
          )}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default StudentsTable;
