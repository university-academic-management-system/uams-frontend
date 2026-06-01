import { CloseButton, Drawer, IconButton, Portal, Stack, Text, Timeline, Flex, Skeleton, For } from "@chakra-ui/react"
import { Tooltip } from "@components/ui/tooltip";
import { LuActivity, LuUser, LuKey, LuSettings, LuShield, LuFileText } from "react-icons/lu";
import { useMyAuditLogs } from "@hooks/notification.hook"
import moment from "moment"
import { toTitleCase } from "@utils/function.util";


const AuditLogs = () => {
    const { data, isLoading } = useMyAuditLogs({ limit: 20 })
    const logs = data?.data?.data || []

    const getIcon = (action: string) => {
        if (action.includes("LOGIN")) return <LuUser />
        if (action.includes("PASSWORD") || action.includes("AUTH")) return <LuKey />
        if (action.includes("UPDATE") || action.includes("SETTINGS")) return <LuSettings />
        if (action.includes("CREATE")) return <LuShield />
        return <LuFileText />
    }

    return (
        <Drawer.Root modal={false} size="xs">
            <Tooltip content="Audit Logs">
                <Drawer.Trigger asChild>
                    <IconButton variant="ghost" size="md" color="fg.muted">
                        <LuActivity />
                    </IconButton>
                </Drawer.Trigger>
            </Tooltip>
            <Portal>
                <Drawer.Positioner pt={{ base: 0, md: 14 }} pr={{ base: 0, md: 4 }} pb={{ base: 0, md: 4 }}>
                    <Drawer.Content rounded="md">
                        <Drawer.Header>
                            <Drawer.Title>Activity Logs</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            {isLoading ? (
                                <Stack gap="6">
                                    <Skeleton h="20" />
                                    <Skeleton h="20" />
                                    <Skeleton h="20" />
                                </Stack>
                            ) : (
                                <Timeline.Root gap="6">
                                    <For
                                        each={logs}
                                        fallback={
                                            <Flex p="8" justify="center" align="center" direction="column" gap="2">
                                                <LuActivity size="24" color="var(--chakra-colors-fg-subtle)" />
                                                <Text color="fg.subtle" fontSize="sm">No activity logs</Text>
                                            </Flex>
                                        }
                                    >
                                        {(log) => (
                                            <Timeline.Item key={log.id}>
                                                <Timeline.Connector>
                                                    <Timeline.Separator />
                                                    <Timeline.Indicator>
                                                        {getIcon(log.action)}
                                                    </Timeline.Indicator>
                                                </Timeline.Connector>
                                                <Timeline.Content>
                                                    <Timeline.Title fontSize="sm" fontWeight="semibold">
                                                        {log.entity}
                                                    </Timeline.Title>
                                                    <Timeline.Description fontSize="xs">
                                                        {moment(log.createdAt).fromNow()}
                                                    </Timeline.Description>
                                                    <Text fontSize="xs" color="fg.muted" mt="1">
                                                        {toTitleCase(log.action.replace(/_/g, " "))}
                                                    </Text>
                                                </Timeline.Content>
                                            </Timeline.Item>
                                        )}
                                    </For>
                                </Timeline.Root>
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

export default AuditLogs;
