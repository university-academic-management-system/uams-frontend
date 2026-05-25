import { Box, Flex, Tabs, Spinner, Text, Center, Heading, Button } from "@chakra-ui/react";
import { BookOpen, Layers, AlertCircle } from "lucide-react";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

const CoursesTab = lazy(() => import("@components/programs/CoursesTab"));
const ProgramTypeTab = lazy(() => import("@components/programs/ProgramTypeTab"));

const ProgramCoursesPage = () => {
    const { reset } = useQueryErrorResetBoundary();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ErrorFallback = ({ resetErrorBoundary }: any) => (
        <Center minH="400px" p={6}>
            <Flex direction="column" alignItems="center" gap={4} textAlign="center">
                <Box color="red.500">
                    <AlertCircle size={40} />
                </Box>
                <Heading size="sm" color="fg.muted">Failed to load content</Heading>
                <Text color="fg.subtle" fontSize="sm">
                    There was an error connecting to the server.
                </Text>
                <Button size="sm" variant="outline" onClick={() => resetErrorBoundary()}>
                    Try Again
                </Button>
            </Flex>
        </Center>
    );

    return (
        <Flex direction="column" gap="6">
            <Box>
                <Tabs.Root defaultValue="program-types" variant="enclosed" position="relative">
                    <Tabs.List mb="6">
                        <Tabs.Trigger value="program-types">
                            <Layers size={16} /> Programmes
                        </Tabs.Trigger>
                        <Tabs.Trigger value="courses">
                            <BookOpen size={16} /> Courses
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="courses" p={0}>
                        <ErrorBoundary onReset={reset} fallbackRender={ErrorFallback}>
                            <Suspense fallback={
                                <Flex alignItems="center" justifyContent="center" minH="400px">
                                    <Flex direction="column" alignItems="center" gap="4">
                                        <Spinner size="xl" colorPalette="accent" borderWidth="3px" />
                                        <Text color="fg.muted">Loading Courses...</Text>
                                    </Flex>
                                </Flex>
                            }>
                                <CoursesTab />
                            </Suspense>
                        </ErrorBoundary>
                    </Tabs.Content>
                    <Tabs.Content value="program-types" p={0}>
                        <ErrorBoundary onReset={reset} fallbackRender={ErrorFallback}>
                            <Suspense fallback={
                                <Flex alignItems="center" justifyContent="center" minH="400px">
                                    <Flex direction="column" alignItems="center" gap="4">
                                        <Spinner size="xl" colorPalette="accent" borderWidth="3px" />
                                        <Text color="fg.muted">Loading Programmes...</Text>
                                    </Flex>
                                </Flex>
                            }>
                                <ProgramTypeTab />
                            </Suspense>
                        </ErrorBoundary>
                    </Tabs.Content>
                </Tabs.Root>
            </Box>
        </Flex>
    );
};

export default ProgramCoursesPage;
