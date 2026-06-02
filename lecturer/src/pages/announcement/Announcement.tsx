import { Card, For, Heading, Skeleton, Stack, Text, Separator } from "@chakra-ui/react"
import { useNotifications } from "@hooks/notification.hook"
import { EmptyStateView } from "@components/shared/empty-state"
import { LuBell, } from "react-icons/lu"
import moment from "moment"
import React from "react"

const AnnouncementsPage = () => {
    const { data, isLoading } = useNotifications()
    const notifications = (data?.data || []).filter(n => ["LECTURER", "ALL"].includes(n.recipientType));

    if (isLoading) {
        return (
            <Stack gap="4" p="4">
                <Skeleton h="10" w="200px" />
                <Skeleton h="32" />
                <Skeleton h="32" />
                <Skeleton h="32" />
            </Stack>
        )
    }

    return (
        <Stack gap="4" bg="bg" border="xs" borderColor="border.muted" rounded="md">
            <For
                each={notifications}
                fallback={
                    <EmptyStateView
                        icon={<LuBell />}
                        title="No announcements"
                        description="You don't have any announcements yet."
                    />
                }
            >
                {(item, index) => (
                    <React.Fragment key={item.id}>
                        <Card.Root
                            key={index}
                            variant="outline"
                            border="none"
                            bg="bg"
                        >
                            <Card.Body>
                                <Stack gap="1" flex="1">
                                    <Heading size="sm" fontWeight={item.read ? "semibold" : "bold"}>
                                        {item.title}
                                    </Heading>
                                    <Text color={item.read ? "fg.muted" : "fg"} fontSize="sm">
                                        {item.message}
                                    </Text>
                                    <Text fontSize="xs" color="fg.subtle" mt="2">
                                        {moment(item.createdAt).fromNow()}
                                    </Text>
                                </Stack>
                            </Card.Body>
                        </Card.Root>
                        {index < notifications.length - 1 && (
                            <Separator borderColor="border.muted" />
                        )}
                    </React.Fragment>
                )}
            </For>
        </Stack >
    )
}

export default AnnouncementsPage;