import { EmptyState, VStack } from "@chakra-ui/react"
import type { ReactElement } from "react"

interface EmptyStateViewProps {
    icon?: ReactElement
    title: string
    description?: string
}

export const EmptyStateView = ({ icon, title, description }: EmptyStateViewProps) => {
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
            </EmptyState.Content>
        </EmptyState.Root>
    )
}

export default EmptyStateView
