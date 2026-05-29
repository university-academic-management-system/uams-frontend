// @components/shared/TotalsStatCard.tsx
import { Stat, Card, Text, Flex, Icon, Skeleton, Stack } from "@chakra-ui/react";
import type { ReactElement } from "react";

interface TotalsStatCardProps {
  label: string;
  icon: ReactElement;
  value: string | number;
  description?: string;
  color?: string;
  isLoading?: boolean;
}

const TotalsStatCard = ({
  label,
  icon,
  value,
  description,
  color,
  isLoading = false,
}: TotalsStatCardProps) => {
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
    );
  }

  return (
    <Card.Root w="full" h="full" variant="subtle" bg="bg" border="xs" borderColor="border.muted">
      <Card.Body p="5">
        <Flex align="center" justify="space-between" mb="4">
          <Icon as={icon} size="md" color={color || "accent"} />
        </Flex>
        <Stat.Root>
          <Stat.Label fontSize="sm" fontWeight="medium" color="fg.muted">
            {label}
          </Stat.Label>
          <Stat.ValueText fontSize="lg" fontWeight="semibold" mt="1" color="fg">
            {value}
          </Stat.ValueText>
          {description && (
            <Text fontSize="xs" color="fg.subtle" mt="2">
              {description}
            </Text>
          )}
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default TotalsStatCard;