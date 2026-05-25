import { EmptyState, VStack } from "@chakra-ui/react"
import type { EmptyStateViewProps } from "@type/index.type"


export const EmptyStateView = ({ icon, title, description, action }: EmptyStateViewProps) => {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                {icon && (
                    <EmptyState.Indicator>
                        {icon}
                    </EmptyState.Indicator>
                )}
                <VStack textAlign="center">
                    <EmptyState.Title>{title}</EmptyState.Title>
                    {description && (
                        <EmptyState.Description>
                            {description}
                        </EmptyState.Description>
                    )}
                </VStack>
                {action && action}
            </EmptyState.Content>
        </EmptyState.Root>
    )
}

export default EmptyStateView