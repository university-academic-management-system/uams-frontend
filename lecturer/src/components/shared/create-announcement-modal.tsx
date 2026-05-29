import { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { X, ChevronDown } from "lucide-react";
import type { CreateAnnouncementPayload } from "@type/announcement.type";
import useCreateAnnouncementForm from "@forms/create-announcement.form";

interface CreateAnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateAnnouncementPayload) => void;
}

const RECIPIENT_OPTIONS = ["Student", "Staff", "Management"];

const CreateAnnouncementModal = ({ isOpen, onClose, onSubmit }: CreateAnnouncementModalProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useCreateAnnouncementForm();

    const recipients = watch("recipients");

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const toggleRecipient = (r: string) => {
        const updated = recipients.includes(r)
            ? recipients.filter((x) => x !== r)
            : [...recipients, r];
        setValue("recipients", updated, { shouldValidate: true });
    };

    const handleFormSubmit = handleSubmit((data) => {
        onSubmit({ title: data.title, recipients: data.recipients, description: data.description });
        reset();
        onClose();
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.500"
            zIndex="1000"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Box bg="white" borderRadius="lg" p="8" w="550px" maxH="90vh" overflowY="auto">
                {/* Header */}
                <Flex justify="space-between" align="center" mb="6">
                    <Heading size="md" fontWeight="600" color="accent.500">
                        Create New Announcement
                    </Heading>
                    <Box cursor="pointer" onClick={handleClose} _hover={{ opacity: 0.7 }}>
                        <X size={20} color="#718096" />
                    </Box>
                </Flex>

                <form onSubmit={handleFormSubmit}>
                    {/* Title */}
                    <Box mb="5">
                        <Text fontSize="sm" fontWeight="600" color="gray.800" mb="2">
                            Title <Text as="span" color="red.500">*</Text>
                        </Text>
                        <input
                            placeholder="Announcement Title"
                            {...register("title")}
                            style={{
                                width: "100%",
                                border: `1px solid ${errors.title ? "#E53E3E" : "#E2E8F0"}`,
                                borderRadius: "8px",
                                padding: "10px 14px",
                                fontSize: "13px",
                                outline: "none",
                                background: "transparent",
                            }}
                        />
                        {errors.title && (
                            <Text fontSize="11px" color="red.500" mt="1">
                                {errors.title.message}
                            </Text>
                        )}
                    </Box>

                    {/* Recipients */}
                    <Box mb="5" ref={dropdownRef}>
                        <Text fontSize="sm" fontWeight="600" color="gray.800" mb="2">
                            Recipient(s) <Text as="span" color="red.500">*</Text>
                        </Text>
                        <Flex
                            align="center"
                            justify="space-between"
                            border="1px solid"
                            borderColor={errors.recipients ? "red.500" : "gray.200"}
                            borderRadius="md"
                            px="3"
                            py="2.5"
                            cursor="pointer"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <Text fontSize="xs" color={recipients.length > 0 ? "gray.700" : "gray.400"}>
                                {recipients.length > 0 ? recipients.join(", ") : "Select Recipient(s)"}
                            </Text>
                            <ChevronDown size={16} color="#A0AEC0" />
                        </Flex>
                        {dropdownOpen && (
                            <Box
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="md"
                                mt="1"
                                py="2"
                                bg="white"
                            >
                                {RECIPIENT_OPTIONS.map((r) => (
                                    <Flex
                                        key={r}
                                        align="center"
                                        gap="2"
                                        px="3"
                                        py="2"
                                        cursor="pointer"
                                        _hover={{ bg: "gray.50" }}
                                        onClick={() => toggleRecipient(r)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={recipients.includes(r)}
                                            onChange={() => {}}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <Text fontSize="xs" color="gray.700">{r}</Text>
                                    </Flex>
                                ))}
                            </Box>
                        )}
                        {errors.recipients && (
                            <Text fontSize="11px" color="red.500" mt="1">
                                {errors.recipients.message}
                            </Text>
                        )}
                    </Box>

                    {/* Description */}
                    <Box mb="6">
                        <Text fontSize="sm" fontWeight="600" color="gray.800" mb="2">
                            Description <Text as="span" color="red.500">*</Text>
                        </Text>
                        <textarea
                            placeholder="Describe announcement in details"
                            {...register("description")}
                            rows={5}
                            style={{
                                width: "100%",
                                border: `1px solid ${errors.description ? "#E53E3E" : "#E2E8F0"}`,
                                borderRadius: "8px",
                                padding: "10px 14px",
                                fontSize: "13px",
                                outline: "none",
                                resize: "vertical",
                                background: "transparent",
                                fontFamily: "inherit",
                            }}
                        />
                        {errors.description && (
                            <Text fontSize="11px" color="red.500" mt="1">
                                {errors.description.message}
                            </Text>
                        )}
                    </Box>

                    {/* Footer Buttons */}
                    <Flex justify="center" gap="3">
                        <Flex
                            align="center"
                            justify="center"
                            px="6"
                            py="2.5"
                            border="1px solid"
                            borderColor="gray.300"
                            borderRadius="md"
                            cursor="pointer"
                            _hover={{ bg: "gray.50" }}
                            transition="background 0.15s"
                            onClick={handleClose}
                        >
                            <Text fontSize="sm" fontWeight="500" color="gray.700">Cancel</Text>
                        </Flex>
                        <button
                            type="submit"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "10px 24px",
                                backgroundColor: "var(--chakra-colors-accent-500)",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                                transition: "background 0.15s",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "white",
                            }}
                        >
                            Create Announcement
                        </button>
                    </Flex>
                </form>
            </Box>
        </Box>
    );
};

export default CreateAnnouncementModal;
