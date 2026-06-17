import React, { useMemo, useCallback, useState } from "react";
import {
  Table,
  Button,
  Flex,
  Skeleton,
  VStack,
  Popover,
  Portal,
  EmptyState,
  Badge,
} from "@chakra-ui/react";
import {
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  PackageCheck,
} from "lucide-react";
import type { TranscriptApplication, TranscriptStatus } from "@type/transcript.type";
import { normalizeLevel } from "@utils/function.util";

interface TranscriptsTableProps {
  paginatedRequests: TranscriptApplication[];
  loading: boolean;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  requestSort: (key: string) => void;
  onUpdateStatus: (id: string, status: TranscriptStatus) => void;
  isUpdating: boolean;
  searchQuery?: string;
  serialStart: number;
}

const STATUS_OPTIONS: { value: TranscriptStatus; label: string; icon: React.ReactNode }[] = [
  { value: "PENDING", label: "Pending", icon: <Clock size={14} /> },
  { value: "IN_PROGRESS", label: "In Progress", icon: <FileText size={14} /> },
  { value: "READY", label: "Ready", icon: <PackageCheck size={14} /> },
  { value: "DELIVERED", label: "Delivered", icon: <Truck size={14} /> },
  { value: "CANCELLED", label: "Cancelled", icon: <XCircle size={14} /> },
];

const TranscriptsTable = ({
  paginatedRequests,
  loading,
  sortConfig,
  requestSort,
  onUpdateStatus,
  isUpdating,
  searchQuery,
  serialStart,
}: TranscriptsTableProps) => {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const renderSortIcon = useCallback(
    (key: string) => {
      if (!sortConfig || sortConfig.key !== key) {
        return (
          <ArrowUpDown
            size={14}
            style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle", opacity: 0.5 }}
          />
        );
      }
      if (sortConfig.direction === "asc") {
        return (
          <ArrowUp
            size={14}
            style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle" }}
            color="#1D7AD9"
          />
        );
      }
      return (
        <ArrowDown
          size={14}
          style={{ marginLeft: "6px", display: "inline-block", verticalAlign: "middle" }}
          color="#1D7AD9"
        />
      );
    },
    [sortConfig]
  );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; color: string }> = {
      PENDING: { bg: "yellow.50", color: "yellow.700" },
      IN_PROGRESS: { bg: "blue.50", color: "blue.600" },
      READY: { bg: "cyan.50", color: "cyan.700" },
      DELIVERED: { bg: "green.50", color: "green.600" },
      CANCELLED: { bg: "red.50", color: "red.600" },
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
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const style =
      status === "PAID"
        ? { bg: "green.50", color: "green.600" }
        : status === "FAILED"
        ? { bg: "red.50", color: "red.600" }
        : { bg: "yellow.50", color: "yellow.700" };
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStudentName = (r: TranscriptApplication) => {
    const { firstName, surname, otherName } = r.student;
    return `${firstName}${otherName ? " " + otherName : ""} ${surname}`;
  };

  const getDeliveryLabel = (method: string) =>
    method === "DIGITAL_DELIVERY" ? "Digital" : method === "PHYSICAL_PICKUP" ? "Physical Pickup" : method;

  const memoizedTableRows = useMemo(() => {
    return paginatedRequests.map((r, idx) => (
      <Table.Row
        key={r.id}
        _hover={{ bg: "slate.50" }}
        cursor="pointer"
        whiteSpace="nowrap"
      >
        <Table.Cell color="fg.muted" fontSize="xs" fontWeight="medium">
          {serialStart + idx + 1}
        </Table.Cell>
        <Table.Cell fontWeight="medium">{r.reference || "—"}</Table.Cell>
        <Table.Cell fontWeight="bold">{getStudentName(r)}</Table.Cell>
        <Table.Cell>{r.student.matricNumber || "—"}</Table.Cell>
        <Table.Cell>{normalizeLevel(r.student.level) || "—"}</Table.Cell>
        <Table.Cell>{r.student.department || "—"}</Table.Cell>
        <Table.Cell>{getDeliveryLabel(r.deliveryMethod)}</Table.Cell>
        <Table.Cell maxW="180px" overflow="hidden" textOverflow="ellipsis" title={r.purpose}>
          {r.purpose || "—"}
        </Table.Cell>
        <Table.Cell>{getStatusBadge(r.status)}</Table.Cell>
        <Table.Cell>{getPaymentBadge(r.paymentStatus)}</Table.Cell>
        <Table.Cell>{formatDate(r.createdAt)}</Table.Cell>
        <Table.Cell
          textAlign="right"
          position="sticky"
          right="0"
          zIndex={1}
          bg="white"
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
                _hover={{bg:"bg.subtle"}}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                px="0"
                color="fg.subtle"
                disabled={isUpdating}
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
                  w="52"
                  overflow="hidden"
                  outline="none"
                >
                  <Popover.Body p="1">
                    <Flex
                      px="3"
                      py="2"
                      fontSize="11px"
                      fontWeight="bold"
                      color="fg.muted"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Update Status
                    </Flex>
                    {STATUS_OPTIONS.map((opt) => (
                      <Button
                        key={opt.value}
                        variant="ghost"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setOpenPopoverId(null);
                          onUpdateStatus(r.id, opt.value);
                        }}
                        w="full"
                        justifyContent="flex-start"
                        size="sm"
                        disabled={r.status === opt.value || isUpdating}
                        opacity={r.status === opt.value ? 0.5 : 1}
                        color={
                          opt.value === "CANCELLED"
                            ? "red.500"
                            : opt.value === "DELIVERED"
                            ? "green.600"
                            : undefined
                        }
                      >
                        {opt.icon}
                        <span style={{ marginLeft: "8px" }}>{opt.label}</span>
                        {r.status === opt.value && (
                          <CheckCircle2 size={12} style={{ marginLeft: "auto", opacity: 0.7 }} />
                        )}
                      </Button>
                    ))}
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </Table.Cell>
      </Table.Row>
    ));
  }, [paginatedRequests, openPopoverId, isUpdating, onUpdateStatus, serialStart]);

  return (
    <Table.ScrollArea maxW={{ base: "xl", md: "full" }} maxH="calc(100vh - 240px)">
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
            {[
              { key: "reference", label: "Reference", sortable: true },
              { key: "fullName", label: "Student Name", sortable: true },
              { key: "matricNumber", label: "Matric No", sortable: true },
              { key: "level", label: "Level", sortable: true },
              { key: "department", label: "Department", sortable: false },
              { key: "deliveryMethod", label: "Delivery", sortable: true },
              { key: "purpose", label: "Purpose", sortable: false },
              { key: "status", label: "Status", sortable: true },
              { key: "paymentStatus", label: "Payment", sortable: true },
              { key: "createdAt", label: "Date Applied", sortable: true },
            ].map((col) => (
              <Table.ColumnHeader
                key={col.key}
                bg="bg.muted"
                cursor={col.sortable ? "pointer" : "default"}
                onClick={col.sortable ? () => requestSort(col.key) : undefined}
                userSelect="none"
                _hover={col.sortable ? { bg: "slate.100" } : undefined}
                fontSize="11px"
                fontWeight="bold"
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                <Flex alignItems="center" gap="1">
                  {col.label}
                  {col.sortable && renderSortIcon(col.key)}
                </Flex>
              </Table.ColumnHeader>
            ))}
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
                {Array.from({ length: 12 }).map((__, j) => (
                  <Table.Cell
                    key={j}
                    position={j === 11 ? "sticky" : undefined}
                    right={j === 11 ? "0" : undefined}
                    zIndex={j === 11 ? 1 : undefined}
                    bg="white"
                    borderLeft={j === 11 ? "1px solid" : undefined}
                    borderColor="border.muted"
                  >
                    <Skeleton h="4" w={j === 11 || j === 0 ? "4" : "full"} ml={j === 11 ? "auto" : undefined} />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          ) : paginatedRequests.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={12} py="12" _hover={{ bg: "bg" }}>
                <EmptyState.Root>
                  <EmptyState.Content>
                    <EmptyState.Indicator>
                      <FileText />
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                      <EmptyState.Title>No Transcript Applications Found</EmptyState.Title>
                      <EmptyState.Description>
                        {searchQuery
                          ? "Try adjusting your search criteria"
                          : "No transcript applications have been submitted yet"}
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

export default TranscriptsTable;
