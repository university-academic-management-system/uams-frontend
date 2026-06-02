import { useState, useEffect, useMemo } from "react";
import { Box, Flex, Text, Button, Field, Stack, Spinner, DataList, Skeleton, SkeletonText } from "@chakra-ui/react";
import { PasswordInput, PasswordStrengthMeter } from "@components/ui/password-input";
import { Lock, CheckCircle } from "lucide-react";
import useAuthStore from "@stores/auth.store";
import { UserServices } from "@services/user.service";
import { AuthServices } from "@services/auth.service";
import { toaster } from "@components/ui/toaster";

const calcPasswordStrength = (password: string): number => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const ProfilePage = () => {
    const { user, setAuth } = useAuthStore();
    const [isLoadingProfile, setIsLoadingProfile] = useState(!user?.staffProfile);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await AuthServices.getProfile();
                if (res.status === "success" && res.data) {
                    const sp = res.data.staffProfile;
                    const staffRoles = sp?.staffRoles ?? [];
                    const name = [sp?.firstName, sp?.otherName, sp?.surname]
                        .filter(Boolean)
                        .join(" ");
                    setAuth({
                        user: {
                            ...user,
                            ...res.data,
                            name: name || user?.name,
                            roles: staffRoles,
                            role: staffRoles[0],
                        },
                    });
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

    const strength = useMemo(() => calcPasswordStrength(newPassword), [newPassword]);

    if (isLoadingProfile) {
        return (
            <Box>
                <Text fontSize="2xl" fontWeight="bold" color="fg.muted" mb="6">Profile</Text>
                <Flex direction={{ base: "column", xl: "row" }} gap="6" alignItems="flex-start">
                    {/* Account Details Skeleton */}
                    <Box flex="5" bg="white" borderRadius="md" border="xs" borderColor="border.muted" p="8">
                        <Skeleton h="6" w="32" mb="6" />
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap="5">
                            {Array.from({ length: 11 }).map((_, i) => (
                                <Flex key={i} justify="space-between" align="center">
                                    <Skeleton h="4" w="24" />
                                    <Skeleton h="4" w="32" />
                                </Flex>
                            ))}
                        </SimpleGrid>
                    </Box>

                    {/* Password Change Skeleton */}
                    <Box flex="4" bg="white" borderRadius="md" border="xs" borderColor="border.muted" p="8">
                        <Skeleton h="6" w="48" mb="2" />
                        <Skeleton h="4" w="64" mb="6" />
                        <Stack gap="5">
                            <Skeleton h="10" w="full" />
                            <Skeleton h="10" w="full" />
                            <Skeleton h="10" w="full" />
                        </Stack>
                        <Flex mt="6" justifyContent="flex-end">
                            <Skeleton h="10" w="32" />
                        </Flex>
                    </Box>
                </Flex>
            </Box>
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

export default ProfilePage;