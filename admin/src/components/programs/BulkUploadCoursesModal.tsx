import { useState } from "react";
import { Upload, FileUp } from "lucide-react";
import { toaster } from "@components/ui/toaster";
import { 
  Flex, 
  Text,
  Button, 
  Dialog,
  Portal,
  VStack,
  CloseButton,
  FileUpload
} from "@chakra-ui/react";
import { CourseHook } from "@hooks/course.hook";

interface Props {
    children: React.ReactNode;
}

const BulkUploadCoursesModal = ({ children }: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const { mutate: uploadCourses, isPending: isUploading } = CourseHook.useBulkUploadCourses();



    const handleUpload = async () => {
        if (!file) {
            toaster.error({ title: "Please select a file first" });
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        uploadCourses(formData);
    };


    return (
        <Dialog.Root size="lg" role="alertdialog" onExitComplete={() => setFile(null)} placement="center" closeOnInteractOutside={false}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content rounded="md" overflow="hidden" colorPalette="accent">
                        <Dialog.Header p="6">
                            <Flex justifyContent="space-between" alignItems="start" w="full">
                                <VStack align="start" gap={1}>
                                    <Dialog.Title fontSize="lg" fontWeight="bold" color="fg.muted">Bulk Upload Courses</Dialog.Title>
                                    <Dialog.Description fontSize="sm" color="fg.muted">
                                        Upload an Excel file containing courses data. Download the sample file below to see the required format.
                                        <br />
                                        <a href="/admin/documents/course-upload-template.xlsx" download="Course_Upload_Template.xlsx" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#2563eb", textDecoration: "none", transition: "color 0.2s", marginTop: "16px" }}>
                                            <FileUp size={16} /> Download Upload Excel Template
                                        </a>
                                    </Dialog.Description>
                                </VStack>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton colorPalette="gray" />
                                </Dialog.CloseTrigger>
                            </Flex>
                        </Dialog.Header>

                        <Dialog.Body p="8">
                            <VStack gap="6" align="stretch">

                                <FileUpload.Root
                                    onFileChange={(details) => setFile(details.acceptedFiles[0] || null)}
                                    accept={[".xlsx", ".xls"]}
                                    maxFiles={1}
                                    maxFileSize={5 * 1024 * 1024}
                                >
                                    <FileUpload.Dropzone
                                        border="2px dashed"
                                        borderColor={file ? "blue.400" : "fg.subtle"}
                                        bg={file ? "blue.50/30" : "transparent"}
                                        borderRadius="xl"
                                        p="10"
                                        cursor="pointer"
                                        _hover={{ borderColor: "blue.400", bg: "blue.50/30" }}
                                        transition="all 0.2s"
                                        flexDirection="column"
                                        width="100%"
                                        alignItems="center"
                                        justifyContent="center"
                                        display="flex"
                                    >
                                        <FileUpload.HiddenInput />
                                        {file ? (
                                            <VStack gap="2">
                                                <FileUp size={32} color="#3b82f6" />
                                                <Text fontSize="sm" fontWeight="bold" color="fg.muted">{file.name}</Text>
                                                <Text fontSize="xs" color="fg.muted">{(file.size / 1024).toFixed(1)} KB</Text>
                                                <Button
                                                    size="xl"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                    }}
                                                >
                                                    Remove file
                                                </Button>
                                            </VStack>
                                        ) : (
                                            <VStack gap="2">
                                                <Upload size={32} color="#94a3b8" />
                                                <VStack gap="0">
                                                    <Text fontSize="sm" fontWeight="bold" color="fg.muted">Click or drag to upload</Text>
                                                    <Text fontSize="xs" color="fg.muted">Excel files only (.xlsx, .xls)</Text>
                                                </VStack>
                                            </VStack>
                                        )}
                                    </FileUpload.Dropzone>
                                </FileUpload.Root>
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer p="6" gap="3">
                            <Dialog.ActionTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    colorPalette="gray"
                                    size="xl"
                                >
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button 
                                onClick={handleUpload}
                                loading={isUploading}
                                loadingText="Uploading..."
                                disabled={!file}
                                size="xl"
                            >
                                Start Upload
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default BulkUploadCoursesModal;
