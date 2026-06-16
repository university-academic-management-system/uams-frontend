import {
  Button,
  DataList,
  Field,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "@components/ui/password-input";
import { type Options, passwordStrength } from "check-password-strength";
import { useCallback, useMemo, useState } from "react";
import { Editable, IconButton } from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { useChangePassword, useMe, useUpdateContact } from "@hooks/auth.hook";
import { useChangePasswordForm } from "@forms/auth.form";
import type { ChangePasswordFormData } from "@schemas/auth.schema";
import { toaster } from "@components/ui/toaster";
import moment from "moment";

const strengthOptions: Options<string> = [
  { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
  { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
  { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
  { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
];

const ProfilePage = () => {
  const { data: me, isLoading } = useMe();

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
        <Skeleton h="400px" />
        <Skeleton h="400px" />
        <Skeleton h="400px" />
      </SimpleGrid>
    );
  }

  const sp = me?.staffProfile;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
      {/* Bio data */}
      <Stack bg="bg" border="xs" borderColor="border.muted" rounded="md" p="4">
        <Heading>Bio data</Heading>
        <DataList.Root size="md">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
            <DataList.Item>
              <DataList.ItemLabel>Title</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">{sp?.title || "—"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Surname</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">{sp?.surname || "—"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>First name</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">{sp?.firstName || "—"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Other name</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">{sp?.otherName || "—"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Email</DataList.ItemLabel>
              <EmailEditable email={me?.email || ""} />
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Phone number</DataList.ItemLabel>
              <PhoneNumberEditable phone={sp?.phone || ""} />
            </DataList.Item>
          </SimpleGrid>
        </DataList.Root>
      </Stack>

      {/* Staff data – replaces "Academic data" for students */}
      <Stack bg="bg" border="xs" borderColor="border.muted" rounded="md" p="4">
        <Heading>Staff data</Heading>
        <DataList.Root size="md">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
            <DataList.Item>
              <DataList.ItemLabel>Staff number</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">{sp?.staffNumber || "—"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Department</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">{sp?.department || "—"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Faculty</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">{sp?.faculty || "—"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Gender</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">{sp?.gender || "—"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Roles</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">
                {sp?.staffRoles?.join(", ") || "—"}
              </DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel>Member since</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold">
                {sp?.createdAt ? moment(sp.createdAt).format("MMMM YYYY") : "—"}
              </DataList.ItemValue>
            </DataList.Item>
          </SimpleGrid>
        </DataList.Root>
      </Stack>

      {/* Security settings */}
      <PasswordUpdate />
    </SimpleGrid>
  );
};


const PasswordUpdate = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useChangePasswordForm();
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const currentPassword = watch("currentPassword");

  const strength = useMemo(() => {
    if (!newPassword) return 0;
    const result = passwordStrength(newPassword, strengthOptions);
    return result.id;
  }, [newPassword]);

  const isDisabled =
    !newPassword ||
    !confirmPassword ||
    strength < 2 ||
    !currentPassword ||
    newPassword !== confirmPassword;

  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword({
    onSuccess: () => {
      toaster.success({ description: "Password changed successfully" });
      reset();
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <Stack bg="bg" border="xs" borderColor="border.muted" rounded="md" p="4">
      <Heading>Security settings</Heading>
      <Stack asChild gap="4" colorPalette="accent">
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
          <Button type="submit" size="xl" loading={isChangingPassword} disabled={isDisabled}>
            Change Password
          </Button>
        </form>
      </Stack>
    </Stack>
  );
};

const EmailEditable = ({ email }: { email: string }) => {
  const [emailAddress, setEmailAddress] = useState(email);
  const { mutate: updateContact } = useUpdateContact({
    onSuccess: () => {
      toaster.success({ description: "Email updated successfully" });
    },
  });

  const handleSubmit = useCallback(() => {
    if (emailAddress === email) return;
    updateContact({ email: emailAddress });
  }, [emailAddress, updateContact, email]);

  return (
    <Editable.Root
      submitMode="none"
      colorPalette="accent"
      value={emailAddress}
      onValueCommit={handleSubmit}
      onValueChange={(e) => setEmailAddress(e.value)}
    >
      <Editable.Preview fontWeight="semibold" />
      <Editable.Input fontWeight="semibold" />
      <Editable.Control>
        <Editable.EditTrigger asChild>
          <IconButton variant="ghost" size="xs">
            <LuPencilLine />
          </IconButton>
        </Editable.EditTrigger>
        <Editable.CancelTrigger asChild>
          <IconButton colorPalette="gray" variant="outline" size="xs">
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
  );
};

const PhoneNumberEditable = ({ phone }: { phone: string }) => {
  const [phoneNumber, setPhoneNumber] = useState(phone);
  const { mutate: updateContact } = useUpdateContact({
    onSuccess: () => {
      toaster.success({ description: "Phone number updated successfully" });
    },
  });

  const handleSubmit = useCallback(() => {
    if (phoneNumber === phone) return;
    updateContact({ phone: phoneNumber });
  }, [phoneNumber, updateContact, phone]);

  return (
    <Editable.Root
      colorPalette="accent"
      onValueCommit={handleSubmit}
      submitMode="enter"
      value={phoneNumber}
      onValueChange={(e) => setPhoneNumber(e.value)}
    >
      <Editable.Preview fontWeight="semibold" />
      <Editable.Input fontWeight="semibold" />
      <Editable.Control>
        <Editable.EditTrigger asChild>
          <IconButton variant="ghost" size="xs">
            <LuPencilLine />
          </IconButton>
        </Editable.EditTrigger>
        <Editable.CancelTrigger asChild>
          <IconButton colorPalette="gray" variant="outline" size="xs">
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>
        <Editable.SubmitTrigger asChild>
          <IconButton colorPalette="accent" size="xs">
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
      </Editable.Control>
    </Editable.Root>
  );
};

export default ProfilePage;