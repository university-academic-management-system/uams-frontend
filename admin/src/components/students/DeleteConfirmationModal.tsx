import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Dialog, Button, Box, Text, Textarea } from "@chakra-ui/react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    title: string;
    description: string;
    itemCount: number;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, description, itemCount }: DeleteConfirmationModalProps) => {
    const [reason, setReason] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        if (!reason.trim()) return;
        try {
            setIsDeleting(true);
            await onConfirm(reason);
        } catch (error) {
            console.error("Delete failed", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} role="alertdialog" placement="center" closeOnInteractOutside={false}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content bg="white" borderRadius="md" maxW="md" p="6" position="relative" colorPalette="accent">
                    <Dialog.CloseTrigger asChild>
                        <Box as="button" onClick={onClose} position="absolute" top="4" right="4" p="1" _hover={{ bg: "slate.50" }} borderRadius="full" cursor="pointer" border="none" bg="transparent" color="fg.subtle">
                            <X size={20} />
                        </Box>
                    </Dialog.CloseTrigger>

                    <Dialog.Header p="0" mb="3">
                        <Dialog.Title fontSize="lg" fontWeight="bold" color="fg.muted">
                            {title}
                        </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body p="0" mb="6">
                        <Text fontSize="sm" color="fg.muted" mb="4">
                            {description} You are about to delete <Box as="span" fontWeight="bold" color="fg.muted">{itemCount}</Box> items.
                        </Text>

                        <Box>
                            <Text fontSize="xs" fontWeight="bold" color="fg.subtle" textTransform="uppercase" letterSpacing="wider" mb="2">
                                Reason for deletion <Box as="span" color="red.500">*</Box>
                            </Text>
                            <Textarea 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g. Students graduated and left the university"
                                w="full"
                                p="3"
                                fontSize="sm"
                                border="1px solid"
                                borderColor="border.muted"
                                borderRadius="md"
                                outline="none"
                                minH="100px"
                                resize="none"
                                color="fg.muted"
                                _focus={{ borderColor: "accent", boxShadow: "0 0 0 1px var(--chakra-colors-accent)" }}
                            />
                        </Box>
                    </Dialog.Body>

                    <Dialog.Footer p="0" display="flex" justifyContent="flex-end" gap="3">
                        <Button onClick={onClose} disabled={isDeleting} size="xl" variant="outline" borderColor="border.muted" color="fg.muted" bg="white" _hover={{ bg: "slate.50" }}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirm} 
                            disabled={!reason.trim() || isDeleting} 
                            size="xl" 
                            bg="red.500" 
                            color="white" 
                            _hover={{ bg: "red.600" }}
                            _disabled={{ bg: "red.300", cursor: "not-allowed" }}
                            display="flex"
                            alignItems="center"
                            gap="2"
                        >
                            {isDeleting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
                            {isDeleting ? "Deleting..." : "Delete Permanently"}
                        </Button>
                        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default DeleteConfirmationModal;
