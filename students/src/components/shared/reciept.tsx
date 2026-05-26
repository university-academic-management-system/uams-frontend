import { DataList, Heading, Icon, Image, Separator, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { useReceiptStore } from "@stores/data.store";
import { formatCurrency, toTitleCase } from "@utils/function.util";
import { snapdom } from "@zumer/snapdom";
import moment from "moment";
import { memo, useEffect } from "react";
import { LuCircleCheck } from "react-icons/lu";

const Receipt = memo(() => {
    const { data } = useReceiptStore((state) => state);

    useEffect(() => {
        if (!data || !data.reference) {
            return;
        }

        // download receipt
        try {
            (async () => {
                const blob = await snapdom(document.getElementById("receipt-template") as HTMLDivElement);
                await blob.toJpg({ scale: 4, quality: 1, cache: "disabled" });
                await blob.download({ filename: `${data.reference}-${data.createdAt.replace(/:/g, "-")}.jpg`, type: "jpg", scale: 4 });
            })();
        } catch (error) {
            toaster.error({ description: "Error downloading receipt" })
            console.error("Error downloading receipt", error);
        }
    }, [data])

    return (
        <Stack pos="fixed" top="200vh" id="receipt-template" gap="4" align="center" bg="bg" p="6" w="lg" border="xs" borderColor="border.muted" rounded="md">
            <Image src="/students/uphcsc-logo.png" alt="UPHCSC Logo" h="auto" w="44" />
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
                        <DataList.ItemValue fontWeight={"semibold"}>{[data?.surname, data?.firstName, data?.otherName].join(" ")}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item alignItems="end">
                        <DataList.ItemLabel color="fg.subtle" w="full" justifyContent={"end"} textAlign="right">Registration Number</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} w="full" justifyContent={"end"} textAlign="right">{data?.registrationNo}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Matriculation Number</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{data?.matricNumber}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item alignItems="end" w="full">
                        <DataList.ItemLabel color="fg.subtle" w="full" justifyContent={"end"} textAlign="right">Payment Channel</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"} w="full" justifyContent={"end"} textAlign="right">{toTitleCase(data?.paymentChannel || "Card")}</DataList.ItemValue>
                    </DataList.Item>
                </SimpleGrid>

                <Separator borderStyle={"dashed"} />

                <Heading size="sm">Payment Details</Heading>

                <SimpleGrid columns={2} gap="2">
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Description</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{toTitleCase(data?.type || "Payment")}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item alignItems="end">
                        <DataList.ItemLabel color="fg.subtle">Amount</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{formatCurrency(Number(data?.amount || 0))}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel color="fg.subtle">Reference</DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={"semibold"}>{data?.metadata?.transcriptRequestReference}</DataList.ItemValue>
                    </DataList.Item>
                </SimpleGrid>
            </DataList.Root>

            <DataList.Root size="md" w="full">
                <DataList.Item alignItems="end">
                    <DataList.ItemLabel color="fg.subtle">Total Amount Paid</DataList.ItemLabel>
                    <DataList.ItemValue fontWeight={"semibold"}>{formatCurrency(Number(data?.amount || 0))}</DataList.ItemValue>
                </DataList.Item>
            </DataList.Root>

            <Separator borderStyle={"dashed"} w="full" />

            <Text color="fg.subtle" textAlign={"center"} fontSize="xs">© {moment().year()} University of Port Harcourt, Department of Computer Science. All rights reserved. Choba, Port Harcourt, Rivers State, Nigeria.</Text>
        </Stack>
    )
});
export default Receipt;