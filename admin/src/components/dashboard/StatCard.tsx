import { Box, Flex, Text } from "@chakra-ui/react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    description?: string;
}

export const StatCard = ({ label, value, icon, bgColor, description }: StatCardProps) => {
    return (
        <Flex
            bg={bgColor}
            p="6"
            borderRadius="md"
            alignItems="center"
            gap="5"
            transition="transform 0.2s"
            cursor="default"
            border="xs"
            borderColor="border.muted"
        > 
            <Flex
                bg="whiteAlpha.400"
                p="3"
                borderRadius="xl"
                color="fg.muted"
            >
                {icon}
            </Flex>
            <Box>
                <Text fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase" letterSpacing="wider" mb="1">
                    {label}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="fg.muted">
                    {value}
                </Text>
                {description && (
                    <Text fontSize="xs" color="fg.subtle" mt="1">{description}</Text>
                )}
            </Box>
        </Flex>
    );
};
