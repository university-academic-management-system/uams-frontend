import { DataList, Heading, Icon, Image, Separator, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { formatCurrency, toTitleCase } from "@utils/function.util";
import { snapdom } from "@zumer/snapdom";
import moment from "moment";
import { memo, useEffect } from "react";
import { LuCircleCheck } from "react-icons/lu";
import type { Payment } from "@type/payment.type";

interface ReceiptProps {
    data: Payment | null;
    isDownloading?: boolean;
    isPrinting?: boolean;
    onDownloadComplete?: () => void;
    onPrintComplete?: () => void;
}

const Receipt = memo(({ data, isDownloading, isPrinting, onDownloadComplete, onPrintComplete }: ReceiptProps) => {
    useEffect(() => {
        if (!data || !data.reference) {
            return;
        }
        if (!isDownloading && !isPrinting) {
            return;
        }

        // download or print receipt
        const processReceipt = async () => {
            try {
                const result = await snapdom(document.getElementById("receipt-template") as HTMLDivElement);
                
                if (isDownloading) {
                    await result.toJpg({ scale: 4, quality: 1, cache: "disabled" });
                    await result.download({ filename: `${data.reference}-${data.createdAt.replace(/:/g, "-")}.jpg`, type: "jpg", scale: 4 });
                } else if (isPrinting) {
                    const img = await result.toPng({ scale: 4 });
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                        printWindow.document.write(`
                            <html>
                                <head><title>Print Receipt</title></head>
                                <body style="margin:0;display:flex;justify-content:center;">
                                    <img src="${img.src}" style="max-width:100%;height:auto;" onload="window.print();window.close();"/>
                                </body>
                            </html>
                        `);
                        printWindow.document.close();
                    }
                }
            } catch (error) {
                toaster.error({ description: `Error ${isDownloading ? 'downloading' : 'printing'} receipt` })
                console.error("Error processing receipt", error);
            } finally {
                if (isDownloading && onDownloadComplete) onDownloadComplete();
                if (isPrinting && onPrintComplete) onPrintComplete();
            }
        };

        processReceipt();
    }, [data, isDownloading, isPrinting, onDownloadComplete, onPrintComplete]);

    if (!data) return null;

    return (
        <Stack pos="fixed" top="200vh" id="receipt-template" gap="4" align="center" bg="bg" p="6" w="lg" border="xs" borderColor="border.muted" rounded="md">
            <Image src="/admin/assets/uphcscLG.png" alt="UPHCSC Logo" h="auto" w="44" />
            <Icon as={LuCircleCheck} color="green.solid" bg="green.50" mt="6" p="4" boxSize={20} borderRadius="full" />
            <Heading w="full" textAlign="center">Payment&nbsp;Receipt</Heading>

            <DataList.Root size="sm" w="full" gap="6">
                <SimpleGrid columns={2} gap="2">
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Receipt Number</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{data?.reference}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item alignItems="end" w="full">
                        <DataList.ItemLabel color="fg.subtle" w="full" justifyContent={"end"} textAlign="right">Date Issued</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} w="full" justifyContent={"end"} textAlign="right">{moment(data?.createdAt).format("LL, HH:mm:ss")}</DataList.ItemValue>
                    </DataList.Item>
                </SimpleGrid>
                <Separator borderStyle={"dashed"} />
                <Heading size="sm">Payer Details</Heading>
                <SimpleGrid columns={2} gap="2">
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Name</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{data.student ? [data.student.surname, data.student.firstName, data.student.otherName].filter(Boolean).join(" ") : "—"}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item alignItems="end">
                        <DataList.ItemLabel color="fg.subtle" w="full" justifyContent={"end"} textAlign="right">Registration Number</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} w="full" justifyContent={"end"} textAlign="right">{data.student?.registrationNo || "—"}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Matriculation Number</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{data.student?.matricNumber || "—"}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item alignItems="end" w="full">
                        <DataList.ItemLabel color="fg.subtle" w="full" justifyContent={"end"} textAlign="right">Payment Channel</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} w="full" justifyContent={"end"} textAlign="right">{toTitleCase(data?.paymentChannel || "Card")}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Academic Session</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{data.session || "—"}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item alignItems="end" w="full">
                        <DataList.ItemLabel color="fg.subtle" w="full" justifyContent={"end"} textAlign="right">Level</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} w="full" justifyContent={"end"} textAlign="right">{data.level?.replace(/^L/, '') || "—"}</DataList.ItemValue>
                    </DataList.Item>
                </SimpleGrid>

                <Separator borderStyle={"dashed"} />

                <Heading size="sm">Payment Details</Heading>

                <SimpleGrid columns={2} gap="2">
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Description</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{toTitleCase(data?.type || "Payment").replace(/_/g, " ")}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item alignItems="end">
                        <DataList.ItemLabel color="fg.subtle">Amount</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{formatCurrency(Number(data?.amount || 0))}</DataList.ItemValue>
                    </DataList.Item>
                    {data?.metadata?.transcriptRequestReference && (
                        <DataList.Item>
                            <DataList.ItemLabel color="fg.subtle">Reference</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{data.metadata.transcriptRequestReference}</DataList.ItemValue>
                        </DataList.Item>
                    )}
                </SimpleGrid>
            </DataList.Root>

            <DataList.Root size="md" w="full">
                <DataList.Item alignItems="end">
                    <DataList.ItemLabel color="fg.subtle">Total Amount Paid</DataList.ItemLabel>
                    <DataList.ItemValue fontWeight={"semibold"}>{formatCurrency(Number(data?.amount || 0))}</DataList.ItemValue>
                </DataList.Item>
            </DataList.Root>

            <Separator borderStyle={"dashed"} w="full" />

            <Text color="fg.subtle" textAlign="center" fontSize="xs">
                © {moment().year()} University of Port Harcourt, Department of Computer Science. <br />
                All Rights Reserved. <br />
                Choba, Port Harcourt, Rivers State, Nigeria.
            </Text>
        </Stack>
    )
});
export default Receipt;
