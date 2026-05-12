import { Card, Stack, Text, Box, Heading, Skeleton, Center } from "@chakra-ui/react";
import { User, UserX } from "lucide-react";
import ProjectHooks from "@/hooks/projects.hooks";

const SupervisorInfo = () => {
    const { data: supervisorResponse, isLoading } = ProjectHooks.useSupervisor();
    const supervisor = supervisorResponse?.data;

    if (isLoading) {
        return (
            <Card.Root variant="outline">
                <Card.Header>
                    <Skeleton height="6" width="40" />
                </Card.Header>
                <Card.Body>
                    <Stack gap="4">
                        <Box>
                            <Skeleton height="4" width="20" mb="2" />
                            <Skeleton height="4" width="full" />
                        </Box>
                        <Box>
                            <Skeleton height="4" width="20" mb="2" />
                            <Skeleton height="4" width="full" />
                        </Box>
                    </Stack>
                </Card.Body>
            </Card.Root>
        );
    }

    if (!supervisor) {
        return (
            <Card.Root variant="outline">
                <Card.Body py="10">
                    <Center flexDir="column" gap="2" textAlign="center">
                        <UserX size={40} color="gray" />
                        <Text fontWeight="bold">No Supervisor Assigned</Text>
                        <Text fontSize="sm" color="gray.500">Contact the department if this is an error.</Text>
                    </Center>
                </Card.Body>
            </Card.Root>
        );
    }

    return (
        <Card.Root variant="outline">
            <Card.Header>
                <Heading size="md" display="flex" alignItems="center" gap="2">
                    <User size={20} /> Supervisor Details
                </Heading>
            </Card.Header>
            <Card.Body>
                <Stack gap="4">
                    <Box>
                        <Text fontWeight="bold" fontSize="sm" color="gray.500">Name</Text>
                        <Text>{supervisor.name || "N/A"}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold" fontSize="sm" color="gray.500">Email Address</Text>
                        <Text>{supervisor.email || "N/A"}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold" fontSize="sm" color="gray.500">Staff Number</Text>
                        <Text>{supervisor.staffNumber || "N/A"}</Text>
                    </Box>
                </Stack>
            </Card.Body>
        </Card.Root>
    );
};

export default SupervisorInfo;
