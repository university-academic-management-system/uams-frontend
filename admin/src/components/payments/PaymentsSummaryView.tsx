import { useMemo, useCallback } from "react";
import { Download, FileX } from "lucide-react";
import { PaymentServices } from "@services/payment.service";
import { 
    Box, 
    Table, 
    EmptyState, 
    VStack, 
    Flex, 
    Heading, 
    Button, 
    Spinner, 
    Text 
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

interface PaymentsSummaryViewProps {
    onViewAllRevenue: (programTypeId: string, programTypeName: string) => void;
}

// interface ProgramTypeSummary {
//     id: string;
//     name: string;
//     code: string;
//     totalAmount: string;
//     totalPayments: number;
//     accessFee: { total: string; count: number; amount: number; average: string | number };
//     idCardFee: { total: string; count: number; amount: number; average: string | number };
//     transcriptFee?: { total: string; count: number; amount: number; average: string | number };
//     otherPayments: { total: string; count: number; amount: number };
// }

const PaymentsSummaryView = ({ onViewAllRevenue }: PaymentsSummaryViewProps) => {
    const { data: response, isLoading: summaryLoading, isError } = useQuery({
        queryKey: ["payments-summary-aggregation"],
        queryFn: () => PaymentServices.getPayments(1, 10000), // Fetch a large batch to aggregate summary
    });

    const programTypeList = useMemo(() => {
        if (!response?.data) return [];
        
        let totalAccess = 0;
        let totalIdCard = 0;
        let totalTranscript = 0;
        
        response.data.forEach((payment) => {
            if (payment.status !== "PAID") return;
            const type = payment.type || "";
            if (type.includes("ACCESS_FEE")) totalAccess += Number(payment.amount);
            if (type.includes("ID_CARD")) totalIdCard += Number(payment.amount);
            if (type.includes("TRANSCRIPT")) totalTranscript += Number(payment.amount);
        });

        // We return a single aggregated "All Programmes" row
        return [{
            id: "",
            name: "All Programmes",
            code: "ALL",
            accessFee: { amount: totalAccess },
            idCardFee: { amount: totalIdCard },
            transcriptFee: { amount: totalTranscript },
        }];
    }, [response]);

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amount);
    }, []);

    return (
        <Box>
            <Flex direction="column" gap="6">
                {/* Header */}
                <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                        <Heading size="3xl" fontWeight="bold" color="fg.muted">Payments Overview</Heading>
                        <Text fontSize="sm" color="fg.subtle">Revenue summary across different programme types</Text>
                    </Box>
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
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">ACCESS FEE</Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">ID CARD FEE</Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">TRANSCRIPT FEE</Table.ColumnHeader>
                                <Table.ColumnHeader bg="slate.50" px="6" py="4" textAlign="right"></Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {summaryLoading ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="20">
                                        <Flex direction="column" alignItems="center" justify="center" gap="4">
                                            <Spinner size="xl" color="accent" />
                                            <Text color="fg.muted">Loading summary data...</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : isError ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="20">
                                        <Flex justify="center">
                                            <Text color="red.500">Failed to load revenue data. Please try again.</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : programTypeList.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="20">
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
                                programTypeList.map((pt, index) => (
                                    <Table.Row key={pt.id} _hover={{ bg: "slate.50" }} borderColor="border.muted">
                                        <Table.Cell px="6" py="4" fontSize="xs" fontWeight="medium">{index + 1}</Table.Cell>
                                        <Table.Cell px="6" py="4" fontSize="sm" fontWeight="bold">{pt.name}</Table.Cell>
                                        <Table.Cell px="6" py="4" fontSize="sm" fontWeight="medium" color="fg.muted">
                                            {formatCurrency(pt.accessFee?.amount ?? 0)}
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4" fontSize="sm" fontWeight="medium" color="fg.muted">
                                            {formatCurrency(pt.idCardFee?.amount ?? 0)}
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4" fontSize="sm" fontWeight="medium" color="fg.muted">
                                            {formatCurrency(pt.transcriptFee?.amount ?? 0)}
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4" textAlign="right">
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                borderRadius="md"
                                                color="#1D7AD9"
                                                fontWeight="bold"
                                                onClick={() => onViewAllRevenue(pt.id, pt.name)}
                                            >
                                                View Details
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Flex>
        </Box>
    );
};

export default PaymentsSummaryView;