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
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Eye,
} from "lucide-react";
import type { IDCardRequest } from "@type/idCard.type";

interface IDCardsTableProps {
  paginatedRequests: IDCardRequest[];
  filteredRequestsLength: number;
  selectedIds: string[];
  loading: boolean;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  requestSort: (key: string) => void;
  toggleSelectAll: () => void;
  toggleSelection: (id: string) => void;
  onApprove?: (request: IDCardRequest) => void;
  onReject?: (request: IDCardRequest) => void;
  onViewDetails?: (request: IDCardRequest) => void;
  searchQuery?: string;
  serialStart: number;
}

const IDCardsTable = ({
  paginatedRequests,
  filteredRequestsLength,
  selectedIds,
  loading,
  sortConfig,
  requestSort,
  toggleSelectAll,
  toggleSelection,
  onApprove,
  onReject,
  onViewDetails,
  searchQuery,
  serialStart,
}: IDCardsTableProps) => {
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; color: string }> = {
      PENDING: { bg: "yellow.50", color: "yellow.700" },
      APPROVED: { bg: "green.50", color: "green.600" },
      REJECTED: { bg: "red.50", color: "red.600" },
      COMPLETED: { bg: "blue.50", color: "blue.600" },
    };
    const style = statusMap[status] || { bg: "gray.100", color: "gray.600" };
    return (
      <Badge
        px="2"
        py="1"
        fontSize="10px"
        fontWeight="bold"
        textAlign="center"
        bg={style.bg}
        color={style.color}
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStudentName = (request: IDCardRequest) => {
    const { firstName, lastName, otherName } = request.student;
    return `${firstName} ${otherName ? otherName + " " : ""}${lastName}`;
  };

  const memoizedTableRows = useMemo(() => {
    return paginatedRequests.map((r, idx) => (
      <Table.Row
        key={r.id}
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
            checked={selectedIds.includes(r.id)}
            onCheckedChange={() => toggleSelection(r.id)}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>
        </Table.Cell>
        <Table.Cell color="fg.muted" fontSize="xs" fontWeight="medium">
          {serialStart + idx + 1}
        </Table.Cell>
        <Table.Cell fontWeight="medium">
          {r.student.matricNumber || "—"}
        </Table.Cell>
        <Table.Cell fontWeight="bold">
          {getStudentName(r)}
        </Table.Cell>
        <Table.Cell>
          {r.student.phone || "—"}
        </Table.Cell>
        <Table.Cell>
          {r.student.level || "—"}
        </Table.Cell>
        <Table.Cell>
          {r.paymentRef || "—"}
        </Table.Cell>
        <Table.Cell>
          {getStatusBadge(r.status)}
        </Table.Cell>
        <Table.Cell>
          {formatDate(r.createdAt)}
        </Table.Cell>
        <Table.Cell>
          {r.remarks || "—"}
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
            open={openPopoverId === r.id}
            onOpenChange={(e) => setOpenPopoverId(e.open ? r.id : null)}
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
                        onViewDetails?.(r);
                      }}
                      w="full"
                      justifyContent="flex-start"
                      size="sm"
                    >
                      <Eye size={16} /> View Details
                    </Button>
                    {r.status === "PENDING" && (
                      <>
                        <Button
                          variant="ghost"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setOpenPopoverId(null);
                            onApprove?.(r);
                          }}
                          w="full"
                          justifyContent="flex-start"
                          size="sm"
                          color="green.600"
                        >
                          <CheckCircle size={16} /> Approve
                        </Button>
                        <Button
                          variant="ghost"
                          colorPalette="red"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setOpenPopoverId(null);
                            onReject?.(r);
                          }}
                          w="full"
                          justifyContent="flex-start"
                          size="sm"
                        >
                          <XCircle size={16} /> Reject
                        </Button>
                      </>
                    )}
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </Table.Cell>
      </Table.Row>
    ));
  }, [
    paginatedRequests,
    selectedIds,
    toggleSelection,
    onApprove,
    onReject,
    onViewDetails,
    openPopoverId,
    serialStart,
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
                  filteredRequestsLength > 0 &&
                  selectedIds.length > 0 &&
                  selectedIds.length === filteredRequestsLength
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
              w="10"
              textAlign="center"
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              S/N
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("matricNumber")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Matric No {renderSortIcon("matricNumber")}
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
                Student Name {renderSortIcon("fullName")}
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
              Phone
            </Table.ColumnHeader>
            <Table.ColumnHeader
              bg="bg.muted"
              cursor="pointer"
              onClick={() => requestSort("level")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Level {renderSortIcon("level")}
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
              Payment Ref
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
              cursor="pointer"
              onClick={() => requestSort("createdAt")}
              userSelect="none"
              _hover={{ bg: "slate.100" }}
              fontSize="11px"
              fontWeight="bold"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <Flex alignItems="center" gap="1">
                Date Applied {renderSortIcon("createdAt")}
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
              Remarks
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
          ) : paginatedRequests.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={11} py="12" _hover={{ bg: "bg" }}>
                <EmptyState.Root>
                  <EmptyState.Content>
                    <EmptyState.Indicator>
                      <CreditCard />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                      <EmptyState.Title>No ID Card Applications Found</EmptyState.Title>
                      <EmptyState.Description>
                        {searchQuery
                          ? "Try adjusting your search criteria"
                          : "No ID card applications have been submitted yet"}
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

export default IDCardsTable;
