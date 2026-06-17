import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Tabs, Box, Flex, Text } from "@chakra-ui/react";
import { exportToExcel } from "@utils/excel.util";
import { IDCardHooks } from "@hooks/idcard.hook";
import { TranscriptHooks } from "@hooks/transcript.hook";
import type { IDCardRequest, IDCardRequestStatus } from "@type/idCard.type";
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
        const { firstName, lastName, otherName } = r.student;
        return `${firstName} ${otherName ? otherName + " " : ""}${lastName}`;
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
    //   const paginatedRequests = filteredRequests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const paginatedRequests: IDCardRequest[] = [
        { id: "id-1", studentId: "s-1", status: "PENDING", file: {}, paymentRef: "PAY-2024-001", remarks: "Awaiting verification", createdAt: "2025-11-01T09:12:00Z", updatedAt: "2025-11-01T09:12:00Z", student: { id: "s-1", userId: "u-1", firstName: "ADEOLA", lastName: "OKAFOR", otherName: "CHINWE", matricNumber: "U2022/1001001", registrationNo: "2022100100AF", phone: "08031234567", level: "L200", admissionYear: 2022, admissionSession: "2021/2022", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "GOOD_STANDING", totalCreditsEarned: 48, totalCreditsAttempted: 52, cgpa: 3.85, gpa: 3.9, sgpa: 4.0, createdAt: "2022-09-01T00:00:00Z", updatedAt: "2025-10-15T00:00:00Z" } },
        { id: "id-2", studentId: "s-2", status: "ISSUED", file: {}, paymentRef: "PAY-2024-002", remarks: "", createdAt: "2025-10-28T14:30:00Z", updatedAt: "2025-10-29T08:00:00Z", student: { id: "s-2", userId: "u-2", firstName: "EMMANUEL", lastName: "NWANKWO", otherName: "", matricNumber: "U2021/2005003", registrationNo: "2021200500DF", phone: "08067891234", level: "L400", admissionYear: 2021, admissionSession: "2020/2021", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "GOOD_STANDING", totalCreditsEarned: 112, totalCreditsAttempted: 118, cgpa: 4.12, gpa: 4.0, sgpa: 4.2, createdAt: "2021-09-01T00:00:00Z", updatedAt: "2025-09-20T00:00:00Z" } },
        { id: "id-3", studentId: "s-3", status: "PENDING", file: {}, paymentRef: "PAY-2024-003", remarks: "Invalid photo uploaded", createdAt: "2025-10-20T11:45:00Z", updatedAt: "2025-10-22T16:20:00Z", student: { id: "s-3", userId: "u-3", firstName: "FATIMA", lastName: "BELLO", otherName: "HAUWA", matricNumber: "U2023/3007005", registrationNo: "2023300700AB", phone: "07045678901", level: "L100", admissionYear: 2023, admissionSession: "2022/2023", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "GOOD_STANDING", totalCreditsEarned: 18, totalCreditsAttempted: 20, cgpa: 3.4, gpa: 3.5, sgpa: 3.4, createdAt: "2023-09-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" } },
        { id: "id-4", studentId: "s-4", status: "ISSUED", file: {}, paymentRef: "PAY-2024-004", remarks: "Card printed and dispatched", createdAt: "2025-09-15T08:00:00Z", updatedAt: "2025-10-01T12:00:00Z", student: { id: "s-4", userId: "u-4", firstName: "DAVID", lastName: "ADEYEMI", otherName: "OLUWASEUN", matricNumber: "U2020/4012008", registrationNo: "2020401200CD", phone: "08123456789", level: "L500", admissionYear: 2020, admissionSession: "2019/2020", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "GOOD_STANDING", totalCreditsEarned: 145, totalCreditsAttempted: 150, cgpa: 4.45, gpa: 4.5, sgpa: 4.6, createdAt: "2020-09-01T00:00:00Z", updatedAt: "2025-08-15T00:00:00Z" } },
        { id: "id-5", studentId: "s-5", status: "PENDING", file: {}, paymentRef: "PAY-2024-005", remarks: "", createdAt: "2025-11-03T10:22:00Z", updatedAt: "2025-11-03T10:22:00Z", student: { id: "s-5", userId: "u-5", firstName: "GRACE", lastName: "OKEKE", otherName: "NGOZI", matricNumber: "U2022/1009012", registrationNo: "2022100900EF", phone: "09087654321", level: "L200", admissionYear: 2022, admissionSession: "2021/2022", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "GOOD_STANDING", totalCreditsEarned: 50, totalCreditsAttempted: 54, cgpa: 3.7, gpa: 3.6, sgpa: 3.8, createdAt: "2022-09-01T00:00:00Z", updatedAt: "2025-10-20T00:00:00Z" } },
        { id: "id-6", studentId: "s-6", status: "PENDING", file: {}, paymentRef: "PAY-2024-006", remarks: "Fee payment pending confirmation", createdAt: "2025-11-04T07:55:00Z", updatedAt: "2025-11-04T07:55:00Z", student: { id: "s-6", userId: "u-6", firstName: "IBRAHIM", lastName: "MUSA", otherName: "", matricNumber: "U2023/3015020", registrationNo: "2023301500GH", phone: "07098761234", level: "L100", admissionYear: 2023, admissionSession: "2022/2023", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "GOOD_STANDING", totalCreditsEarned: 22, totalCreditsAttempted: 24, cgpa: 3.95, gpa: 4.0, sgpa: 3.95, createdAt: "2023-09-01T00:00:00Z", updatedAt: "2025-10-10T00:00:00Z" } },
        { id: "id-7", studentId: "s-7", status: "PENDING", file: {}, paymentRef: "PAY-2024-007", remarks: "", createdAt: "2025-10-25T16:10:00Z", updatedAt: "2025-10-26T09:30:00Z", student: { id: "s-7", userId: "u-7", firstName: "BLESSING", lastName: "EZE", otherName: "CHIAMAKA", matricNumber: "U2021/2008015", registrationNo: "2021200800IJ", phone: "08134567890", level: "L400", admissionYear: 2021, admissionSession: "2020/2021", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "GOOD_STANDING", totalCreditsEarned: 105, totalCreditsAttempted: 110, cgpa: 4.3, gpa: 4.2, sgpa: 4.4, createdAt: "2021-09-01T00:00:00Z", updatedAt: "2025-09-25T00:00:00Z" } },
        { id: "id-8", studentId: "s-8", status: "PENDING", file: {}, paymentRef: "PAY-2024-008", remarks: "Photo background needs to be plain white", createdAt: "2025-11-05T13:40:00Z", updatedAt: "2025-11-05T13:40:00Z", student: { id: "s-8", userId: "u-8", firstName: "SAMUEL", lastName: "ADEDIRAN", otherName: "TUNDE", matricNumber: "U2022/1021030", registrationNo: "2022102100KL", phone: "09012345678", level: "L300", admissionYear: 2022, admissionSession: "2021/2022", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "PROBATION", totalCreditsEarned: 68, totalCreditsAttempted: 78, cgpa: 2.85, gpa: 2.9, sgpa: 3.0, createdAt: "2022-09-01T00:00:00Z", updatedAt: "2025-10-28T00:00:00Z" } },
        { id: "id-9", studentId: "s-9", status: "ISSUED", file: {}, paymentRef: "PAY-2024-009", remarks: "", createdAt: "2025-08-10T09:00:00Z", updatedAt: "2025-09-05T11:15:00Z", student: { id: "s-9", userId: "u-9", firstName: "AMINAT", lastName: "YUSUF", otherName: "", matricNumber: "U2020/4003045", registrationNo: "2020400300MN", phone: "07056781234", level: "L500", admissionYear: 2020, admissionSession: "2019/2020", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "GOOD_STANDING", totalCreditsEarned: 138, totalCreditsAttempted: 142, cgpa: 4.6, gpa: 4.7, sgpa: 4.65, createdAt: "2020-09-01T00:00:00Z", updatedAt: "2025-08-01T00:00:00Z" } },
        { id: "id-10", studentId: "s-10", status: "ISSUED", file: {}, paymentRef: "PAY-2024-010", remarks: "Payment receipt mismatch", createdAt: "2025-11-02T15:18:00Z", updatedAt: "2025-11-04T10:45:00Z", student: { id: "s-10", userId: "u-10", firstName: "CHINEDU", lastName: "OKONKWO", otherName: "EMKA", matricNumber: "U2023/3022050", registrationNo: "2023302200OP", phone: "08076543210", level: "L100", admissionYear: 2023, admissionSession: "2022/2023", currentSession: "2024/2025", registrationStatus: "REGISTERED", academicStanding: "GOOD_STANDING", totalCreditsEarned: 15, totalCreditsAttempted: 18, cgpa: 3.2, gpa: 3.1, sgpa: 3.2, createdAt: "2023-09-01T00:00:00Z", updatedAt: "2025-11-01T00:00:00Z" } },
    ];

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
        // TODO: Implement download functionality
        console.log("Download ID Card:", request);
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
