import { Button, DataList, Field, Heading, Icon, SimpleGrid, Skeleton, Stack } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "@components/ui/password-input";
import { type Options, passwordStrength } from "check-password-strength"
import { useCallback, useMemo, useState } from "react"
import { Editable, IconButton } from "@chakra-ui/react"
import { LuCheck, LuCircleCheck, LuPencilLine, LuUserRound, LuX } from "react-icons/lu"
import { useChangePassword, useMe, useUpdateContact } from "@hooks/auth.hook";
import { useChangePasswordForm } from "@forms/auth.form";
import type { ChangePasswordFormData } from "@schemas/auth.schema";
import { toaster } from "@components/ui/toaster";
import { useGetPayments } from "@hooks/payment.hook";
import EmptyStateView from "@components/shared/empty-state";
import { useInitializePayment } from "@hooks/registration.hook";
import type { PaymentType } from "@type/registration.type";
import { useIdCards } from "@hooks/id-card.hook";
import moment from "moment";



const strengthOptions: Options<string> = [
    { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
    { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
    { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
    { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
]


const Profile = () => {
    const { data: me, isLoading } = useMe();

    if (isLoading) {
        return (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                <Skeleton h="400px" />
                <Skeleton h="400px" />
                <Skeleton h="400px" />
                <Skeleton h="400px" />
            </SimpleGrid>
        )
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">

            {/* Bio data */}
            <Stack
                bg="bg"
                border="xs"
                borderColor="border.muted"
                rounded="md"
                p="4"
            >
                <Heading>Bio data</Heading>
                <DataList.Root size="md">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                        <DataList.Item>
                            <DataList.ItemLabel>Surname</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.surname}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>First name</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.firstName}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Other name</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.otherName}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Email</DataList.ItemLabel>
                            <EmailEditable email={me?.email || ""} />
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Phone number</DataList.ItemLabel>
                            <PhoneNumberEditable phone={me?.studentProfile?.phone || ""} />
                        </DataList.Item>
                    </SimpleGrid>
                </DataList.Root>
            </Stack>


            {/* Academic data */}
            <Stack
                bg="bg"
                border="xs"
                borderColor="border.muted"
                rounded="md"
                p="4"
            >
                <Heading>Academic data</Heading>
                <DataList.Root size="md">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                        <DataList.Item>
                            <DataList.ItemLabel>Faculty</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.faculty}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Department</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.department}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Registration number</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.registrationNo}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Matriculation number</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.matricNumber}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Level</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.level}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Admission Session</DataList.ItemLabel>
                            <DataList.ItemValue fontWeight={"semibold"}>{me?.studentProfile?.admissionSession}</DataList.ItemValue>
                        </DataList.Item>
                    </SimpleGrid>
                </DataList.Root>
            </Stack>



            {/* Security settings */}
            <PasswordUpdate />


            {/* ID card application form */}
            <Stack
                bg="bg"
                border="xs"
                borderColor="border.muted"
                rounded="md"
                p="4"
            >
                <Heading>ID card application</Heading>
                <IDCardApplication />
            </Stack>


        </SimpleGrid >
    );
};


const PasswordUpdate = () => {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useChangePasswordForm();
    const newPassword = watch("newPassword");
    const confirmPassword = watch("confirmPassword");
    const currentPassword = watch("currentPassword");

    const strength = useMemo(() => {
        if (!newPassword) return 0
        const result = passwordStrength(newPassword, strengthOptions)
        return result.id
    }, [newPassword])

    const isDisabled = !newPassword
        || !confirmPassword
        || strength < 3
        || !currentPassword
        || newPassword !== confirmPassword

    const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword({
        onSuccess: () => {
            toaster.success({ description: "Password changed successfully" });
            reset();
        }
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        });
    };


    return (
        <Stack
            bg="bg"
            border="xs"
            borderColor="border.muted"
            rounded="md"
            p="4"
        >

            <Heading>Security settings</Heading>
            <Stack asChild gap="4" colorPalette={"accent"}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Field.Root invalid={!!errors.currentPassword}>
                        <Field.Label>Current password</Field.Label>
                        <PasswordInput size="xl" {...register("currentPassword")} />
                        <Field.ErrorText>{errors.currentPassword?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.newPassword}>
                        <Field.Label>New password</Field.Label>
                        <PasswordInput size="xl" {...register("newPassword")} />
                        <PasswordStrengthMeter value={strength} />
                        <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.confirmPassword}>
                        <Field.Label>Confirm password</Field.Label>
                        <PasswordInput size="xl" {...register("confirmPassword")} />
                        <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
                    </Field.Root>
                    <Button type="submit" size="xl" loading={isChangingPassword} disabled={isDisabled}>Change Password</Button>
                </form>
            </Stack>
        </Stack>
    )
}


const EmailEditable = ({ email }: { email: string }) => {
    const [emailAddress, setEmailAddress] = useState(email);
    const { mutate: updateContact } = useUpdateContact({
        onSuccess: () => {
            toaster.success({ description: "Email updated successfully" });
        }
    });

    const handleSubmit = useCallback(() => {
        if (emailAddress === email) return;
        updateContact({ email: emailAddress });
    }, [emailAddress, updateContact, email]);

    return (
        <Editable.Root submitMode="none" colorPalette={"accent"} value={emailAddress} onValueCommit={handleSubmit} onValueChange={(e) => setEmailAddress(e.value)}>
            <Editable.Preview fontWeight={"semibold"} />
            <Editable.Input fontWeight={"semibold"} />
            <Editable.Control>
                <Editable.EditTrigger asChild>
                    <IconButton variant="ghost" size="xs">
                        <LuPencilLine />
                    </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                    <IconButton colorPalette={"gray"} variant="outline" size="xs">
                        <LuX />
                    </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                    <IconButton size="xs">
                        <LuCheck />
                    </IconButton>
                </Editable.SubmitTrigger>
            </Editable.Control>
        </Editable.Root>
    )
}

const PhoneNumberEditable = ({ phone }: { phone: string }) => {
    const [phoneNumber, setPhoneNumber] = useState(phone);
    const { mutate: updateContact } = useUpdateContact({
        onSuccess: () => {
            toaster.success({ description: "Phone number updated successfully" });
        }
    });

    const handleSubmit = useCallback(() => {
        if (phoneNumber === phone) return;
        updateContact({ phone: phoneNumber });
    }, [phoneNumber, updateContact, phone]);

    return (
        <Editable.Root colorPalette={"accent"} onValueCommit={handleSubmit} submitMode="enter" value={phoneNumber} onValueChange={(e) => setPhoneNumber(e.value)}>
            <Editable.Preview fontWeight={"semibold"} />
            <Editable.Input fontWeight={"semibold"} />
            <Editable.Control>
                <Editable.EditTrigger asChild>
                    <IconButton variant="ghost" size="xs">
                        <LuPencilLine />
                    </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                    <IconButton colorPalette={"gray"} variant="outline" size="xs">
                        <LuX />
                    </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                    <IconButton colorPalette={"accent"} size="xs">
                        <LuCheck />
                    </IconButton>
                </Editable.SubmitTrigger>
            </Editable.Control>
        </Editable.Root>
    )
}



const IDCardApplication = () => {
    const { data, isLoading } = useGetPayments();
    const { mutate: initializePayment, isPending } = useInitializePayment({
        onSuccess: (data) => {
            window.location.href = data.authorization_url;
        }
    });
    const { data: idCardApps, isLoading: isLoadingIdCard } = useIdCards();
    const hasPaid = useMemo(() => data?.data?.some((payment) => payment.status === "PAID" && payment.type === "ID_CARD_FEE"), [data]);
    const IDCard = useMemo(() => idCardApps && [...idCardApps].sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()).find((app) => app.status === "APPROVED"), [idCardApps]);

    const handleApply = useCallback(() => {
        initializePayment({ type: "ID_CARD_FEE" as PaymentType, redirectUrl: window.location.href });
    }, [initializePayment]);


    if (isLoading || isLoadingIdCard) return null;

    if (!hasPaid) return <EmptyStateView
        icon={<LuUserRound />}
        title="You have not paid the ID card fee"
        description="Please pay the ID card fee to continue"
        action={
            <Button loading={isPending} onClick={handleApply} size="xl" colorPalette="accent">Apply for ID card</Button>
        }
    />
    return (
        <Stack>
            {!IDCard && <EmptyStateView
                icon={<Icon color="green.solid" as={LuCircleCheck} />}
                title="You have already applied for ID card"
                description="Kindly visit your administrator to retrieve ID card"
            />}
        </Stack>
    )

}

export default Profile;
