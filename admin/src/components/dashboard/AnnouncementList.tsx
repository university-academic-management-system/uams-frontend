import { Box, Flex, Text, Button, EmptyState } from "@chakra-ui/react";
import { Plus, Megaphone } from "lucide-react";
import { useNavigate } from "react-router";
import type { Announcement } from "@type/common.type";

interface Props {
    announcements: Announcement[];
}

const AnnouncementList = ({ announcements }: Props) => {
    const navigate = useNavigate();

    return (
        <Box bg="bg" borderRadius="md" p="4" border="xs" borderColor="border.muted" display="flex" flexDirection="column" h="full">
            <Flex alignItems="center" justifyContent="space-between" mb="4">
                <Text fontWeight="bold" color="fg.muted">Announcements</Text>
                <Button
                    bg="accent.500"
                    color="white"
                    px="3"
                    py="1.5"
                    borderRadius="round"
                    fontSize="xs"
                    fontWeight="semibold"
                    cursor="pointer"
                    onClick={() => navigate("/announcements")}
                    size="xs"
                >
                <Plus /> Create New
                </Button>
            </Flex>

            <Flex direction="column" gap="4" overflowY="auto" maxH="350px" pr="2">
                {announcements.length === 0 ? (
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <Megaphone />
                            </EmptyState.Indicator>
                            <EmptyState.Title>No Announcements</EmptyState.Title>
                            <EmptyState.Description>
                                There are no announcements yet
                            </EmptyState.Description>
                        </EmptyState.Content>
                    </EmptyState.Root>
                ) : (
                    announcements.map((item) => (
                        <Box key={item.id} borderBottom="xs" borderColor="border.muted" pb="4" _last={{ borderBottom: "none", pb: "0" }}>
                            <Flex justifyContent="space-between" alignItems="flex-start" mb="1">
                                <Text fontSize="sm" fontWeight="semibold" color="fg.muted" _hover={{ color: "blue.600" }} transition="all 0.2s">
                                    {item.title}
                                </Text>
                                <Text fontSize="10px" fontWeight="medium" color="fg.subtle" bg="slate.50" px="1.5" py="0.5" borderRadius="sm" textTransform="uppercase" letterSpacing="tighter">
                                    {item.date}
                                </Text>
                            </Flex>
                            <Text fontSize="xs" color="fg.muted" lineHeight="relaxed" lineClamp={2}>
                                {item.description}
                            </Text>
                        </Box>
                    ))
                )}
            </Flex>
        </Box>
    );
};

export default AnnouncementList;