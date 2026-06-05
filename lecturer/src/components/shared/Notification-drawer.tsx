import { Box, CloseButton, Drawer, Flex, IconButton, Portal, Stack, Text, Badge, For, Skeleton, Button } from "@chakra-ui/react"
import { Tooltip } from "@components/ui/tooltip";
import { LuBell, LuInfo, LuX, LuCircleCheck, LuCheckCheck } from "react-icons/lu";
import { useNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@hooks/notification.hook"
import moment from "moment"
import { useQueryClient } from "@tanstack/react-query";
import { PiWarning } from "react-icons/pi";


const NotificationDrawer = () => {
    const queryClient = useQueryClient()
    const { data, isLoading } = useNotifications()
    const notifications = (data?.data || []).filter(n=> n.recipientType === "SINGLE" )
    const unreadCount = notifications.filter(n => !n.read).length



    const { mutate: markAllRead, isPending: markingAllRead } = useMarkAllNotificationsRead({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        }
    })

    const { mutate: markRead } = useMarkNotificationRead({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        }
    })

    const getIcon = (type: string) => {
        switch (type) {
            case "SUCCESS": return <LuCircleCheck color="var(--chakra-colors-green-500)" />
            case "WARNING": return <PiWarning color="var(--chakra-colors-orange-500)" />
            case "ERROR": return <LuX color="var(--chakra-colors-red-500)" />
            default: return <LuInfo color="var(--chakra-colors-blue-500)" />
        }
    }

    return (
        <Drawer.Root modal={false} size="md">
            <Tooltip content="Notifications">
                <Drawer.Trigger asChild>
                    <IconButton variant="ghost" size="md" color="fg.muted" position="relative">
                        <LuBell />
                        {unreadCount > 0 && (
                            <Badge
                                position="absolute"
                                top="-1"
                                right="-1"
                                variant="solid"
                                colorPalette="red"
                                rounded="full"
                                size="xs"
                                px="1"
                                minW="4"
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </IconButton>
                </Drawer.Trigger>
            </Tooltip>
            <Portal>
                <Drawer.Positioner pt={{ base: 0, md: 14 }} pr={{ base: 0, md: "16" }} pb={{ base: 0, md: 4 }}>
                    <Drawer.Content rounded="md">
                        <Drawer.Header>
                            <Flex justify="space-between" align="center" w="full" pr="10">
                                <Drawer.Title>Notifications</Drawer.Title>
                                {unreadCount > 0 && (
                                    <Button
                                        size="xs"
                                        variant="ghost"
                                        colorPalette="accent"
                                        onClick={() => markAllRead()}
                                        loading={markingAllRead}
                                    >
                                        <LuCheckCheck /> Mark all as read
                                    </Button>
                                )}
                            </Flex>
                        </Drawer.Header>
                        <Drawer.Body p="0">
                            {isLoading ? (
                                <Stack p="4" gap="4">
                                    <Skeleton h="20" />
                                    <Skeleton h="20" />
                                    <Skeleton h="20" />
                                </Stack>
                            ) : (
                                <Stack gap="0" divideY="1px" divideColor="border.muted">
                                    <For
                                        each={notifications}
                                        fallback={
                                            <Flex p="8" justify="center" align="center" direction="column" gap="2">
                                                <LuBell size="24" color="var(--chakra-colors-fg-subtle)" />
                                                <Text color="fg.subtle" fontSize="sm">No notifications</Text>
                                            </Flex>
                                        }
                                    >
                                        {(item) => (
                                            <Box
                                                key={item.id}
                                                p="4"
                                                bg={item.read ? "transparent" : "accent.subtle/50"}
                                                _hover={{ bg: "bg.subtle" }}
                                                transition="background 0.2s"
                                                cursor="pointer"
                                                onClick={() => !item.read && markRead(item.id)}
                                            >
                                                <Flex gap="3" align="flex-start">
                                                    <Box pt="1">{getIcon(item.type)}</Box>
                                                    <Stack gap="0.5" flex="1">
                                                        <Text fontWeight={item.read ? "medium" : "bold"} fontSize="sm">
                                                            {item.title}
                                                        </Text>
                                                        <Text fontSize="xs" color="fg.muted" lineClamp={2}>
                                                            {item.message}
                                                        </Text>
                                                        <Text fontSize="10px" color="fg.subtle" mt="1">
                                                            {moment(item.createdAt).fromNow()}
                                                        </Text>
                                                    </Stack>
                                                </Flex>
                                            </Box>
                                        )}
                                    </For>
                                </Stack>
                            )}
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

export default NotificationDrawer;