import { Box, Flex, Text, Spinner, EmptyState, VStack, Button } from "@chakra-ui/react";
import { LuBell, LuCircleAlert } from "react-icons/lu";
import type { Notification } from "@type/notification.type";

interface AnnouncementListProps {
  announcements: Notification[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AnnouncementList = ({ 
  announcements, 
  isLoading, 
  error, 
  onRetry 
}: AnnouncementListProps) => {
  if (isLoading) {
    return (
      <Flex justify="center" py="12" direction="column" align="center" gap="3">
        <Spinner size="md" color="accent" />
        <Text color="fg.muted" fontSize="sm">Loading announcements...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" py={12}>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuCircleAlert />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>Failed to load announcements</EmptyState.Title>
              <EmptyState.Description>
                {error.message || "An unexpected error occurred. Please try again."}
              </EmptyState.Description>
              {onRetry && (
                <Button size="sm" onClick={onRetry} mt={2}>
                  Try Again
                </Button>
              )}
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Flex>
    );
  }

  if (announcements.length === 0) {
    return (
      <Flex justify="center" py={12}>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuBell />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>No announcements</EmptyState.Title>
              <EmptyState.Description>
                There are no announcements to display at this time.
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Flex>
    );
  }

  return (
    <Box>
      {announcements.map((item) => (
        <Flex
          key={item.id}
          justify="space-between"
          align="flex-start"
          py="5"
          borderBottom="1px solid"
          borderColor="border.muted"
          _last={{ borderBottom: "none" }}
          _hover={{ bg: "gray.50" }}
          transition="background 0.15s"
          px="4"
          rounded="md"
        >
          <Box maxW="500px">
            <Text fontSize="sm" fontWeight="600" color="fg.muted" mb="1">
              {item.title}
            </Text>
            <Text
              fontSize="xs"
              color="fg.muted"
              lineHeight="tall"
              overflow="hidden"
              display="-webkit-box"
              style={{ WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
            >
              {item.message}
            </Text>
          </Box>
          <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap" ml="8">
            {formatDate(item.createdAt)}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default AnnouncementList;