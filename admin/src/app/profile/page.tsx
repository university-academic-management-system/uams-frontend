import { useState, useEffect, useMemo } from "react";
import { Box, Flex, Text, Button, Field, Stack, Spinner, DataList } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "@components/ui/password-input";
import { Lock, CheckCircle } from "lucide-react";
import useAuthStore from "@stores/auth.store";
import { UserServices } from "@services/user.service";
import { AuthServices } from "@services/auth.service";
import { type Options, passwordStrength } from "check-password-strength";
import { toaster } from "@components/ui/toaster";

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

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const roleDisplay = (user?.role || "User").replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toaster.error({ title: "Please fill in all password fields" });
            return;
        }
        if (newPassword.length < 6) {
            toaster.error({ title: "New password must be at least 6 characters" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toaster.error({ title: "Passwords do not match" });
            return;
        }

        try {
            setIsChangingPassword(true);
            await UserServices.changePassword({ currentPassword, newPassword });
            toaster.success({ title: "Password changed successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            // Error toast handled by axios interceptor
        } finally {
            setIsChangingPassword(false);
        }
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
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user as any)?.staffProfile?.title || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">First Name</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user as any)?.staffProfile?.firstName || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Surname</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user as any)?.staffProfile?.surname || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Other Names</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user as any)?.staffProfile?.otherName || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Staff ID</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user as any)?.staffProfile?.staffNumber || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Email Address</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{user?.email || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Phone Number</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user as any)?.staffProfile?.phone || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Gender</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user as any)?.staffProfile?.gender || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Department</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user as any)?.staffProfile?.department || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Faculty</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{(user as any)?.staffProfile?.faculty || "—"}</DataList.ItemValue>
                                </DataList.Item>
                                <DataList.Item>
                                    <DataList.ItemLabel color="fg.subtle" textTransform="uppercase" fontSize="xs" fontWeight="bold" letterSpacing="wider">Role</DataList.ItemLabel>
                                    <DataList.ItemValue color="fg.muted" fontSize="sm" fontWeight="medium">{((user as any)?.staffProfile?.staffRoles?.[0] || roleDisplay).replace(/_/g, " ")}</DataList.ItemValue>
                                </DataList.Item>
                            </DataList.Root>
                        </Box>

                {/* Password Change Card */}
                <Box flex="4" bg="white" borderRadius="md" border="xs" borderColor="border.muted" p="8">
                            <Flex alignItems="center" gap="2" mb="2">
                                <Text fontSize="lg" fontWeight="bold" color="fg.muted">Change Password</Text>
                            </Flex>
                            <Text fontSize="sm" color="fg.subtle" mb="6">Update your password to keep your account secure.</Text>

                            <Stack gap="5" colorPalette={"accent"}>
                                {/* Current Password */}
                                <Field.Root>
                                    <Field.Label>Current Password</Field.Label>
                                    <PasswordInput
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        size="xl"
                                    />
                                </Field.Root>

                                {/* New Password */}
                                <Field.Root>
                                    <Field.Label>New Password</Field.Label>
                                    <PasswordInput
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        size="xl"
                                    />
                                    {newPassword && (
                                        <PasswordStrengthMeter value={strength} mt="2" width="full" />
                                    )}
                                </Field.Root>

                                {/* Confirm Password */}
                                <Field.Root>
                                    <Field.Label>Confirm New Password</Field.Label>
                                    <PasswordInput
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                </Field.Root>
                            </Stack>

                            <Flex mt="6" justifyContent="flex-end">
                                <Button
                                    onClick={handleChangePassword}
                                    loading={isChangingPassword}
                                    loadingText="Changing..."
                                    disabled={isChangingPassword}
                                    size="lg"
                                    colorPalette="accent" 
                                >
                                    <Lock size={16} /> Update Password
                                </Button>
                            </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

// ── Reusable sub-components ─────────────────────────────────────────

export default ProfilePage;
