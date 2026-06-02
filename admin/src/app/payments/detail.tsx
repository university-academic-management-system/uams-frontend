import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
    Box, Flex, Text, Input, Spinner,
    Table, Button, Badge, Portal, Select,
    createListCollection, InputGroup,
    Tabs, VStack, EmptyState, DatePicker, Grid, GridItem
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuRotateCcw, LuEye, LuArrowLeft, LuCalendar } from "react-icons/lu";
import { Search, ChevronDown, X, FileX } from "lucide-react";
import { PaymentServices } from "@services/payment.service";
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot
} from "@components/ui/pagination";
import type { Payment, PaymentSummaryItem } from "@type/payment.type";
import PaymentDetailsSidebar from "@components/payments/PaymentDetailsSidebar";
import { useSidebarStore } from "@stores/ui.store";

const ITEMS_PER_PAGE = 10;

/** Converts SCREAMING_SNAKE_CASE keys into readable tab labels. */
const formatPaymentType = (key: string): string =>
    key
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        PAID: "green",
        PENDING: "yellow",
        FAILED: "red",
        CANCELLED: "gray",
    };
    return (
        <Badge variant="subtle" colorPalette={colors[status] || "gray"} borderRadius="md" size="sm" px="3">
            {status}
        </Badge>
    );
};

/** Inner component that renders the transactions table for a specific payment type tab. */
const PaymentTypePanel = ({
    programTypeCode,
    paymentType,
}: {
    programTypeCode: string;
    paymentType: string;
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sessionFilter, setSessionFilter] = useState("");
    const [levelFilter, setLevelFilter] = useState("");
    const [semesterFilter, setSemesterFilter] = useState("");
    const [deliveryMethodFilter, setDeliveryMethodFilter] = useState("");
    const [dateRange, setDateRange] = useState<string[]>([]);
    const [resetKey, setResetKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const startDate = dateRange[0] || "";
    const endDate = dateRange[1] || "";

    const { data: response, isLoading, isError, refetch } = useQuery({
        queryKey: [
            "payments-by-type",
            programTypeCode,
            paymentType,
            currentPage,
            searchQuery,
            statusFilter,
            sessionFilter,
            levelFilter,
            semesterFilter,
            startDate,
            endDate,
            deliveryMethodFilter,
        ],
        queryFn: () =>
            PaymentServices.getPaymentsByType(
                programTypeCode,
                paymentType,
                currentPage,
                ITEMS_PER_PAGE,
                searchQuery,
                statusFilter,
                sessionFilter,
                levelFilter,
                semesterFilter,
                startDate,
                endDate,
                deliveryMethodFilter
            ),
    });

    const payments: Payment[] = useMemo(() => {
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.data?.data)) return response.data.data;
        return [];
    }, [response]);

    const pagination = response?.pagination;

    const sessionCollection = useMemo(() => {
        const sessions = Array.from(new Set(payments.map((p) => p.session).filter(Boolean)));
        return createListCollection({
            items: [
                { label: "All Sessions", value: "" },
                ...sessions.map((s) => ({ label: s, value: s })),
            ],
        });
    }, [payments]);

    const levelCollection = useMemo(() => {
        const levels = Array.from(new Set(payments.map((p) => p.level).filter(Boolean)));
        return createListCollection({
            items: [
                { label: "All Levels", value: "" },
                ...levels.map((l) => ({ label: l.replace(/^L/, ''), value: l })),
            ],
        });
    }, [payments]);

    const semesterCollection = useMemo(() => {
        const semesters = Array.from(new Set(payments.map((p) => p.semester).filter(Boolean)));
        return createListCollection({
            items: [
                { label: "All Semesters", value: "" },
                ...semesters.map((s) => ({ label: s, value: s })),
            ],
        });
    }, [payments]);

    const statusCollection = useMemo(
        () =>
            createListCollection({
                items: [
                    { label: "All Statuses", value: "" },
                    { label: "PENDING", value: "PENDING" },
                    { label: "PAID", value: "PAID" },
                    { label: "FAILED", value: "FAILED" },
                    { label: "VERIFYING", value: "VERIFYING" },
                    { label: "CANCELLED", value: "CANCELLED" },
                    { label: "EXPIRED", value: "EXPIRED" },
                    { label: "ABANDONED", value: "ABANDONED" },
                    { label: "ONGOING", value: "ONGOING" },
                    { label: "PROCESSING", value: "PROCESSING" },
                    { label: "QUEUED", value: "QUEUED" },
                    { label: "REVERSED", value: "REVERSED" },
                ],
            }),
        []
    );

    const deliveryMethodCollection = useMemo(
        () =>
            createListCollection({
                items: [
                    { label: "--", value: "" },
                    { label: "DIGITAL_DELIVERY", value: "DIGITAL_DELIVERY" },
                    { label: "COURIER_SERVICE", value: "COURIER_SERVICE" },
                    { label: "PHYSICAL_PICKUP", value: "PHYSICAL_PICKUP" },
                ],
            }),
        []
    );

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
        },
        []
    );

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amount);
    }, []);

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }, []);

    return (
        <Box bg="white" borderRadius="md" border="1px solid" borderColor="border.muted" overflow="hidden" shadow="none">
            {/* Filters */}
            <Flex direction="column" p="6" gap="4" colorPalette="accent">
                {/* Row 1: Search and Refresh */}
                <Grid templateColumns={{ base: "1fr", xl: "1fr auto" }} gap="4" w="full" alignItems="center">
                    <GridItem>
                        <InputGroup startElement={<Search size={20} color="gray" />} w="full" maxW={{ base: "100%", xl: "500px" }}>
                            <Input
                                size="lg"
                                type="text"
                                placeholder="Search by name, reference, matric no..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                bg="white"
                                border="xs"
                                borderColor="border.muted"
                                ps="11"
                            />
                        </InputGroup>
                    </GridItem>

                    <GridItem>
                        <Button
                            variant="outline"
                            size="xl"
                            colorPalette="gray"
                            onClick={() => refetch()}
                            disabled={isLoading}
                            borderRadius="md"
                        >
                            <LuRotateCcw /> Refresh
                        </Button>
                    </GridItem>
                </Grid>

                {/* Row 2: Selects and Actions */}
                <Flex gap="3" alignItems="center" flexWrap="wrap">

                    <Select.Root
                        collection={statusCollection}
                        value={statusFilter ? [statusFilter] : []}
                        onValueChange={(e) => { setStatusFilter(e.value[0] || ""); setCurrentPage(1); }}
                        size="lg"
                        width="140px"
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                <Select.ValueText placeholder="Status" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator><ChevronDown size={16} color="#64748b" /></Select.Indicator>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {statusCollection.items.map((item) => (
                                        <Select.Item item={item} key={item.value}>
                                            <Select.ItemText>{item.label}</Select.ItemText>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Select.Root
                        collection={sessionCollection.items.length > 0 ? sessionCollection : createListCollection({ items: [{ label: "All Sessions", value: "" }] })}
                        value={sessionFilter ? [sessionFilter] : []}
                        onValueChange={(e) => { setSessionFilter(e.value[0] || ""); setCurrentPage(1); }}
                        size="lg"
                        width="130px"
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                <Select.ValueText placeholder="Session" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator><ChevronDown size={16} color="#64748b" /></Select.Indicator>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {(sessionCollection.items.length > 0 ? sessionCollection : createListCollection({ items: [{ label: "All Sessions", value: "" }] })).items.map((item) => (
                                        <Select.Item item={item} key={item.value}>
                                            <Select.ItemText>{item.label}</Select.ItemText>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Select.Root
                        collection={levelCollection.items.length > 0 ? levelCollection : createListCollection({ items: [{ label: "All Levels", value: "" }] })}
                        value={levelFilter ? [levelFilter] : []}
                        onValueChange={(e) => { setLevelFilter(e.value[0] || ""); setCurrentPage(1); }}
                        size="lg"
                        width="110px"
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                <Select.ValueText placeholder="Level" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator><ChevronDown size={16} color="#64748b" /></Select.Indicator>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {(levelCollection.items.length > 0 ? levelCollection : createListCollection({ items: [{ label: "All Levels", value: "" }] })).items.map((item) => (
                                        <Select.Item item={item} key={item.value}>
                                            <Select.ItemText>{item.label}</Select.ItemText>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Select.Root
                        collection={semesterCollection.items.length > 0 ? semesterCollection : createListCollection({ items: [{ label: "All Semesters", value: "" }] })}
                        value={semesterFilter ? [semesterFilter] : []}
                        onValueChange={(e) => { setSemesterFilter(e.value[0] || ""); setCurrentPage(1); }}
                        size="lg"
                        width="140px"
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                <Select.ValueText placeholder="Semester" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator><ChevronDown size={16} color="#64748b" /></Select.Indicator>
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {(semesterCollection.items.length > 0 ? semesterCollection : createListCollection({ items: [{ label: "All Semesters", value: "" }] })).items.map((item) => (
                                        <Select.Item item={item} key={item.value}>
                                            <Select.ItemText>{item.label}</Select.ItemText>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    {paymentType === "TRANSCRIPT_REQUEST_FEE" && (
                        <Select.Root
                            collection={deliveryMethodCollection}
                            value={deliveryMethodFilter ? [deliveryMethodFilter] : []}
                            onValueChange={(e) => { setDeliveryMethodFilter(e.value[0] || ""); setCurrentPage(1); }}
                            size="lg"
                            width="190px"
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                    <Select.ValueText placeholder="Delivery Method" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator><ChevronDown size={16} color="#64748b" /></Select.Indicator>
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {deliveryMethodCollection.items.map((item) => (
                                            <Select.Item item={item} key={item.value}>
                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    )}

                    <Box>
                        <DatePicker.Root openOnClick
                            key={resetKey}
                            size="lg"
                            selectionMode="range" 
                            onValueChange={(e) => {
                                const range = e.value.map(d => {
                                    const date = new Date(d.year, d.month - 1, d.day);
                                    return date.toISOString();
                                });
                                setDateRange(range);
                                setCurrentPage(1);
                            }}
                        >
                            <DatePicker.Control flexWrap="nowrap" w={{ base: "full", md: "300px" }}>
                                <DatePicker.Input index={0} bg="white" placeholder="Start Date" w="full" border="xs" borderColor="border.muted" />
                                <DatePicker.Input index={1} bg="white" placeholder="End Date" w="full" border="xs" borderColor="border.muted" />
                                <DatePicker.IndicatorGroup>
                                    <DatePicker.Trigger>
                                        <LuCalendar />
                                    </DatePicker.Trigger>
                                </DatePicker.IndicatorGroup>
                            </DatePicker.Control>
                            <Portal>
                                <DatePicker.Positioner>
                                    <DatePicker.Content>
                                        <DatePicker.View view="day">
                                            <DatePicker.Header />
                                            <DatePicker.DayTable />
                                        </DatePicker.View>
                                        <DatePicker.View view="month">
                                            <DatePicker.Header />
                                            <DatePicker.MonthTable />
                                        </DatePicker.View>
                                        <DatePicker.View view="year">
                                            <DatePicker.Header />
                                            <DatePicker.YearTable />
                                        </DatePicker.View>
                                    </DatePicker.Content>
                                </DatePicker.Positioner>
                            </Portal>
                        </DatePicker.Root>
                    </Box>

                    <Button
                        onClick={() => {
                            setStatusFilter("");
                            setSessionFilter("");
                            setLevelFilter("");
                            setSemesterFilter("");
                            setDeliveryMethodFilter("");
                            setDateRange([]);
                            setResetKey(prev => prev + 1);
                            setSearchQuery("");
                            setCurrentPage(1);
                        }}
                        variant="ghost"
                        color="fg.muted"
                        size="xl"
                        px="3"
                        aria-label="Clear filters"
                    >
                        <X size={16} />
                    </Button>
                </Flex>
            </Flex>

            {/* Table */}
            {isLoading ? (
                <Flex direction="column" alignItems="center" justify="center" py="20" gap="4">
                    <Spinner size="xl" color="accent" />
                    <Text color="fg.muted">Loading transactions...</Text>
                </Flex>
            ) : isError ? (
                <Flex justify="center" py="20">
                    <Text color="red.500">Failed to load payments. Please try again.</Text>
                </Flex>
            ) : payments.length === 0 ? (
                <Box py="20">
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <FileX size={40} />
                            </EmptyState.Indicator>
                            <VStack textAlign="center">
                                <EmptyState.Title>No Transactions Found</EmptyState.Title>
                                <EmptyState.Description>
                                    There are no transactions for this payment type yet.
                                </EmptyState.Description>
                            </VStack>
                        </EmptyState.Content>
                    </EmptyState.Root>
                </Box>
            ) : (
                <Table.Root size="sm" variant="line">
                    <Table.Header bg="bg.subtle">
                        <Table.Row>
                            <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">S/N</Table.ColumnHeader>
                            <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">DATE</Table.ColumnHeader>
                            <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">STUDENT</Table.ColumnHeader>
                            <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">REFERENCE</Table.ColumnHeader>
                            <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">AMOUNT</Table.ColumnHeader>
                            <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">SESSION / LEVEL</Table.ColumnHeader>
                            {paymentType === "TRANSCRIPT_REQUEST_FEE" && (
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">DELIVERY METHOD</Table.ColumnHeader>
                            )}
                            <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">STATUS</Table.ColumnHeader>
                            <Table.ColumnHeader bg="slate.50" px="6" py="4" textAlign="right"></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {payments.map((payment: Payment, index: number) => (
                            <Table.Row key={payment.id} _hover={{ bg: "slate.50" }} borderColor="border.muted">
                                <Table.Cell px="6" py="4" fontSize="xs" fontWeight="bold" color="fg.muted">
                                    {((currentPage - 1) * ITEMS_PER_PAGE) + index + 1}
                                </Table.Cell>
                                <Table.Cell px="6" py="4" fontSize="xs" fontWeight="medium">
                                    {formatDate(payment.createdAt)}
                                </Table.Cell>
                                <Table.Cell px="6" py="4">
                                    <Text fontWeight="bold" fontSize="xs">
                                        {payment.student
                                            ? `${payment.student.surname} ${payment.student.firstName}`
                                            : "—"}
                                    </Text>
                                    <Text fontSize="2xs" color="fg.subtle">
                                        {payment.student?.matricNumber || payment.student?.registrationNo || payment.studentId.slice(0, 8) + "..."}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell px="6" py="4">
                                    <Text fontWeight="bold" fontSize="xs">{payment.reference}</Text>
                                    <Text fontSize="2xs" color="fg.subtle">{payment.paymentChannel}</Text>
                                </Table.Cell>
                                <Table.Cell px="6" py="4" fontWeight="bold" color="accent" fontSize="xs">
                                    {formatCurrency(Number(payment.amount))}
                                </Table.Cell>
                                <Table.Cell px="6" py="4" fontSize="xs">
                                    <Text fontWeight="medium">{payment.session}</Text>
                                    <Text fontSize="2xs" color="fg.subtle">{payment.level} - {payment.semester}</Text>
                                </Table.Cell>
                                {paymentType === "TRANSCRIPT_REQUEST_FEE" && (
                                    <Table.Cell px="6" py="4" fontSize="xs" fontWeight="bold">
                                        {payment.metadata?.deliveryMethod?.replace(/_/g, ' ') || "—"}
                                    </Table.Cell>
                                )}
                                <Table.Cell px="6" py="4">
                                    <StatusBadge status={payment.status} />
                                </Table.Cell>
                                <Table.Cell px="6" py="4" textAlign="right">
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        borderRadius="md"
                                        color="accent"
                                        fontWeight="bold"
                                        onClick={() => setSelectedPayment(payment)}
                                    >
                                        <LuEye /> Details
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <Flex alignItems="center" justifyContent="space-between" bg="bg.subtle" p="4" borderTop="1px solid" borderColor="border.muted">
                    <Text fontSize="xs" color="fg.muted">
                        Showing page <Text as="span" fontWeight="bold">{pagination.page}</Text> of {pagination.totalPages}
                        {" "}({pagination.total} total transactions)
                    </Text>
                    <PaginationRoot
                        count={pagination.total}
                        pageSize={ITEMS_PER_PAGE}
                        page={currentPage}
                        onPageChange={(e) => setCurrentPage(e.page)}
                    >
                        <Flex gap="2">
                            <PaginationPrevTrigger />
                            <PaginationItems />
                            <PaginationNextTrigger />
                        </Flex>
                    </PaginationRoot>
                </Flex>
            )}

            <PaymentDetailsSidebar
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
                payment={selectedPayment}
            />
        </Box>
    );
};

/** The detail page for a specific programme type, e.g. /payments/bsc */
const PaymentsDetailPage = () => {
    const { programTypeCode } = useParams<{ programTypeCode: string }>();
    const navigate = useNavigate();
    const { setPageTitle } = useSidebarStore();

    // Fetch the summary to get the programme title and payment type keys for tabs
    const { data: summaryResponse, isLoading: summaryLoading } = useQuery({
        queryKey: ["payments-summary"],
        queryFn: () => PaymentServices.getPaymentsSummary(),
    });

    const programData: PaymentSummaryItem | undefined = useMemo(() => {
        if (!summaryResponse?.data || !programTypeCode) return undefined;
        return summaryResponse.data[programTypeCode];
    }, [summaryResponse, programTypeCode]);

    const paymentTypeKeys = useMemo(() => {
        if (!programData?.paymentSummaries) return [];
        return Object.keys(programData.paymentSummaries);
    }, [programData]);

    const defaultTab = paymentTypeKeys[0] || "";

    useEffect(() => {
        if (programData) {
            setPageTitle(`${programData.title} (${programData.code})`);
        }
        return () => {
            setPageTitle("");
        };
    }, [programData, setPageTitle]);

    if (summaryLoading) {
        return (
            <Flex direction="column" alignItems="center" justify="center" minH="400px" gap="4">
                <Spinner size="xl" color="accent" />
                <Text color="fg.muted">Loading...</Text>
            </Flex>
        );
    }

    if (!programData || !programTypeCode) {
        return (
            <Box>
                <Button variant="ghost" size="sm" onClick={() => navigate("/payments")} mb="4" p="0" borderRadius="md" fontWeight="bold" color="accent">
                    <LuArrowLeft /> Back to Summary
                </Button>
                <Flex justify="center" py="20">
                    <Text color="red.500">Programme type not found.</Text>
                </Flex>
            </Box>
        );
    }

    return (
        <Flex direction="column" gap="6">
            <Flex justifyContent="space-between" alignItems="center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/payments")}
                    mb="2"
                    p="0"
                    borderRadius="md"
                    fontWeight="bold"
                    color="accent"
                >
                    <LuArrowLeft /> Back to Summary
                </Button>
            </Flex>

            {/* Tabs per payment type */}
            <Box>
                {paymentTypeKeys.length === 0 ? (
                    <Box bg="white" borderRadius="md" border="1px solid" borderColor="border.muted" overflow="hidden" shadow="none" py="20">
                        <EmptyState.Root>
                            <EmptyState.Content>
                                <EmptyState.Indicator><FileX size={40} /></EmptyState.Indicator>
                                <VStack textAlign="center">
                                    <EmptyState.Title>No Payment Types</EmptyState.Title>
                                    <EmptyState.Description>
                                        No payment types are configured for this programme.
                                    </EmptyState.Description>
                                </VStack>
                            </EmptyState.Content>
                        </EmptyState.Root>
                    </Box>
                ) : (
                    <Tabs.Root defaultValue={defaultTab} variant="enclosed" position="relative">
                        <Tabs.List mb="6">
                            {paymentTypeKeys.map((key) => (
                                <Tabs.Trigger key={key} value={key}>
                                    {formatPaymentType(key)}
                                </Tabs.Trigger>
                            ))}
                        </Tabs.List>

                        {paymentTypeKeys.map((key) => (
                            <Tabs.Content key={key} value={key} p={0}>
                                <PaymentTypePanel
                                    programTypeCode={programTypeCode}
                                    paymentType={key}
                                />
                            </Tabs.Content>
                        ))}
                    </Tabs.Root>
                )}
            </Box>
        </Flex>
    );
};

export default PaymentsDetailPage;
