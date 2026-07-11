import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Separator,
} from "@chakra-ui/react";
import { LuAlertTriangle, LuHome, LuArrowLeft, LuRefreshCw } from "react-icons/lu";

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    const isNotFound = isRouteErrorResponse(error) && error.status === 404;
    const status = isRouteErrorResponse(error) ? error.status : "Error";
    const title = isNotFound ? "Page Not Found" : "Something Went Wrong";
    const message = isRouteErrorResponse(error)
        ? error.statusText || error.data?.message || (isNotFound
            ? "The page you are looking for doesn't exist or may have been moved."
            : "An unexpected error occurred while loading this page.")
        : "An unexpected error occurred. Please try again, or contact support if the problem persists.";

    const devDetail =
        import.meta.env.DEV && error instanceof Error ? error.message : undefined;

    return (
        <Flex
            minH="100vh"
            w="full"
            bg="bg.subtle"
            align="center"
            justify="center"
            p={{ base: "4", md: "8" }}
        >
            <Box
                w="full"
                maxW="lg"
                bg="bg"
                rounded="md"
                border="xs"
                borderColor="border.muted"
                p={{ base: "8", md: "12" }}
                textAlign="center"
            >
                <VStack gap="6">
                    <Flex
                        align="center"
                        justify="center"
                        boxSize="16"
                        rounded="full"
                        bg="red.50"
                        color="red.500"
                    >
                        <LuAlertTriangle size={32} />
                    </Flex>

                    <Stack gap="2" align="center">
                        <Text
                            fontSize="5xl"
                            fontWeight="black"
                            color="fg.muted"
                            lineHeight="1"
                        >
                            {status}
                        </Text>
                        <Heading size="xl" fontWeight="bold" color="fg">
                            {title}
                        </Heading>
                        <Text color="fg.subtle" maxW="sm">
                            {message}
                        </Text>
                    </Stack>

                    {devDetail && (
                        <Box
                            w="full"
                            bg="bg.muted/30"
                            border="xs"
                            borderColor="border.muted"
                            rounded="md"
                            p="3"
                            textAlign="left"
                        >
                            <Text fontSize="xs" color="fg.muted" fontFamily="mono" wordBreak="break-word">
                                {devDetail}
                            </Text>
                        </Box>
                    )}

                    <Separator borderColor="border.muted" w="full" />

                    <HStack gap="3" w="full" justify="center">
                        <Button
                            variant="outline"
                            colorPalette="gray"
                            size="lg"
                            onClick={() => navigate(-1)}
                        >
                            <LuArrowLeft size={16} />
                            Go Back
                        </Button>
                        <Button
                            colorPalette="accent"
                            size="lg"
                            onClick={() => navigate("/")}
                        >
                            <LuHome size={16} />
                            Go Home
                        </Button>
                        <Button
                            variant="ghost"
                            colorPalette="gray"
                            size="lg"
                            onClick={() => window.location.reload()}
                        >
                            <LuRefreshCw size={16} />
                            Reload
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Flex>
    );
};

export default ErrorPage;
