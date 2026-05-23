import { Stat, Card, Text, Flex, Icon } from "@chakra-ui/react"
import type { DashboardStatCardProps } from "@type/dashboard.type";


const DashboardStatCard = ({ label, value, icon, description}: DashboardStatCardProps) => {
    return (
        <Card.Root w="full" variant="subtle" bg="bg" border="xs" borderColor="border.muted">
            <Card.Body p="5">
                <Flex align="center" justify="space-between" mb="4">
                    <Icon as={icon} size="md" color={"accent"} />
                </Flex>
                <Stat.Root>
                    <Stat.Label fontSize="sm" fontWeight="medium" color="fg.muted">{label}</Stat.Label>
                    <Stat.ValueText fontSize="xl" fontWeight="bold" mt="1" color="fg">{value}</Stat.ValueText>
                    {description && (
                        <Text fontSize="xs" color="fg.subtle" mt="2">
                            {description}
                        </Text>
                    )}
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    )
}

export default DashboardStatCard;
