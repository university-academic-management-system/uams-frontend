import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Tabs, Box, Flex, Text } from "@chakra-ui/react";
import { exportToExcel } from "@utils/excel.util";
import { IDCardHooks } from "@hooks/idcard.hook";
import { TranscriptHooks } from "@hooks/transcript.hook";
import type { IDCardRequest, IDCardRequestStatus, IDCardStudent } from "@type/idCard.type";
import type { TranscriptApplication, TranscriptStatus, DeliveryMethod } from "@type/transcript.type";
import {
    PaginationRoot,
    PaginationItems,
    PaginationPrevTrigger,
    PaginationNextTrigger
} from "@components/ui/pagination";

const IDCardsFilters = lazy(() => import("@components/applications/IDCardsFilters"));
const IDCardsTable = lazy(() => import("@components/applications/IDCardsTable"));
const IDCardCaptureDialog = lazy(() => import("@components/applications/IDCardCaptureDialog"));
const TranscriptsFilters = lazy(() => import("@components/applications/TranscriptsFilters"));
const TranscriptsTable = lazy(() => import("@components/applications/TranscriptsTable"));

const ITEMS_PER_PAGE = 10;

const Applications = () => {
    return (
        <Tabs.Root defaultValue="id-card-applications" variant="enclosed">
            <Tabs.List w="fit">
                <Tabs.Trigger value="id-card-applications">ID Card Applications</Tabs.Trigger>
                <Tabs.Trigger value="transcript-applications">Transcript Applications</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="id-card-applications">
                <IDCardTabContent />
            </Tabs.Content>
            <Tabs.Content value="transcript-applications">
                <TranscriptTabContent />
            </Tabs.Content>
        </Tabs.Root>
    );
};

const IDCardTabContent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const [isCaptureDialogOpen, setIsCaptureDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<IDCardRequest | null>(null);

    // Fetch ID card requests with status filter
    const queryParams = useMemo(() => ({
        status: selectedStatus ? selectedStatus as IDCardRequestStatus : undefined,
    }), [selectedStatus]);

    const { data: response, isLoading: loading } = IDCardHooks.useIDCardRequests(queryParams);
    const requestsList = useMemo(() => response?.data ?? [], [response]);

    const requestSort = useCallback((key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    const getStudentName = (r: IDCardRequest) => {
        const { firstName, surname, otherName } = r.student;
        return `${surname} ${firstName} ${otherName}`;
    };

    const filteredRequests = useMemo(() => {
        let result = requestsList;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (r) =>
                    getStudentName(r).toLowerCase().includes(q) ||
                    r.student.matricNumber?.toLowerCase().includes(q) ||
                    r.paymentRef?.toLowerCase().includes(q)
            );
        }

        if (sortConfig !== null) {
            result = [...result].sort((a, b) => {
                let aValue: string | number = "";
                let bValue: string | number = "";

                if (sortConfig.key === "fullName") {
                    aValue = getStudentName(a);
                    bValue = getStudentName(b);
                } else if (sortConfig.key === "matricNumber") {
                    aValue = a.student.matricNumber;
                    bValue = b.student.matricNumber;
                } else if (sortConfig.key === "level") {
                    aValue = a.student.level;
                    bValue = b.student.level;
                } else if (sortConfig.key === "createdAt") {
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                } else {
                    aValue = ((a as unknown as Record<string, unknown>)[sortConfig.key] as string | number) ?? "";
                    bValue = ((b as unknown as Record<string, unknown>)[sortConfig.key] as string | number) ?? "";
                }

                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [requestsList, searchQuery, sortConfig]);

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
    const paginatedRequests = filteredRequests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }, []);

    const toggleSelectAll = useCallback(() => {
        const allIds = filteredRequests.map((r) => r.id);
        const allSelected = allIds.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : allIds);
    }, [filteredRequests, selectedIds]);

    const clearFilters = useCallback(() => {
        setSearchQuery("");
        setSelectedStatus("");
        setCurrentPage(1);
    }, []);

    const handleExport = useCallback(() => {
        const exportData = filteredRequests.map((r) => ({
            "Matric No": r.student.matricNumber,
            Name: getStudentName(r),
            Phone: r.student.phone || "N/A",
            Level: r.student.level,
            "Payment Ref": r.paymentRef,
            Status: r.status,
            "Date Applied": new Date(r.createdAt).toLocaleDateString(),
            Remarks: r.remarks || "N/A",
        }));
        exportToExcel(exportData, "ID_Card_Applications", "ID Cards");
    }, [filteredRequests]);

    const handleViewDetails = useCallback((request: IDCardRequest) => {
        // TODO: Implement view details functionality
        console.log("View Details:", request);
    }, []);

    const handleIssueIDCard = useCallback((request: IDCardRequest) => {
        setSelectedRequest(request);
        setIsCaptureDialogOpen(true);
    }, []);

    const handleDownloadIDCard = useCallback((request: IDCardRequest) => {
        const a = document.createElement("a");
        a.href = request.fileUrl || "";
        a.target = "_blank";
        a.download = `id-card-${request.student?.matricNumber}.pdf`;  
        a.click();
    }, []);

    return (
        <Box
            bg="white"
            borderRadius="md"
            border="xs"
            borderColor="border.muted"
            overflow="hidden"
            mt="4"
        >
            <Suspense fallback={<Box p="8" textAlign="center">Loading ID card applications...</Box>}>
                <IDCardsFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    clearFilters={clearFilters}
                    handleExport={handleExport}
                    setCurrentPage={setCurrentPage}
                    isExportDisabled={filteredRequests.length === 0}
                />

                <IDCardsTable
                    paginatedRequests={paginatedRequests}
                    filteredRequestsLength={filteredRequests.length}
                    selectedIds={selectedIds}
                    loading={loading}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    toggleSelectAll={toggleSelectAll}
                    toggleSelection={toggleSelection}
                    onViewDetails={handleViewDetails}
                    onIssueIDCard={handleIssueIDCard}
                    onDownloadIDCard={handleDownloadIDCard}
                    searchQuery={searchQuery}
                    serialStart={(currentPage - 1) * ITEMS_PER_PAGE}
                />
            </Suspense>

            <Suspense fallback={null}>
                <IDCardCaptureDialog
                    student={selectedRequest?.student as IDCardStudent}
                    request={selectedRequest}
                    isOpen={isCaptureDialogOpen}
                    onClose={() => {
                        setIsCaptureDialogOpen(false);
                        setSelectedRequest(null);
                    }}
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
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} of{" "}
                        {filteredRequests.length} applications
                    </Text>
                    <PaginationRoot
                        count={filteredRequests.length}
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
    );
};


export default Applications;

const TranscriptTabContent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    const queryParams = useMemo(() => ({
        status: selectedStatus ? selectedStatus as TranscriptStatus : undefined,
        deliveryMethod: selectedDeliveryMethod ? selectedDeliveryMethod as DeliveryMethod : undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
    }), [selectedStatus, selectedDeliveryMethod, currentPage]);

    const { data: response, isLoading: loading } = TranscriptHooks.useTranscriptRequests(queryParams);
    const requestsList = useMemo(() => response?.data?.transcripts ?? [], [response]);
    const serverTotalPages = response?.data?.totalPages ?? 1;

    const updateStatusMutation = TranscriptHooks.useUpdateTranscriptStatus();

    const requestSort = useCallback((key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    const getStudentName = (r: TranscriptApplication) => {
        const { firstName, surname, otherName } = r.student;
        return `${firstName}${otherName ? " " + otherName : ""} ${surname}`;
    };

    const filteredRequests = useMemo(() => {
        let result = requestsList;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (r) =>
                    getStudentName(r).toLowerCase().includes(q) ||
                    r.student.matricNumber?.toLowerCase().includes(q) ||
                    r.reference?.toLowerCase().includes(q) ||
                    r.purpose?.toLowerCase().includes(q)
            );
        }

        if (sortConfig !== null) {
            result = [...result].sort((a, b) => {
                let aValue: string | number = "";
                let bValue: string | number = "";

                if (sortConfig.key === "fullName") {
                    aValue = getStudentName(a);
                    bValue = getStudentName(b);
                } else if (sortConfig.key === "matricNumber") {
                    aValue = a.student.matricNumber;
                    bValue = b.student.matricNumber;
                } else if (sortConfig.key === "level") {
                    aValue = a.student.level;
                    bValue = b.student.level;
                } else if (sortConfig.key === "department") {
                    aValue = a.student.department;
                    bValue = b.student.department;
                } else if (sortConfig.key === "deliveryMethod") {
                    aValue = a.deliveryMethod;
                    bValue = b.deliveryMethod;
                } else if (sortConfig.key === "reference") {
                    aValue = a.reference;
                    bValue = b.reference;
                } else if (sortConfig.key === "status") {
                    aValue = a.status;
                    bValue = b.status;
                } else if (sortConfig.key === "paymentStatus") {
                    aValue = a.paymentStatus;
                    bValue = b.paymentStatus;
                } else if (sortConfig.key === "createdAt") {
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                } else {
                    aValue = ((a as unknown as Record<string, unknown>)[sortConfig.key] as string | number) ?? "";
                    bValue = ((b as unknown as Record<string, unknown>)[sortConfig.key] as string | number) ?? "";
                }

                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [requestsList, searchQuery, sortConfig]);

    const paginatedRequests = filteredRequests;

    const clearFilters = useCallback(() => {
        setSearchQuery("");
        setSelectedStatus("");
        setSelectedDeliveryMethod("");
        setCurrentPage(1);
    }, []);

    const handleExport = useCallback(() => {
        const exportData = filteredRequests.map((r) => ({
            "Reference": r.reference,
            "Matric No": r.student.matricNumber,
            "Name": getStudentName(r),
            "Level": r.student.level,
            "Department": r.student.department,
            "Delivery Method": r.deliveryMethod,
            "Address": r.address,
            "Purpose": r.purpose,
            "Status": r.status,
            "Payment Status": r.paymentStatus,
            "Date Applied": new Date(r.createdAt).toLocaleDateString(),
        }));
        exportToExcel(exportData, "Transcript_Applications", "Transcripts");
    }, [filteredRequests]);

    const handleUpdateStatus = useCallback(
        (id: string, status: TranscriptStatus) => {
            updateStatusMutation.mutate({ id, status });
        },
        [updateStatusMutation]
    );

    return (
        <Box
            bg="white"
            borderRadius="md"
            border="xs"
            borderColor="border.muted"
            overflow="hidden"
            mt="4"
        >
            <Suspense fallback={<Box p="8" textAlign="center">Loading transcript applications...</Box>}>
                <TranscriptsFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    selectedDeliveryMethod={selectedDeliveryMethod}
                    setSelectedDeliveryMethod={setSelectedDeliveryMethod}
                    clearFilters={clearFilters}
                    handleExport={handleExport}
                    setCurrentPage={setCurrentPage}
                    isExportDisabled={filteredRequests.length === 0}
                />

                <TranscriptsTable
                    paginatedRequests={paginatedRequests}
                    loading={loading}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    onUpdateStatus={handleUpdateStatus}
                    isUpdating={updateStatusMutation.isPending}
                    searchQuery={searchQuery}
                    serialStart={(currentPage - 1) * ITEMS_PER_PAGE}
                />
            </Suspense>

            {serverTotalPages > 1 && (
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    p="4"
                    bg="white"
                    borderTop="xs"
                    borderColor="border.muted"
                >
                    <Text fontSize="sm" color="fg.muted">
                        Page {currentPage} of {serverTotalPages} · {response?.data?.total ?? 0} applications
                    </Text>
                    <PaginationRoot
                        count={response?.data?.total ?? 0}
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
    );
};
