"use client"

import { useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    Stack,
    Heading,
    Spinner,
    HStack,
    Icon,
    Image,
    Separator,
    ScrollArea,
    Span
} from "@chakra-ui/react";
import { useSearchParams } from "react-router";
import {
    usePaymentDetails,
    useInitializePayment
} from '@hooks/auth.hook';
import { PaymentType } from '@type/auth.type';
import useAuthStore from '@stores/auth.store';
import { toaster } from "@components/ui/toaster";
import { LuCircleCheck, LuCreditCard } from 'react-icons/lu';

const PortalAccessPage = () => {
    const [searchParams] = useSearchParams();
    const { setAuth } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            setAuth({ token, expireAt: "15m" });
        }
    }, [searchParams, setAuth]);

    const { data: duesResponse, isLoading: isFetchingDues } = usePaymentDetails(PaymentType.ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES);
    const duesData = duesResponse?.data;

    const { mutate: initializePayment, isPending: isInitializing } = useInitializePayment({
        onSuccess: (response) => {
            window.location.href = response.data.authorization_url;
        },
        onError: () => {
            toaster.create({
                title: "Payment Error",
                description: "Could not initialize payment. Please try again.",
                type: "error",
            });
        }
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handlePayNow = () => {
        const redirectUrl = `${window.location.origin}/auth/login`;
        initializePayment({
            type: PaymentType.ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES,
            redirectUrl: redirectUrl
        });
    };

    return (
        <ScrollArea.Root h={"vh"} size={"xs"}>
            <ScrollArea.Viewport>
                <ScrollArea.Content>
                    <Flex
                        minH="100vh"
                        w="full"
                        bg="bg.subtle"
                        justify="center"
                        align="center"
                        p={{ base: "4", md: "8" }}>

                        <Box
                            w="full"
                            maxW="2xl"
                            bg="bg"
                            rounded="md"
                            border="xs"
                            borderColor="border.muted"
                            overflow="hidden"
                            p={{ base: "6", md: "12" }}
                        >
                            <Stack gap="8">
                                <Stack gap="2" align="center" width="full">
                                    <Image src="/images/uphcscLG.png" h="auto" w="40" alt="UAMS Logo" />
                                    <Heading size="3xl" fontWeight="bold" color="fg">Portal Access Payment</Heading>
                                    <Text color="fg.subtle" textAlign="center">
                                        Payment for portal access is required for your new session and level before you can use the portal.
                                        Complete the payment below to activate your access.
                                    </Text>
                                </Stack>

                                <Box
                                    bg="bg.muted/20"
                                    border="xs"
                                    borderColor="border.muted"
                                    rounded="md"
                                    p="6"
                                >
                                    {isFetchingDues ? (
                                        <Flex align="center" justify="center" py="8">
                                            <Spinner size="sm" color="accent" />
                                            <Text ml="3" fontSize="sm" color="fg.subtle">Loading payment details</Text>
                                        </Flex>
                                    ) : duesData ? (
                                        <Stack gap="4">
                                            <Flex justify="space-between" align={"center"} fontSize="sm">
                                                <Text color="fg.subtle">Portal Access Fee</Text>
                                                <Text fontWeight="semibold">{formatCurrency(duesData.annualAccessFee || 0)}</Text>
                                            </Flex>
                                            <Flex justify="space-between" align={"center"} fontSize="sm">
                                                <Text color="fg.subtle">Department Dues</Text>
                                                <Text fontWeight="semibold">{formatCurrency(duesData.annualDepartmentalDues || 0)}</Text>
                                            </Flex>
                                            <Flex justify="space-between" align={"center"} fontSize="sm">
                                                <Text color="fg.subtle">Merchant & Transaction Fees</Text>
                                                <Text fontWeight="semibold">
                                                    {formatCurrency(duesData.merchantFee || 0)}
                                                </Text>
                                            </Flex>
                                            <Separator borderStyle="dashed" />
                                            <Flex justify="space-between" align="center">
                                                <Text fontWeight="bold">Total Amount</Text>
                                                <Text fontSize="xl" fontWeight="black" color="accent">
                                                    {formatCurrency(duesData.total || 0)}
                                                </Text>
                                            </Flex>
                                        </Stack>
                                    ) : (
                                        <Text fontSize="sm" color="fg.muted" textAlign="center">
                                            Unable to retrieve fee information.
                                        </Text>
                                    )}
                                </Box>

                                <Button
                                    onClick={handlePayNow}
                                    loading={isInitializing}
                                    disabled={isInitializing || isFetchingDues || !duesData}
                                    size="xl"
                                    w="full"
                                    colorPalette="green"
                                >
                                    <LuCreditCard />
                                    Pay Securely Now
                                </Button>

                                <HStack justify="center" gap="2" color="fg.subtle">
                                    <Icon as={LuCircleCheck} color="green.500" />
                                    <Text fontSize="xs">Secure Payment via Paystack</Text>
                                </HStack>

                                <Text fontSize="sm" color="fg.subtle" textAlign="center">
                                    Need help?{" "}
                                    <Span asChild color="accent" textDecor="underline">
                                        <a href="/contact">Contact Support</a>
                                    </Span>
                                </Text>
                            </Stack>
                        </Box>
                    </Flex>
                </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
        </ScrollArea.Root>
    );
};

export default PortalAccessPage;
