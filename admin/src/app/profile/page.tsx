import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Flex, Text, Button, Field, Stack, Spinner, DataList, Editable, IconButton } from "@chakra-ui/react";
import type { AxiosError } from "axios";
import { PasswordInput, PasswordStrengthMeter } from "@components/ui/password-input";
import { Lock, CheckCircle } from "lucide-react";
import { LuPencilLine, LuX, LuCheck } from "react-icons/lu";
import useAuthStore from "@stores/auth.store";
import { AuthServices } from "@services/auth.service";
import { type Options, passwordStrength } from "check-password-strength";
import { toaster } from "@components/ui/toaster";
import { useChangePasswordForm } from "@forms/auth/changePassword.form";
import { AuthHooks } from "@hooks/auth.hook";
import type { ChangePasswordInput } from "@schemas/auth/changePassword.schema";

const strengthOptions: Options<string> = [
  { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
  { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
  { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
  { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
];

const ProfilePage = () => {
    const { user, setAuth } = useAuthStore();
    const [isLoadingProfile, setIsLoadingProfile] = useState(!user?.staffProfile);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await AuthServices.getProfile();
                if (res.status === "success" && res.data) {
                    setAuth({ user: res.data });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [setAuth]);

    // Password change setup
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setError
    } = useChangePasswordForm();

    const roleDisplay = (user?.role || "User").replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

    const { mutate: changePassword, isPending: isChangingPassword } = AuthHooks.useChangePassword({
        onSuccess: () => {
            toaster.success({ title: "Password changed successfully!" });
            reset();
        },
        onError: (err: Error) => {
            const error = err as AxiosError<{ status?: string; message?: string; error?: { code?: string; message?: string; details?: Array<{ path: string; message: string }> } }>;
            const errData = error.response?.data;
            if (errData?.status === "fail") {
                if (errData.error?.code === "INTERNAL_ERROR" || errData.message === "Invalid current password") {
                    setError("currentPassword", { type: "server", message: errData.error?.message || errData.message });
                } else if (errData.error?.code === "VALIDATION_ERROR" && errData.error.details) {
                    errData.error.details.forEach((detail) => {
                        const fieldName = detail.path.replace("body.", "");
                        if (fieldName === "newPassword" || fieldName === "currentPassword" || fieldName === "confirmPassword") {
                            setError(fieldName as "currentPassword" | "newPassword" | "confirmPassword", { type: "server", message: detail.message });
                        }
                    });
                } else {
                    toaster.error({ title: errData.message || "An error occurred" });
                }
            } else {
                toaster.error({ title: "Failed to change password" });
            }
        }
    });

    const newPassword = watch("newPassword");
    const confirmPassword = watch("confirmPassword");

    const onSubmit = (data: ChangePasswordInput) => {
        changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        });
    };

    const strength = useMemo(() => {
        if (!newPassword) return 0;
        const result = passwordStrength(newPassword, strengthOptions);
        return result.id;
    }, [newPassword]);



    if (isLoadingProfile) {
        return (
            <Flex h="400px" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="#1D7AD9" />
            </Flex>
        );
    }

    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold" color="fg.muted" mb="6">Profile</Text>

            <Flex direction={{ base: "column", xl: "row" }} gap="6" alignItems="flex-start">
                {/* Account Details Card */}
                <Box flex="5" bg="white" borderRadius="md" border="xs" borderColor="border.muted" p="8">
                            <Flex alignItems="center" gap="2" mb="6">
                                <Text fontSize="lg" fontWeight="bold" color="fg.muted">Account Details</Text>
                            </Flex>

                            <DataList.Root size="lg" display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="5">
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Title</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.staffProfile?.title || ""} userId={user?.id || ""} fieldKey="title" label="Title" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">First Name</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.staffProfile?.firstName || ""} userId={user?.id || ""} fieldKey="firstName" label="First Name" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Surname</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.staffProfile?.surname || ""} userId={user?.id || ""} fieldKey="surname" label="Surname" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Other Names</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.staffProfile?.otherName || ""} userId={user?.id || ""} fieldKey="otherName" label="Other Names" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Staff ID</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.staffProfile?.staffNumber || ""} userId={user?.id || ""} fieldKey="staffNumber" label="Staff ID" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Email Address</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.email || ""} userId={user?.id || ""} fieldKey="email" label="Email Address" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Phone Number</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.staffProfile?.phone || ""} userId={user?.id || ""} fieldKey="phone" label="Phone Number" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Gender</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.staffProfile?.gender || ""} userId={user?.id || ""} fieldKey="gender" label="Gender" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Department</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.staffProfile?.department || ""} userId={user?.id || ""} fieldKey="department" label="Department" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Faculty</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium"><ProfileEditable value={user?.staffProfile?.faculty || ""} userId={user?.id || ""} fieldKey="faculty" label="Faculty" /></DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Role</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user?.staffProfile?.staffRoles?.[0] || roleDisplay).replace(/_/g, " ")}</DataList.ItemValue>
                                </DataList.Item>
                            </DataList.Root>
                        </Box>

                {/* Password Change Card */}
                <Box flex="4" bg="white" borderRadius="md" border="xs" borderColor="border.muted" p="8">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex alignItems="center" gap="2" mb="2">
                            <Text fontSize="lg" fontWeight="bold" color="fg.muted">Change Password</Text>
                        </Flex>
                        <Text fontSize="sm" color="fg.subtle" mb="6">Update your password to keep your account secure.</Text>

                        <Stack gap="5" colorPalette={"accent"}>
                            {/* Current Password */}
                            <Field.Root invalid={!!errors.currentPassword}>
                                <Field.Label>Current Password</Field.Label>
                                <PasswordInput
                                    placeholder="Enter current password"
                                    {...register("currentPassword")}
                                    disabled={isChangingPassword}
                                    size="xl"
                                />
                                <Field.ErrorText>{errors.currentPassword?.message}</Field.ErrorText>
                            </Field.Root>

                            {/* New Password */}
                            <Field.Root invalid={!!errors.newPassword}>
                                <Field.Label>New Password</Field.Label>
                                <PasswordInput
                                    placeholder="Enter new password"
                                    {...register("newPassword")}
                                    disabled={isChangingPassword}
                                    size="xl"
                                />
                                {newPassword && !errors.newPassword && (
                                    <PasswordStrengthMeter value={strength} mt="2" width="full" />
                                )}
                                <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
                            </Field.Root>

                            {/* Confirm Password */}
                            <Field.Root invalid={!!errors.confirmPassword}>
                                <Field.Label>Confirm New Password</Field.Label>
                                <PasswordInput
                                    placeholder="Re-enter new password"
                                    {...register("confirmPassword")}
                                    disabled={isChangingPassword}
                                    size="xl"
                                />
                                {confirmPassword && newPassword && (
                                    <Flex alignItems="center" gap="1" mt="1">
                                        {confirmPassword === newPassword ? (
                                            <>
                                                <CheckCircle size={12} color="#22c55e" />
                                                <Text fontSize="xs" color="#22c55e" fontWeight="bold">Passwords match</Text>
                                            </>
                                        ) : (
                                            <Text fontSize="xs" color="#ef4444" fontWeight="bold">Passwords do not match</Text>
                                        )}
                                    </Flex>
                                )}
                                <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
                            </Field.Root>
                        </Stack>

                        <Flex mt="6" justifyContent="flex-end">
                            <Button
                                type="submit"
                                loading={isChangingPassword}
                                loadingText="Changing..."
                                disabled={isChangingPassword}
                                size="lg"
                                colorPalette="accent" 
                            >
                                <Lock size={16} /> Update Password
                            </Button>
                        </Flex>
                    </form>
                </Box>
            </Flex>
        </Box>
    );
};

// ── Reusable sub-components ─────────────────────────────────────────

const ProfileEditable = ({ value, userId, fieldKey, label }: { value: string; userId: string; fieldKey: string; label: string }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const { mutate: updateContact } = AuthHooks.useUpdateContact({
    onSuccess: () => {
      toaster.success({ description: `${label} updated successfully` });
    },
  });

  const handleSubmit = useCallback(() => {
    if (currentValue === value || !userId) return;
    updateContact({ id: userId, [fieldKey]: currentValue });
  }, [currentValue, updateContact, value, userId, fieldKey]);

  return (
    <Editable.Root
      submitMode="enter"
      colorPalette="accent"
      value={currentValue || "—"}
      onValueCommit={handleSubmit}
      onValueChange={(e) => setCurrentValue(e.value === "—" ? "" : e.value)}
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
