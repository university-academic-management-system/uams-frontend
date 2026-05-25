import { Stat, Card, Text, Flex, Icon, Skeleton, Stack } from "@chakra-ui/react"
import { useDashboardStats } from "@hooks/dashboard.hook"
import type { DashboardStatCardProps } from "@type/dashboard.type"


const DashboardStatCard = ({ label, icon, value, description, color }: DashboardStatCardProps) => {
    const { data: statsResponse, isLoading } = useDashboardStats()
    const stats = statsResponse?.data

    if (isLoading) {
        return (
            <Card.Root w="full" variant="subtle" bg="bg" border="xs" borderColor="border.muted">
                <Card.Body p="5">
                    <Stack gap="4">
                        <Skeleton h="6" w="6" />
                        <Stack gap="2">
                            <Skeleton h="4" w="24" />
                            <Skeleton h="8" w="16" />
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card.Root>
        )
    }

    const displayValue = value(stats!)
    const displayDescription = description?.(stats!)
    const displayColor = color?.(stats!)

    return (
        <Card.Root w="full" h="full" variant="subtle" bg="bg" border="xs" borderColor="border.muted">
            <Card.Body p="5">
                <Flex align="center" justify="space-between" mb="4">
                    <Icon as={icon} size="md" color={displayColor || "accent"} />
                </Flex>
                <Stat.Root>
                    <Stat.Label fontSize="sm" fontWeight="medium" color="fg.muted">{label}</Stat.Label>
                    <Stat.ValueText fontSize="lg" fontWeight="semibold" mt="1" color="fg">{displayValue}</Stat.ValueText>
                    {displayDescription && (
                        <Text fontSize="xs" color="fg.subtle" mt="2">
                            {displayDescription}
                        </Text>
                    )}
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    )
}

export default DashboardStatCard;


