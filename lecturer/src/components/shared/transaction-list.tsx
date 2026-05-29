import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, Icon, Input, Spinner, Table } from "@chakra-ui/react";
import { Search, Download, Upload, X, ArrowLeft } from "lucide-react";
import { PaymentHook } from "@hooks/payment.hook";
import type { PaymentTab, TransactionItem, ProgramPayments, ProgramTypeSummary } from "@type/payment.type";

interface TransactionsListProps {
    onBack: () => void;
    programTypeId?: string | null;
    programTypeName?: string;
}

const TransactionsList = ({ onBack, programTypeId, programTypeName:_programTypeName  }: TransactionsListProps) => {
    const [activeTab, setActiveTab] = useState<PaymentTab>("Access Fee");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sessionFilter, setSessionFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const { data, isLoading } = PaymentHook.usePayments();

    const tabs: PaymentTab[] = ["Access Fee", "ID Card", "Transcript"];

    // Find matching program data
    const programPayments: ProgramPayments | undefined = useMemo(() => {
        if (!data?.success) return undefined;
        return data.data.paymentsByProgramType?.find(
            (p: ProgramPayments) => p.programInfo.id === programTypeId
        );
    }, [data, programTypeId]);

    const programSummary: ProgramTypeSummary | undefined = useMemo(() => {
        if (!data?.success) return undefined;
        const summaries = data.data.summary?.programTypes || {};
        return Object.values(summaries).find((s) => s.id === programTypeId);
    }, [data, programTypeId]);

    // Get transactions for the active tab
    const tabTransactions: TransactionItem[] = useMemo(() => {
        if (!programPayments) return [];
        switch (activeTab) {
            case "Access Fee": return programPayments.accessFee || [];
            case "ID Card": return programPayments.idCardFee || [];
            case "Transcript": return programPayments.transcriptFee || [];
            default: return [];
        }
    }, [programPayments, activeTab]);

    // Get the total amount for the active tab from summary
    const tabTotal = useMemo(() => {
        if (!programSummary) return 0;
        switch (activeTab) {
            case "Access Fee": return programSummary.accessFee.amount;
            case "ID Card": return programSummary.idCardFee.amount;
            case "Transcript": return programSummary.transcriptFee.amount;
            default: return 0;
        }
    }, [programSummary, activeTab]);

    // Apply search, status, date filters
    const filteredTransactions = useMemo(() => {
        return tabTransactions.filter((t) => {
            const matchesSearch =
                !searchQuery ||
                t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.paymentFrom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.studentRegNumber.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "all" || t.status === statusFilter;

            let matchesDate = true;
            if (dateFrom) {
                matchesDate = matchesDate && new Date(t.date) >= new Date(dateFrom);
            }
            if (dateTo) {
                const toDate = new Date(dateTo);
                toDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && new Date(t.date) <= toDate;
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [tabTransactions, searchQuery, statusFilter, dateFrom, dateTo]);

    const handleClearDateFilters = () => {
        setDateFrom("");
        setDateTo("");
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "success": return { bg: "#dcfce7", color: "#15803d" };
            case "pending": return { bg: "#fef9c3", color: "#a16207" };
            case "failed": return { bg: "#fee2e2", color: "#dc2626" };
            default: return { bg: "#f1f5f9", color: "#475569" };
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "success": return "Success";
            case "pending": return "Pending";
            case "failed": return "Decline";
            default: return status;
        }
    };

    const formatCurrency = (amount: number | string) => {
        const num = typeof amount === "string" ? parseFloat(amount) : amount;
        return "₦" + new Intl.NumberFormat("en-NG").format(num);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };

    const truncateRef = (ref: string) => {
        if (ref.length <= 20) return ref;
        return ref.substring(0, 8) + "…." + ref.substring(ref.length - 4);
    };

    const tabLabel = activeTab === "Access Fee" ? "Access Fee" : activeTab === "ID Card" ? "ID Card" : "Transcript";

    /* ─── Shared th styles ─── */
    const thStyle = {
        px: "6",
        py: "4",
        fontSize: "xs",
        fontWeight: "bold",
        color: "#94a3b8",
        textTransform: "uppercase" as const,
        letterSpacing: "wider",
    };

    /* ─── Select styles ─── */
    const selectStyle: React.CSSProperties = {
        appearance: "none" as const,
        padding: "8px 32px 8px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "9999px",
        background: "white",
        outline: "none",
        fontSize: "14px",
        fontWeight: 500,
        color: "#475569",
        cursor: "pointer",
    };

    return (
        <Box minH="100vh" bg="#F8FAFC">
            <Box maxW="1400px" mx="auto" py="2" px="2">
                {/* Back Button */}
                <Flex
                    as="button"
                    align="center"
                    gap="2"
                    color="#64748b"
                    _hover={{ color: "#1e293b" }}
                    transition="colors 0.2s"
                    mb="4"
                    bg="transparent"
                    border="none"
                    cursor="pointer"
                    onClick={onBack}
                    role="group"
                >
                    <Icon
                        as={ArrowLeft}
                        boxSize="20px"
                        _groupHover={{ transform: "translateX(-4px)" }}
                        transition="transform 0.2s"
                    />
                    <Text fontWeight="medium">Back to Payments</Text>
                </Flex>

                {/* Tabs */}
                <Flex align="center" mb="6">
                    <Flex bg="white" border="1px solid" borderColor="#e2e8f0" borderRadius="lg" overflow="hidden">
                        {tabs.map((tab) => (
                            <Box
                                as="button"
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                px="6"
                                py="2.5"
                                fontSize="sm"
                                fontWeight="semibold"
                                transition="colors 0.2s"
                                bg={activeTab === tab ? "white" : "transparent"}
                                color={activeTab === tab ? "#1D7AD9" : "#64748b"}
                                _hover={activeTab !== tab ? { color: "#334155" } : {}}
                                border="none"
                                borderBottomWidth="2px"
                                borderBottomStyle="solid"
                                borderBottomColor={activeTab === tab ? "#1D7AD9" : "transparent"}
                                cursor="pointer"
                            >
                                {tab}
                            </Box>
                        ))}
                    </Flex>
                </Flex>

                {/* Summary Card + Export */}
                <Flex align="flex-start" justify="space-between" mb="8">
                    <Flex
                        borderRadius="xl"
                        px="8"
                        py="6"
                        align="center"
                        gap="4"
                        minW="400px"
                        style={{ background: "linear-gradient(to right, #e8f5e9, #f1f8e9)" }}
                    >
                        <Flex
                            h="48px"
                            w="48px"
                            borderRadius="lg"
                            bg="rgba(76,175,80,0.2)"
                            align="center"
                            justify="center"
                        >
                            <Icon as={Upload} boxSize="22px" color="#4caf50" />
                        </Flex>
                        <Box>
                            <Text fontSize="sm" color="#475569" fontWeight="medium">
                                Total {tabLabel} Payments
                            </Text>
                            <Heading as="h2" fontSize="3xl" fontWeight="bold" color="#0f172a">
                                {formatCurrency(tabTotal)}
                            </Heading>
                        </Box>
                    </Flex>

                    <Flex
                        as="button"
                        align="center"
                        gap="2"
                        bg="#1D7AD9"
                        color="white"
                        px="5"
                        py="2.5"
                        borderRadius="lg"
                        fontSize="sm"
                        fontWeight="bold"
                        boxShadow="0 10px 15px -3px rgba(59,130,246,0.2)"
                        _hover={{ bg: "#1d4ed8" }}
                        transition="all 0.2s"
                        border="none"
                        cursor="pointer"
                    >
                        <Icon as={Download} boxSize="18px" />
                        Export
                    </Flex>
                </Flex>

                {/* Transaction History Header + Filters */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "flex-start", md: "center" }}
                    mb="4"
                    gap="4"
                >
                    <Heading as="h2" fontSize="lg" fontWeight="bold" color="#0f172a">
                        Transaction History{" "}
                        <Text as="span" color="#94a3b8">({filteredTransactions.length})</Text>
                    </Heading>

                    <Flex align="center" gap="3" flexWrap="wrap">
                        {/* Search */}
                        <Box position="relative">
                            <Input
                                type="text"
                                placeholder="Search by name or transaction ID"
                                w="256px"
                                pl="10"
                                pr="4"
                                py="2"
                                border="1px solid"
                                borderColor="#e2e8f0"
                                borderRadius="full"
                                bg="white"
                                fontSize="sm"
                                _focus={{ ring: "2", ringColor: "rgba(59,130,246,0.1)" }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Icon
                                as={Search}
                                position="absolute"
                                left="3.5"
                                top="50%"
                                transform="translateY(-50%)"
                                color="#94a3b8"
                                boxSize="16px"
                                zIndex="1"
                            />
                        </Box>

                        {/* Status Filter */}
                        <Box position="relative">
                            <select
                                style={selectStyle}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Status</option>
                                <option value="success">Success</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Decline</option>
                            </select>
                            <Icon
                                as="svg"
                                position="absolute"
                                right="3"
                                top="50%"
                                transform="translateY(-50%)"
                                w="3"
                                h="3"
                                color="#94a3b8"
                                pointerEvents="none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </Icon>
                        </Box>

                        {/* Session Filter */}
                        <Box position="relative">
                            <select
                                style={selectStyle}
                                value={sessionFilter}
                                onChange={(e) => setSessionFilter(e.target.value)}
                            >
                                <option value="all">Session</option>
                            </select>
                            <Icon
                                as="svg"
                                position="absolute"
                                right="3"
                                top="50%"
                                transform="translateY(-50%)"
                                w="3"
                                h="3"
                                color="#94a3b8"
                                pointerEvents="none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </Icon>
                        </Box>

                        {/* Date From */}
                        <Flex align="center" gap="2">
                            <Text fontSize="sm" color="#64748b">From</Text>
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                px="3"
                                py="2"
                                border="1px solid"
                                borderColor="#e2e8f0"
                                borderRadius="full"
                                bg="white"
                                fontSize="sm"
                                color="#475569"
                                cursor="pointer"
                            />
                        </Flex>

                        {/* Date To */}
                        <Flex align="center" gap="2">
                            <Text fontSize="sm" color="#64748b">To</Text>
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                px="3"
                                py="2"
                                border="1px solid"
                                borderColor="#e2e8f0"
                                borderRadius="full"
                                bg="white"
                                fontSize="sm"
                                color="#475569"
                                cursor="pointer"
                            />
                        </Flex>

                        {/* Clear Dates */}
                        {(dateFrom || dateTo) && (
                            <Box
                                as="button"
                                onClick={handleClearDateFilters}
                                color="#94a3b8"
                                _hover={{ color: "#475569" }}
                                transition="colors 0.2s"
                                bg="transparent"
                                border="none"
                                cursor="pointer"
                            >
                                <Icon as={X} boxSize="18px" />
                            </Box>
                        )}
                    </Flex>
                </Flex>

                {/* Transactions Table */}
                <Box
                    bg="white"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="#e2e8f0"
                    boxShadow="sm"
                    overflow="hidden"
                >
                    <Box overflowX="auto">
                        <Table.Root size="sm">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader {...thStyle} w="14">S/N</Table.ColumnHeader>
                                    <Table.ColumnHeader {...thStyle}>Transaction Id</Table.ColumnHeader>
                                    <Table.ColumnHeader {...thStyle}>Payment from</Table.ColumnHeader>
                                    <Table.ColumnHeader {...thStyle}>Payment for</Table.ColumnHeader>
                                    <Table.ColumnHeader {...thStyle}>Amount</Table.ColumnHeader>
                                    <Table.ColumnHeader {...thStyle}>Date</Table.ColumnHeader>
                                    <Table.ColumnHeader {...thStyle} textAlign="right">Status</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {isLoading ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={7} px="6" py="16" textAlign="center" color="#94a3b8">
                                            <Flex justify="center" align="center" gap="2">
                                                <Spinner size="sm" color="#94a3b8" />
                                                <Text>Loading transactions...</Text>
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                ) : filteredTransactions.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={7} px="6" py="16" textAlign="center" color="#94a3b8">
                                            No transactions found.
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    filteredTransactions.map((t, index) => (
                                        <Table.Row
                                            key={t.transactionId}
                                            _hover={{ bg: "rgba(248,250,252,0.5)" }}
                                            transition="colors 0.15s"
                                        >
                                            <Table.Cell px="6" py="4" color="#64748b">
                                                {index + 1}
                                            </Table.Cell>
                                            <Table.Cell px="6" py="4" color="#475569" fontFamily="mono" fontSize="xs">
                                                {truncateRef(t.transactionReference)}
                                            </Table.Cell>
                                            <Table.Cell px="6" py="4" color="#334155" fontWeight="medium">
                                                {t.studentName}
                                            </Table.Cell>
                                            <Table.Cell px="6" py="4" color="#475569">
                                                {t.paymentFor}
                                            </Table.Cell>
                                            <Table.Cell px="6" py="4" fontWeight="bold" color="#0f172a">
                                                {formatCurrency(t.amount)}
                                            </Table.Cell>
                                            <Table.Cell px="6" py="4" color="#64748b">
                                                {formatDate(t.date)}
                                            </Table.Cell>
                                            <Table.Cell px="6" py="4" textAlign="right">
                                                <Text
                                                    as="span"
                                                    display="inline-block"
                                                    px="4"
                                                    py="1"
                                                    borderRadius="full"
                                                    fontSize="xs"
                                                    fontWeight="bold"
                                                    bg={getStatusStyle(t.status).bg}
                                                    color={getStatusStyle(t.status).color}
                                                >
                                                    {getStatusLabel(t.status)}
                                                </Text>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TransactionsList;
