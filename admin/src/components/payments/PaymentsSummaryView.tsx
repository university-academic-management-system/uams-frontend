import { useMemo, useCallback } from "react";
import { Download, FileX } from "lucide-react";
import { PaymentServices } from "@services/payment.service";
import { 
    Box, 
    Table, 
    EmptyState, 
    VStack, 
    Flex,
    Button, 
    Spinner, 
    Text 
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { PaymentSummaryItem } from "@type/payment.type";

interface PaymentsSummaryViewProps {
    onViewDetails: (programTypeCode: string) => void;
}

/** Converts SCREAMING_SNAKE_CASE keys into readable labels. */
const formatPaymentType = (key: string): string =>
    key
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");

const PaymentsSummaryView = ({ onViewDetails }: PaymentsSummaryViewProps) => {
    const { data: response, isLoading: summaryLoading, isError } = useQuery({
        queryKey: ["payments-summary"],
        queryFn: () => PaymentServices.getPaymentsSummary(),
    });

    const { paymentTypeKeys, rows } = useMemo(() => {
        const rawData: Record<string, PaymentSummaryItem> | undefined =
            response?.data;

        if (!rawData || typeof rawData !== "object") {
            return { paymentTypeKeys: [] as string[], rows: [] as { id: string; title: string; code: string; summaries: Record<string, number> }[] };
        }

        const keySet = new Set<string>();
        const rowList: { id: string; title: string; code: string; summaries: Record<string, number> }[] = [];

        for (const [id, item] of Object.entries(rawData)) {
            rowList.push({
                id,
                title: item.title,
                code: item.code,
                summaries: item.paymentSummaries ?? {},
            });
            if (item.paymentSummaries) {
                Object.keys(item.paymentSummaries).forEach((k) => keySet.add(k));
            }
        }

        return { paymentTypeKeys: Array.from(keySet), rows: rowList };
    }, [response]);

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amount);
    }, []);

    const columnTotals = useMemo(() => {
        const totals: Record<string, number> = {};
        for (const key of paymentTypeKeys) {
            totals[key] = rows.reduce((sum, r) => sum + (r.summaries[key] ?? 0), 0);
        }
        return totals;
    }, [paymentTypeKeys, rows]);

    return (
        <Box>
            <Flex direction="column" gap="6">
                <Flex justifyContent="flex-end" alignItems="center">
                    <Button bg="accent" color="white" borderRadius="md" fontWeight="bold" size="xl" variant="solid">
                        <Download size={16} /> Export Summary
                    </Button>
                </Flex>

                {/* Table Container */}
                <Box bg="white" borderRadius="md" border="1px solid" borderColor="border.muted" overflow="hidden" shadow="none">
                    <Table.Root size="sm" variant="line">
                        <Table.Header bg="bg.subtle">
                            <Table.Row>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">S/N</Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">PROGRAMME TYPE</Table.ColumnHeader>
                                {paymentTypeKeys.map((key) => (
                                    <Table.ColumnHeader
                                        key={key}
                                        bg="slate.50"
                                        px="6"
                                        py="4"
                                        fontSize="11px"
                                        fontWeight="bold"
                                        color="fg.muted"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        whiteSpace="nowrap"
                                    >
                                        {formatPaymentType(key)}
                                    </Table.ColumnHeader>
                                ))}
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" textAlign="right"></Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {summaryLoading ? (
                                <Table.Row>
                                    <Table.Cell colSpan={paymentTypeKeys.length + 3} py="20">
                                        <Flex direction="column" alignItems="center" justify="center" gap="4">
                                            <Spinner size="xl" color="accent" />
                                            <Text color="fg.muted">Loading summary data...</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : isError ? (
                                <Table.Row>
                                    <Table.Cell colSpan={paymentTypeKeys.length + 3} py="20">
                                        <Flex justify="center">
                                            <Text color="red.500">Failed to load revenue data. Please try again.</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : rows.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={paymentTypeKeys.length + 3} py="20">
                                        <EmptyState.Root>
                                            <EmptyState.Content>
                                                <EmptyState.Indicator>
                                                    <FileX />
                                                </EmptyState.Indicator>
                                                <VStack textAlign="center">
                                                    <EmptyState.Title>No Payment Data Found</EmptyState.Title>
                                                    <EmptyState.Description>
                                                        There are currently no recorded payments for any programme type.
                                                    </EmptyState.Description>
                                                </VStack>
                                            </EmptyState.Content>
                                        </EmptyState.Root>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                <>
                                    {rows.map((row, index) => (
                                        <Table.Row key={row.id} _hover={{ bg: "slate.50" }} borderColor="border.muted">
                                            <Table.Cell px="6" py="4" fontSize="xs" fontWeight="medium">{index + 1}</Table.Cell>
                                            <Table.Cell px="6" py="4" fontSize="sm" fontWeight="bold">
                                                {row.title}
                                                <Text fontSize="2xs" color="fg.subtle" fontWeight="medium">{row.code}</Text>
                                            </Table.Cell>
                                            {paymentTypeKeys.map((key) => (
                                                <Table.Cell key={key} px="6" py="4" fontSize="sm" fontWeight="medium" color="fg.muted">
                                                    {formatCurrency(row.summaries[key] ?? 0)}
                                                </Table.Cell>
                                            ))}
                                            <Table.Cell px="6" py="4" textAlign="right">
                                                <Button
                                                    variant="ghost"
                                                    size="xs"
                                                    borderRadius="md"
                                                    color="#1D7AD9"
                                                    fontWeight="bold"
                                                    onClick={() => onViewDetails(row.id)}
                                                >
                                                    View Details
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}

                                    {/* Totals Row */}
                                    <Table.Row bg="slate.50" borderTop="2px solid" borderColor="border.muted">
                                        <Table.Cell px="6" py="4"></Table.Cell>
                                        <Table.Cell px="6" py="4" fontSize="sm" fontWeight="bold" color="fg">
                                            Total
                                        </Table.Cell>
                                        {paymentTypeKeys.map((key) => (
                                            <Table.Cell key={key} px="6" py="4" fontSize="sm" fontWeight="bold" color="fg">
                                                {formatCurrency(columnTotals[key] ?? 0)}
                                            </Table.Cell>
                                        ))}
                                        <Table.Cell px="6" py="4"></Table.Cell>
                                    </Table.Row>
                                </>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Flex>
        </Box>
    );
};

export default PaymentsSummaryView;