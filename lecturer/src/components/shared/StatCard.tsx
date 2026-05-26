// @components/shared/StatCard.tsx
import { Box, Text, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";  

interface StatCardProps {
    label: string;
    value: number | string;
    icon?: ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
    return (
        <Box
            bg="white"
            rounded="md"
            border="1px solid"
            borderColor="border.muted"
            px="6"
            py="5"
            flex="1"
            minW="160px"
            h="100%"
        >
            <Flex align="center" justify="space-between" mb="2">
                <Text fontSize="sm" color="fg.subtle" textTransform="uppercase">
                    {label}
                </Text>
                {icon && <Box color="accent">{icon}</Box>}
            </Flex>
            <Text fontSize="xl"  color="fg.muted" lineHeight="1.2">
                {value}
            </Text>
        </Box>
    );
};

export default StatCard;