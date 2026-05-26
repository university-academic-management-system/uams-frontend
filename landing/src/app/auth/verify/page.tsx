"use client"

import {
    Box,
    Flex,
    Text,
    Button,
    Stack,
    Heading,
    Input,
    Field,
    Steps, Image,
    Separator,
    Spinner,
    HStack,
    Span,
    Icon,
    SimpleGrid,
    ScrollArea,
    Fieldset
} from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router";
import {
    useVerifyStudent,
    useActivateAccount,
    usePaymentDetails,
    useInitializePayment
} from '@hooks/auth.hook';
import { useActivateAccountForm, useVerifyStudentForm } from '@forms/auth.form';
import { PaymentType, type VerifyStudentFormData } from '@type/auth.type';
import useAuthStore from '@stores/auth.store';
import { PasswordInput } from "@components/ui/password-input";
import { toaster } from "@components/ui/toaster";
import { LuCircleCheck, LuCreditCard } from 'react-icons/lu';

const VerifyPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const step = parseInt(searchParams.get("step") || "0");

    const setStep = (newStep: number) => {
        setSearchParams({ step: newStep.toString() });
    };

    // Steps Definition
    const stepsData = [
        { title: "Verification", description: "Verify your record" },
        { title: "Account Update", description: "Set up your login details" },
        { title: "Payment", description: "Complete annual access payment" }
    ];

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
                            maxW="5xl"
                            bg="bg"
                            rounded="md"
                            border="xs"
                            borderColor="border.muted"
                            overflow="hidden"
                        >
                            <Steps.Root
                                size={"xs"}
                                step={step}
                                count={stepsData.length}
                                variant="subtle"
                                colorPalette="blue"
                                orientation={{ base: "horizontal", lg: "vertical" }}
                                onStepChange={(e) => setStep(e.step)}
                            >
                                <Flex direction={{ base: "column", lg: "row" }} minH={{ base: "auto", lg: "xl" }} w="full">

                                    {/* Left Column: Step Navigation */}
                                    <Stack
                                        justify={"space-between"}
                                        w={{ base: "full", lg: "320px" }}
                                        p="8"
                                        bg="accent.subtle"
                                        h="full"
                                    >
                                        <Stack gap="8" h="full">
                                            <Image src="/images/uphcscLG.png" h="auto" w="40" alt="UAMS Logo" />

                                            <Steps.List gap="6">
                                                {stepsData.map((item, index) => (
                                                    <Steps.Item _currentStep={{ color: "accent" }} key={index} index={index}>
                                                        <Steps.Trigger>
                                                            <Steps.Indicator />
                                                            <Box>
                                                                <Steps.Title color="inherit" fontWeight="bold">{item.title}</Steps.Title>
                                                                <Steps.Description color="inherit" fontSize="xs">{item.description}</Steps.Description>
                                                            </Box>
                                                        </Steps.Trigger>
                                                        <Steps.Separator />
                                                    </Steps.Item>
                                                ))}
                                            </Steps.List>

                                            <Box mt="auto" pt="8">
                                                <Text fontSize="xs" color="fg.subtle">
                                                    Need help?{" "}
                                                    <Span asChild color="accent" textDecor="underline">
                                                        <Link to="/contact">Contact Support</Link>
                                                    </Span>
                                                </Text>
                                            </Box>
                                        </Stack>
                                    </Stack>

                                    {/* Right Column: Step Content */}
                                    <Flex flex="1" p={{ base: "6", md: "12" }} justify="center" align="center">
                                        <Steps.Content index={0} w={"lg"}>
                                            <VerificationStep onNext={() => setStep(1)} />
                                        </Steps.Content>

                                        <Steps.Content index={1} w={"lg"}>
                                            <AccountUpdateStep onNext={() => setStep(2)} onPrev={() => setStep(0)} />
                                        </Steps.Content>

                                        <Steps.Content index={2} w={"lg"}>
                                            <PaymentStep activeStep={step} onPrev={() => setStep(1)} />
                                        </Steps.Content>
                                    </Flex>

                                </Flex>
                            </Steps.Root>
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

/**
 * Step 1: Verification Logic
 */
const VerificationStep = ({ onNext }: { onNext: () => void }) => {
    const { setAuth } = useAuthStore();
    const { register, handleSubmit, watch, formState: { errors } } = useVerifyStudentForm();

    const { mutate: verifyStudent, isPending: isLoading } = useVerifyStudent({
        onSuccess: (response) => {
            setAuth({
                token: response.data.verificationToken,
                user: {
                    name: `${response.data.profile.firstName} ${response.data.profile.surname}`,
                    email: "",
                    role: "STUDENT",
                    profile: response.data.profile,
                },
                expireAt: "15m",
            });
            onNext();
        }
    });

    const onSubmit = (data: VerifyStudentFormData) => {
        verifyStudent(data.matricNumber);
    };

    return (
        <Stack gap="8" width="full">
            <Stack gap="2" align="center" width="full">
                <Heading size="3xl" fontWeight="bold" color="fg">
                    Verify Record
                </Heading>
                <Text color="fg.subtle">
                    Enter your matriculation number to begin.
                </Text>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="5" width="full">
                    <Field.Root invalid={!!errors.matricNumber}>
                        <Field.Label>Matriculation Number</Field.Label>
                        <Input
                            placeholder="e.g. U2026/5459888"
                            {...register("matricNumber")}
                            disabled={isLoading}
                            size="xl"
                        />
                        <Field.ErrorText>{errors.matricNumber?.message}</Field.ErrorText>
                    </Field.Root>

                    <Button
                        type="submit"
                        loading={isLoading}
                        disabled={isLoading || !watch("matricNumber")}
                        size="xl"
                        w="full"
                        colorPalette="accent"
                    >
                        Continue
                    </Button>

                    <Text fontSize="sm" color="fg.subtle" textAlign="center">
                        Already have an account? <Span asChild color="accent" fontWeight="semibold"><Link to="/auth/login">Login here</Link></Span>
                    </Text>
                </Stack>
            </form>
        </Stack>
    );
};

/**
 * Step 2: Account Update Logic
 */
const AccountUpdateStep = ({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) => {
    const { user, token, setAuth } = useAuthStore();
    const form = useActivateAccountForm({
        email: user?.email || "",
        phone: user?.profile?.phone || "",
        password: "",
        confirmPassword: "",
    });

    const { mutate: activateAccount, isPending: isLoading } = useActivateAccount({
        onSuccess: (response) => {
            setAuth({
                token: response.data.token,
                expireAt: response.data.expiresIn,
                user: response.data.user
            });

            toaster.create({
                title: "Account Updated",
                description: "Your login details have been saved successfully.",
                type: "success",
            });
            onNext();
        }
    });

    const onSubmit = form.handleSubmit((data) => {
        activateAccount({
            ...data,
            token: token || "",
        });
    });

    return (
        <Stack gap="8">
            <Box textAlign="center">
                <Heading size="2xl" fontWeight="bold" color="fg" mb="2">
                    Update Account
                </Heading>
                <Text color="fg.subtle">
                    Hello <Span fontWeight="bold" color="fg">{user?.name}</Span>, confirm your account details to complete your profile setup.
                </Text>
            </Box>

            <form onSubmit={onSubmit}>
                <Stack gap="6">
                    <Fieldset.Root disabled>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Reg No.</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.registrationNo || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Mat No.</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.matricNumber || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Surname</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.surname || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">First Name</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.firstName || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Other Names</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.otherName || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Gender</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.gender || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Admission Mode</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.admissionMode || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Entry Qualification</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.entryQualification || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Faculty</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.faculty || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Department</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.department || 'N/A'}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Degree Awarded</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.degreeAwarded || 'N/A'}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize="sm" fontWeight="medium">Programme</Field.Label>
                                <Input
                                    size="xl"
                                    readOnly
                                    value={user?.profile?.programme || 'N/A'}
                                />
                            </Field.Root>
                        </SimpleGrid>
                    </Fieldset.Root>

                    <Separator borderColor={"border.muted"} />

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                        <Field.Root invalid={!!form.formState.errors.email}>
                            <Field.Label>Email Address</Field.Label>
                            <Input
                                {...form.register("email")}
                                placeholder="name@example.com"
                                type="email"
                                size="xl"
                            />
                            <Field.ErrorText>{form.formState.errors.email?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!form.formState.errors.phone}>
                            <Field.Label>Phone Number</Field.Label>
                            <Input
                                {...form.register("phone")}
                                placeholder="+2348012345678"
                                size="xl"
                            />
                            <Field.ErrorText>{form.formState.errors.phone?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!form.formState.errors.password}>
                            <Field.Label>Create Password</Field.Label>
                            <PasswordInput
                                {...form.register("password")}
                                placeholder="••••••••"
                                size="xl"
                            />
                            <Field.ErrorText>{form.formState.errors.password?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!form.formState.errors.confirmPassword}>
                            <Field.Label>Confirm Password</Field.Label>
                            <PasswordInput
                                {...form.register("confirmPassword")}
                                placeholder="••••••••"
                                size="xl"
                            />
                            <Field.ErrorText>{form.formState.errors.confirmPassword?.message}</Field.ErrorText>
                        </Field.Root>
                    </SimpleGrid>

                    <HStack width="full" gap="4">
                        <Button
                            colorPalette={"gray"}
                            variant="outline"
                            size="xl"
                            onClick={onPrev}
                            disabled={isLoading}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            loading={isLoading}
                            size="xl"
                            flex="1"
                            colorPalette="accent"
                        >
                            Save & Continue
                        </Button>
                    </HStack>
                </Stack>
            </form>
        </Stack>
    );
};

/**
 * Step 3: Payment Logic
 */
const PaymentStep = ({ activeStep, onPrev }: { activeStep: number, onPrev: () => void }) => {
    const { data: duesResponse, isLoading: isFetchingDues } = usePaymentDetails(PaymentType.ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES, undefined, {
        enabled: activeStep === 2
    });
    const duesData = duesResponse?.data;

    const { mutate: initializePayment, isPending: isInitializing } = useInitializePayment({
        onSuccess: (response) => {
            window.location.href = response.data.authorization_url;
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
        <Stack gap="8">
            <Stack gap="2" align="center" width="full">
                <Heading size="3xl" fontWeight="bold" color="fg">Annual Payment</Heading>
                <Text color="fg.subtle">
                    One final step! Pay your annual dues to activate your portal access.
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

            <HStack width="full" gap="4">
                <Button
                    colorPalette={"gray"}
                    variant="outline"
                    size="xl"
                    onClick={onPrev}
                    disabled={isInitializing}
                >
                    Back
                </Button>
                <Button
                    onClick={handlePayNow}
                    loading={isInitializing}
                    disabled={isInitializing || isFetchingDues || !duesData}
                    size="xl"
                    flex="1"
                    colorPalette="green"
                >
                    <LuCreditCard />
                    Pay Securely Now
                </Button>
            </HStack>

            <HStack justify="center" gap="2" color="fg.subtle">
                <Icon as={LuCircleCheck} color="green.500" />
                <Text fontSize="xs">Secure Payment via Paystack</Text>
            </HStack>
        </Stack >
    );
};

export default VerifyPage;
