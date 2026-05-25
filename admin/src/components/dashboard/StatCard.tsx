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
            p="5"
            borderRadius="lg"
            direction="column"
            alignItems="flex-start"
            transition="transform 0.2s"
            cursor="default"
            border="xs"
            borderColor="border.muted"
        > 
            <Box color="blue.600" mb="4">
                {icon}
            </Box>
            <Text fontSize="sm" color="fg.muted" mb="1">
                {label}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="fg.default" mb="2">
                {value}
            </Text>
            {description && (
                <Text fontSize="xs" color="fg.subtle">{description}</Text>
            )}
        </Flex>
    );
};
