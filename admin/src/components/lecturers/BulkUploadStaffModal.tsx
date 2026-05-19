import { useState, useRef } from "react";
import { X, Upload, FileUp } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Dialog, Button } from "@chakra-ui/react";
import { StaffHook } from "@hooks/staff.hook";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUploaded: () => void;
}

const BulkUploadStaffModal = ({ isOpen, onClose, onUploaded }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const uploadMutation = StaffHook.useBulkUploadStaff();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) setFile(selected);
    };

    const handleUpload = async () => {
        if (!file) {
            toaster.error({ title: "Please select a file first" });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            await uploadMutation.mutateAsync(formData);
            onUploaded();
        } catch (err) {
            // Error handled by mutation
        }
    };

    const handleClose = () => {
        setFile(null);
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) handleClose() }} placement="center" closeOnInteractOutside={false}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content bg="white" borderRadius="md" shadow="none" w="full" maxW="lg" position="relative" colorPalette="accent">
                    {/* Header */}
                    <Box p="6" borderBottom="xs" borderColor="border.muted">
                        <Dialog.CloseTrigger asChild>
                            <Box as="button" onClick={handleClose} position="absolute" top="4" right="4" p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="fg.subtle"><X size={20} /></Box>
                        </Dialog.CloseTrigger>
                        <Text fontSize="lg" fontWeight="bold" color="fg.muted" mb="2">Upload Lecturers</Text>
                        <Text fontSize="sm" color="fg.muted" mb="4">Upload a CSV file containing the lecturers data. Download the sample file below to see the required format.</Text>
                        
                        <a href="/admin/documents/Lecturer_Sample_File.csv" download="Lecturer_Sample_File.csv" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#2563eb", textDecoration: "none", transition: "color 0.2s" }}>
                            <FileUp size={16} /> Download Sample CSV Template
                        </a>
                    </Box>

                    {/* Upload Zone */}
                    <Box p="6">
                        <Flex
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            border="2px dashed"
                            borderColor={file ? "blue.400" : "fg.subtle"}
                            bg={file ? "blue.50" : "transparent"}
                            borderRadius="md"
                            p="8"
                            cursor="pointer"
                            _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                            transition="all 0.2s"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            {file ? (
                                <Flex direction="column" alignItems="center" gap="2">
                                    <FileUp size={28} color="#3b82f6" />
                                    <Text fontSize="sm" fontWeight="semibold" color="fg.muted">{file.name}</Text>
                                    <Text fontSize="xs" color="fg.muted">{(file.size / 1024).toFixed(1)} KB</Text>
                                </Flex>
                            ) : (
                                <Flex direction="column" alignItems="center" gap="2">
                                    <Upload size={28} color="#94a3b8" />
                                    <Text fontSize="sm" fontWeight="medium" color="fg.muted">Click to select a file</Text>
                                    <Text fontSize="xs" color="fg.subtle">Supports CSV, XLSX, XLS</Text>
                                </Flex>
                            )}
                        </Flex>
                    </Box>

                    {/* Actions */}
                    <Flex p="6" borderTop="xs" borderColor="border.muted" justifyContent="flex-end" gap="3">
                        <Button variant="subtle" onClick={handleClose} size="xl" borderRadius="md">Cancel</Button>
                        <Button onClick={handleUpload} size="xl" borderRadius="md" bg="#1D7AD9" color="white" cursor={(!file || uploadMutation.isPending) ? "not-allowed" : "pointer"} _hover={{ bg: (!file || uploadMutation.isPending) ? "#1D7AD9" : "blue.700" }} opacity={(!file || uploadMutation.isPending) ? 0.5 : 1} alignItems="center" gap="2" disabled={!file || uploadMutation.isPending} loading={uploadMutation.isPending}>
                            Upload
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default BulkUploadStaffModal;