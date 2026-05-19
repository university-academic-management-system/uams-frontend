import { useState, useEffect, useRef } from "react";
import { Upload, Edit2, Trash2, CheckCircle } from "lucide-react";
import { IDCardServices } from "@services/idcard.service";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Image, Spinner, Table, Button, Badge, Dialog, Portal, CloseButton, EmptyState, Field, Input, Textarea, Stack } from "@chakra-ui/react";

const UploadBox = ({ label, type, preview, fileRef, onFileChange }: { label: string; type: string; preview: string; fileRef: React.RefObject<HTMLInputElement | null>; onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void }) => {
    return (
        <Box>
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">{label}</Text>
            <Flex
                border="2px dashed" borderColor="border.muted" borderRadius="md" p="4"
                alignItems="center" justifyContent="center" minH="120px" bg="slate.50"
                cursor="pointer" _hover={{ borderColor: "blue.300", bg: "blue.50" }}
                transition="all 0.2s" onClick={() => fileRef?.current?.click()} position="relative"
            >
                <input type="file" accept="image/*" ref={fileRef} onChange={(e) => onFileChange(e, type)} style={{ display: "none" }} />
                {preview ? (
                    <Image src={preview} alt={label} maxH="100px" maxW="200px" objectFit="contain" borderRadius="md" />
                ) : (
                    <Flex direction="column" alignItems="center" gap="2">
                        <Upload size={24} color="#94a3b8" />
                        <Text fontSize="xs" color="fg.subtle">Click to upload (max 70KB)</Text>
                    </Flex>
                )}
            </Flex>
        </Box>
    );
};

const IDCardSettingsTab = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [templateId, setTemplateId] = useState("");
    const [templates, setTemplates] = useState<any[]>([]);
    const [previews, setPreviews] = useState<Record<string, string>>({});
    const [files, setFiles] = useState<Record<string, File>>({});
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        schoolName: "",
        faculty: "",
        department: "",
        schoolAddress: "",
        backDescription: "",
        backDisclaimer: "",
    });

    const [initialFormData, setInitialFormData] = useState<typeof formData>({
        schoolName: "",
        faculty: "",
        department: "",
        schoolAddress: "",
        backDescription: "",
        backDisclaimer: "",
    });

    const fileInputRefs = {
        logo: useRef<HTMLInputElement>(null),
        signature: useRef<HTMLInputElement>(null),
        frontTemplate: useRef<HTMLInputElement>(null),
        backTemplate: useRef<HTMLInputElement>(null),
    };

    // Store existing image URLs for preview
    const [existingUrls, setExistingUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const data = await IDCardServices.getAllIDCard();
            if (data?.success && data.templates) {
                setTemplates(data.templates);
            }
        } catch (err) {
            console.error("Failed to fetch ID card templates", err);
            // Error toast handled by axios interceptor
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (t: any) => {
        setTemplateId(t.id || "");
        const fd = {
            schoolName: t.institutionName || "",
            faculty: t.faculties?.[0]?.name || "",
            department: t.departments?.[0]?.name || "",
            schoolAddress: t.institutionAddress || "",
            backDescription: t.backDescription || "",
            backDisclaimer: t.backDisclaimer || "",
        };
        setFormData(fd);
        setInitialFormData(fd);
        setExistingUrls({
            logo: t.logo || "",
            signature: t.hodSignature || t.signature || "",
            frontTemplate: t.frontTemplate || t.frontCardTemplate || "",
            backTemplate: t.backTemplate || t.backCardTemplate || "",
        });
        setPreviews({});
        setFiles({});
        setIsFormVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await IDCardServices.deleteIDCard(id, {});
            toaster.success({ title: "Template deleted safely" });
            if (templateId === id) handleCreateNew();
            await fetchSettings();
        } catch (err: any) {
            // Error toast handled by axios interceptor
        } finally {
            setTemplateToDelete(null);
        }
    };

    const handleActivate = async (id: string) => {
        try {
            await IDCardServices.activateIDCard(id, {});
            toaster.success({ title: "Template set as default" });
            await fetchSettings();
        } catch (err: any) {
            // Error toast handled by axios interceptor
        }
    };

    const handleCreateNew = () => {
        setTemplateId("");
        setFormData({
            schoolName: "",
            faculty: "",
            department: "",
            schoolAddress: "",
            backDescription: "",
            backDisclaimer: "",
        });
        setExistingUrls({});
        setPreviews({});
        setFiles({});
        setIsFormVisible(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 70 * 1024) {
            toaster.error({ title: "File too large. Max size is 70KB." });
            e.target.value = "";
            return;
        }
        setFiles((prev) => ({ ...prev, [type]: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const currentTemplate = templateId ? templates.find(t => t.id === templateId) : null;
            const payload: any = {
                name: currentTemplate?.name || `Template ${templates.length + 1}`,
                isDefault: currentTemplate?.isDefault ?? false,
                status: currentTemplate?.status || "ACTIVE",
            };

            // Only send changed text fields
            if (formData.schoolName !== initialFormData.schoolName) payload.institutionName = formData.schoolName;
            if (formData.schoolAddress !== initialFormData.schoolAddress) payload.institutionAddress = formData.schoolAddress;
            if (formData.department !== initialFormData.department) payload.department = formData.department;
            if (formData.faculty !== initialFormData.faculty) payload.faculty = formData.faculty;
            if (formData.backDescription !== initialFormData.backDescription) payload.backDescription = formData.backDescription;
            if (formData.backDisclaimer !== initialFormData.backDisclaimer) payload.backDisclaimer = formData.backDisclaimer;

            // Convert files to base64
            if (files.logo) payload.logo = await convertFileToBase64(files.logo);
            if (files.signature) payload.hodSignature = await convertFileToBase64(files.signature);
            if (files.frontTemplate) payload.frontTemplate = await convertFileToBase64(files.frontTemplate);
            if (files.backTemplate) payload.backTemplate = await convertFileToBase64(files.backTemplate);

            if (templateId) {
                await IDCardServices.updateIDCard(templateId, payload);
            } else {
                await IDCardServices.createIDCard(payload);
            }
            toaster.success({ title: "ID Card settings updated" });
            setFiles({});
            setPreviews({});
            setIsFormVisible(false);
            await fetchSettings();
        } catch (err: any) {
            // Error toast handled by axios interceptor
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Flex justifyContent="center" py="20"><Spinner size="lg" color="blue.500" /></Flex>;
    }





    return (
        <Flex direction="column" gap="8">
            {/* Templates Table Section */}
            <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" p={{ base: "4", md: "8" }}>
                <Flex justifyContent="space-between" alignItems={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} mb="6" gap="4">
                    <Text fontSize="lg" fontWeight="bold" color="fg.muted">Available Templates</Text>
                    <Button
                        colorPalette="accent"
                        size="sm"
                        onClick={handleCreateNew}
                    >
                        + Create New Template
                    </Button>
                </Flex>
                <Box overflowX="auto">
                    <Table.Root variant="line">
                        <Table.Header bg="slate.50">
                            <Table.Row borderY="xs" borderColor="border.muted">
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">School Name</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Faculty</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Department</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Status</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" textAlign="right">Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {templates.map((t) => (
                                <Table.Row key={t.id}>
                                    <Table.Cell>{t.institutionName || "-"}</Table.Cell>
                                    <Table.Cell>{t.faculties?.[0]?.name || "-"}</Table.Cell>
                                    <Table.Cell>{t.departments?.[0]?.name || "-"}</Table.Cell>
                                    <Table.Cell>
                                        {t.isDefault ? (
                                            <Badge color="white" bg="#10b645ff">Default</Badge>
                                        ) : (
                                            <Badge color="white" bg="#87898bff">Inactive</Badge>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <Flex gap="2" justifyContent="flex-end">
                                            {!t.isDefault && (
                                                <Button size="xs" colorPalette="green" variant="ghost" title="Set as Default" onClick={() => handleActivate(t.id)}>
                                                    <CheckCircle size={16} />
                                                </Button>
                                            )}
                                            <Button size="xs" colorPalette="accent" variant="ghost" title="Edit" onClick={() => handleEdit(t)}>
                                                <Edit2 size={16} />
                                            </Button>

                                            <Dialog.Root 
                                                open={templateToDelete === t.id} 
                                                onOpenChange={(e) => setTemplateToDelete(e.open ? t.id : null)}
                                                placement="center" closeOnInteractOutside={false}
                                            >
                                                <Dialog.Trigger asChild>
                                                    <Button size="xs" colorPalette="red" variant="ghost" title="Delete">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </Dialog.Trigger>
                                                <Portal>
                                                    <Dialog.Backdrop />
                                                    <Dialog.Positioner>
                                                        <Dialog.Content colorPalette="accent">
                                                            <Dialog.Header>
                                                                <Dialog.Title>Confirm Deletion</Dialog.Title>
                                                            </Dialog.Header>
                                                            <Dialog.Body>
                                                                <Text>
                                                                    Are you sure you want to delete <b>{t.name || "this template"}</b>? 
                                                                    This action cannot be undone.
                                                                </Text>
                                                            </Dialog.Body>
                                                            <Dialog.Footer w="full" justifyContent="flex-end">
                                                                <Dialog.ActionTrigger asChild>
                                                                    <Button variant="outline">Cancel</Button>
                                                                </Dialog.ActionTrigger>
                                                                <Button colorPalette="red" onClick={() => handleDelete(t.id)}>
                                                                    Delete Template
                                                                </Button>
                                                            </Dialog.Footer>
                                                            <Dialog.CloseTrigger asChild>
                                                                <CloseButton size="sm" />
                                                            </Dialog.CloseTrigger>
                                                        </Dialog.Content>
                                                    </Dialog.Positioner>
                                                </Portal>
                                            </Dialog.Root>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {templates.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>
                                        <EmptyState.Root>
                                            <EmptyState.Content>
                                                <EmptyState.Indicator>
                                                    <Upload size={40} />
                                                </EmptyState.Indicator>
                                                <EmptyState.Title>No Templates Found</EmptyState.Title>
                                                <EmptyState.Description>
                                                    Create your first ID card template to get started
                                                </EmptyState.Description>
                                            </EmptyState.Content>
                                        </EmptyState.Root>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>

            <Dialog.Root 
                open={isFormVisible} 
                onOpenChange={(e) => setIsFormVisible(e.open)}
                size="lg"
                placement="center" closeOnInteractOutside={false}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content maxH="90vh" overflowY="auto" colorPalette="accent">
                            <Dialog.Header>
                                <Dialog.Title>
                                    {templateId ? "Edit Template Details" : "Create New Template"}
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Flex direction="column" gap="5">
                                    <Flex gap="6" direction={{ base: "column", md: "row" }}>
                                        <Field.Root flex="1">
                                            <Field.Label>School Name</Field.Label>
                                            <Input
                                                value={formData.schoolName}
                                                onChange={(e) => setFormData((p) => ({ ...p, schoolName: e.target.value }))}
                                                placeholder="University name"
                                                size="xl"
                                            />
                                        </Field.Root>
                                        <Field.Root flex="1">
                                            <Field.Label>Faculty</Field.Label>
                                            <Input
                                                value={formData.faculty}
                                                onChange={(e) => setFormData((p) => ({ ...p, faculty: e.target.value }))}
                                                placeholder="Faculty name"
                                                size="xl"
                                            />
                                        </Field.Root>
                                    </Flex>
                                    <Flex gap="6" direction={{ base: "column", md: "row" }}>
                                        <Field.Root flex="1">
                                            <Field.Label>Department</Field.Label>
                                            <Input
                                                value={formData.department}
                                                onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                                                placeholder="Department name"
                                                size="xl"
                                            />
                                        </Field.Root>
                                        <Field.Root flex="1">
                                            <Field.Label>School Address</Field.Label>
                                            <Input
                                                value={formData.schoolAddress}
                                                onChange={(e) => setFormData((p) => ({ ...p, schoolAddress: e.target.value }))}
                                                placeholder="School address"
                                                size="xl"
                                            />
                                        </Field.Root>
                                    </Flex>

                                    {/* Templates */}
                                    <Box bg="slate.50" borderRadius="md" border="xs" borderColor="border.muted" p="6">
                                        <Text fontSize="md" fontWeight="bold" color="fg.muted" mb="6">Card Templates</Text>
                                        <Flex direction={{ base: "column", md: "row" }} gap="6">
                                            <Box flex="1"><UploadBox label="Front Template" type="frontTemplate" preview={previews.frontTemplate || existingUrls.frontTemplate} fileRef={fileInputRefs.frontTemplate} onFileChange={handleFileChange} /></Box>
                                            <Box flex="1"><UploadBox label="Back Template" type="backTemplate" preview={previews.backTemplate || existingUrls.backTemplate} fileRef={fileInputRefs.backTemplate} onFileChange={handleFileChange} /></Box>
                                        </Flex>
                                    </Box>

                                    {/* Branding */}
                                    <Box bg="slate.50" borderRadius="md" border="xs" borderColor="border.muted" p="6">
                                        <Text fontSize="md" fontWeight="bold" color="fg.muted" mb="6">Branding</Text>
                                        <Flex direction={{ base: "column", md: "row" }} gap="6">
                                            <Box flex="1"><UploadBox label="University Logo" type="logo" preview={previews.logo || existingUrls.logo} fileRef={fileInputRefs.logo} onFileChange={handleFileChange} /></Box>
                                            <Box flex="1"><UploadBox label="HOD Signature" type="signature" preview={previews.signature || existingUrls.signature} fileRef={fileInputRefs.signature} onFileChange={handleFileChange} /></Box>
                                        </Flex>
                                    </Box>

                                    {/* Back Card Text */}
                                    <Box bg="slate.50" borderRadius="md" border="xs" borderColor="border.muted" p="6">
                                        <Text fontSize="md" fontWeight="bold" color="fg.muted" mb="6">Back Card Content</Text>
                                        <Stack gap="6">
                                            <Field.Root>
                                                <Flex justifyContent="space-between" mb="2" width="full">
                                                    <Field.Label mb="0">Description</Field.Label>
                                                    <Text fontSize="xs" color="fg.subtle">{formData.backDescription.length}/120</Text>
                                                </Flex>
                                                <Textarea
                                                    value={formData.backDescription}
                                                    onChange={(e) => setFormData((p) => ({ ...p, backDescription: e.target.value.slice(0, 120) }))}
                                                    placeholder="Description on back of card"
                                                    size="xl"
                                                    rows={3}
                                                    resize="none"
                                                    bg="white"
                                                />
                                            </Field.Root>
                                            <Field.Root>
                                                <Flex justifyContent="space-between" mb="2" width="full">
                                                    <Field.Label mb="0">Disclaimer</Field.Label>
                                                    <Text fontSize="xs" color="fg.subtle">{formData.backDisclaimer.length}/95</Text>
                                                </Flex>
                                                <Textarea
                                                    value={formData.backDisclaimer}
                                                    onChange={(e) => setFormData((p) => ({ ...p, backDisclaimer: e.target.value.slice(0, 95) }))}
                                                    placeholder="Disclaimer text"
                                                    size="xl"
                                                    rows={3}
                                                    resize="none"
                                                    bg="white"
                                                />
                                            </Field.Root>
                                        </Stack>
                                    </Box>
                                </Flex>
                            </Dialog.Body>
                            <Dialog.Footer gap="3">
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" size="sm">Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    onClick={handleSave}
                                    loading={isSaving}
                                    loadingText="Saving..."
                                    disabled={
                                        isSaving ||
                                        !formData.schoolName.trim() ||
                                        !formData.faculty.trim() ||
                                        !formData.department.trim() ||
                                        !formData.schoolAddress.trim() ||
                                        !formData.backDescription.trim() ||
                                        !formData.backDisclaimer.trim()
                                    }
                                    colorPalette="accent"
                                    size="sm"
                                >
                                    Save Changes
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

        <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
    </Flex>
);
};

export default IDCardSettingsTab;
