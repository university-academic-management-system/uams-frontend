import {
    Box, Flex, Text, Button, Badge,
    Portal, CloseButton, Grid, GridItem
} from "@chakra-ui/react";
import { Drawer } from "@chakra-ui/react";
import { Download, Printer } from "lucide-react";
import type { Payment } from "@type/payment.type";

interface PaymentDetailsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment | null;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        PAID: "green",
        PENDING: "yellow",
        FAILED: "red",
        CANCELLED: "gray",
    };
    return (
        <Badge variant="subtle" colorPalette={colors[status] || "gray"} borderRadius="md" px="3" py="1">
            {status}
        </Badge>
    );
};

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <Box mb="4">
        <Text fontSize="xs" color="fg.muted" mb="1" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
            {label}
        </Text>
        <Text fontSize="sm" fontWeight="medium" wordBreak="break-word">
            {value || "N/A"}
        </Text>
    </Box>
);

export default function PaymentDetailsSidebar({ isOpen, onClose, payment }: PaymentDetailsSidebarProps) {
    if (!payment) return null;

    return (
        <Drawer.Root size="md" open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content bg="white" shadow="xl">
                        <Drawer.Header borderBottom="1px solid" borderColor="border.muted" py="4" px="6">
                            <Flex justify="space-between" align="center">
                                <Drawer.Title fontSize="lg" fontWeight="bold">Transaction Details</Drawer.Title>
                                <Drawer.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Drawer.CloseTrigger>
                            </Flex>
                        </Drawer.Header>
                        
                        <Drawer.Body px="6" py="6" bg="bg.canvas">
                            <Flex direction="column" gap="6">
                                {/* Header Summary */}
                                <Box bg="white" p="5" borderRadius="md" border="1px solid" borderColor="border.muted">
                                    <Flex justify="space-between" align="flex-start">
                                        <Box>
                                            <Text fontSize="2xl" fontWeight="bold" color="accent" mb="2">
                                                {formatCurrency(payment.amount)}
                                            </Text>
                                            <StatusBadge status={payment.status} />
                                        </Box>
                                        <Text fontSize="xs" color="fg.muted" textAlign="right">
                                            {formatDate(payment.createdAt)}
                                        </Text>
                                    </Flex>
                                </Box>

                                {/* Payment Information */}
                                <Box bg="white" p="5" borderRadius="md" border="1px solid" borderColor="border.muted">
                                    <Text fontSize="sm" fontWeight="bold" color="accent" mb="4">Payment Information</Text>
                                    <Grid templateColumns="repeat(2, 1fr)" gap="4">
                                        <GridItem>
                                            <DetailItem label="Reference" value={payment.reference} />
                                        </GridItem>
                                        <GridItem>
                                            <DetailItem label="Transaction ID" value={payment.id} />
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <DetailItem label="Payment Type" value={payment.type.replace(/_/g, " ")} />
                                        </GridItem>
                                        <GridItem>
                                            <DetailItem label="Channel" value={payment.paymentChannel} />
                                        </GridItem>
                                        <GridItem>
                                            <DetailItem label="Last Updated" value={formatDate(payment.updatedAt)} />
                                        </GridItem>
                                    </Grid>
                                </Box>

                                {/* Academic Context */}
                                <Box bg="white" p="5" borderRadius="md" border="1px solid" borderColor="border.muted">
                                    <Text fontSize="sm" fontWeight="bold" color="accent" mb="4">Academic Context</Text>
                                    <Grid templateColumns="repeat(2, 1fr)" gap="4">
                                        <GridItem>
                                            <DetailItem label="Student ID" value={payment.studentId} />
                                        </GridItem>
                                        <GridItem>
                                            <DetailItem label="Academic Session" value={payment.session} />
                                        </GridItem>
                                        <GridItem>
                                            <DetailItem label="Level" value={payment.level} />
                                        </GridItem>
                                        <GridItem>
                                            <DetailItem label="Semester" value={payment.semester} />
                                        </GridItem>
                                    </Grid>
                                </Box>

                                {/* Transcript Metadata (If any) */}
                                {payment.metadata?.transcriptRequestId && (
                                    <Box bg="white" p="5" borderRadius="md" border="1px solid" borderColor="border.muted">
                                        <Text fontSize="sm" fontWeight="bold" color="accent" mb="4">Transcript Request Details</Text>
                                        <Grid templateColumns="repeat(2, 1fr)" gap="4">
                                            <GridItem>
                                                <DetailItem label="Request ID" value={payment.metadata.transcriptRequestId} />
                                            </GridItem>
                                            <GridItem>
                                                <DetailItem label="Request Ref" value={payment.metadata.transcriptRequestReference} />
                                            </GridItem>
                                            <GridItem colSpan={2}>
                                                <DetailItem label="Delivery Method" value={payment.metadata.deliveryMethod} />
                                            </GridItem>
                                        </Grid>
                                    </Box>
                                )}
                            </Flex>
                        </Drawer.Body>
                        
                        <Drawer.Footer borderTop="1px solid" borderColor="border.muted" py="4" px="6" bg="white">
                            <Flex w="full" gap="3">
                                <Button variant="outline" flex="1">
                                    <Printer size={16} /> Print
                                </Button>
                                <Button colorPalette="blue" flex="1">
                                    <Download size={16} /> Download Receipt
                                </Button>
                            </Flex>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}
