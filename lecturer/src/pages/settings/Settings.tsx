import { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    Field,
    Stack,
    Input,
    Spinner,
    Heading,
    Grid,
    GridItem,
    Separator,
} from "@chakra-ui/react";
import { Save, User, MapPin } from "lucide-react";
import useAuthStore from "@stores/auth.store";
import { UserServices } from "@services/user.service";
import { AuthServices } from "@services/auth.service";
import { toaster } from "@components/ui/toaster";

const SettingsPage = () => {
    const { user, setAuth } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);

    // Editable fields (only email and phone are allowed by backend)
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Read‑only fields – displayed in disabled inputs
    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [staffNumber, setStaffNumber] = useState("");
    const [department, setDepartment] = useState("");

    useEffect(() => {
        if (user) {
            const sp = user.staffProfile || {};
            setTitle(sp.title || "");
            setFirstName(sp.firstName || "");
            setSurname(sp.surname || "");
            setStaffNumber(sp.staffNumber || "");
            setDepartment(sp.department || "");
            setEmail(user.email || "");
            setPhone(sp.phone || "");
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user?.id) {
            toaster.error({ title: "User session not found" });
            return;
        }
        if (!email) {
            toaster.error({ title: "Email is required" });
            return;
        }

        try {
            setIsSaving(true);
            const payload = { email, phone: phone || undefined };
            await UserServices.updateProfile(user.id, payload);

            const res = await AuthServices.getProfile();
            if (res.status === "success" && res.data) {
                const sp = res.data.staffProfile;
                const staffRoles = sp?.staffRoles ?? [];
                const fullName = [sp?.firstName, sp?.otherName, sp?.surname]
                    .filter(Boolean)
                    .join(" ");
                setAuth({
                    user: {
                        ...user,
                        ...res.data,
                        name: fullName || user?.name,
                        roles: staffRoles,
                        role: staffRoles[0],
                    },
                });
            }

            toaster.success({ title: "Profile updated successfully!" });
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <Flex h="400px" alignItems="center" justifyContent="center">
                <Spinner size="xl" color="accent" />
            </Flex>
        );
    }

    return (
        <Box maxW="6xl" mx="auto">
            <Box mb="6">
                <Heading size="xl" fontWeight="bold" color="fg.muted" mb="1">
                    Settings
                </Heading>
            </Box>

            <Flex colorPalette="accent">
                <Box bg="white" rounded="md" border="1px solid" borderColor="border.muted" p="8" w="full">
                    <Stack gap="8">
                        {/* Personal Details Section - all inputs disabled */}
                        <Box>
                            <Flex alignItems="center" gap="2.5" mb="5">
                                <User size={20} />
                                <Text fontSize="lg" fontWeight="bold" color="fg.muted">
                                    Personal Details
                                </Text>
                            </Flex>

                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="5">
                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>Title</Field.Label>
                                        <Input
                                            value={title}
                                            disabled
                                            size="lg"
                                        />
                                    </Field.Root>
                                </GridItem>

                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>First Name</Field.Label>
                                        <Input
                                            value={firstName}
                                            disabled
                                            size="lg"
                                        />
                                    </Field.Root>
                                </GridItem>

                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>Surname</Field.Label>
                                        <Input
                                            value={surname}
                                            disabled
                                            size="lg"
                                        />
                                    </Field.Root>
                                </GridItem>

                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>Staff ID</Field.Label>
                                        <Input
                                            value={staffNumber}
                                            disabled
                                            size="lg"
                                        />
                                    </Field.Root>
                                </GridItem>

                                <GridItem colSpan={{ base: 1, md: 2 }}>
                                    <Field.Root>
                                        <Field.Label>Department</Field.Label>
                                        <Input
                                            value={department}
                                            disabled
                                            size="lg"
                                        />
                                    </Field.Root>
                                </GridItem>
                            </Grid>
                        </Box>

                        <Separator />

                        {/* Contact Information - editable inputs */}
                        <Box>
                            <Flex alignItems="center" gap="2.5" mb="5">
                                <MapPin size={20} />
                                <Text fontSize="lg" fontWeight="bold" color="fg.muted">
                                    Contact Information
                                </Text>
                            </Flex>

                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="5">
                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>Email Address *</Field.Label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isSaving}
                                            size="lg"
                                        />
                                    </Field.Root>
                                </GridItem>

                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>Phone Number</Field.Label>
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            disabled={isSaving}
                                            size="lg"
                                        />
                                    </Field.Root>
                                </GridItem>
                            </Grid>
                        </Box>
                    </Stack>

                    <Flex mt="8" justifyContent="flex-end">
                        <Button
                            onClick={handleSaveProfile}
                            loading={isSaving}
                            loadingText="Saving..."
                            size="lg"
                            px="6"
                            gap="2"
                        >
                            <Save size={16} /> Save Settings
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default SettingsPage;