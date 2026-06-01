import { AbsoluteCenter, Badge, Box, Button, Card, DataList, Flex, For, GridItem, Heading, HStack, SimpleGrid, Skeleton, SkeletonCircle, SkeletonText, Span, Stack, Text } from "@chakra-ui/react";
import CreateTopicDialog from "@components/projects/create-topic-dialog";
import EmptyStateView from "@components/shared/empty-state";
import { useMe } from "@hooks/auth.hook";
import { useConnectGoogle, useGetProjects, useGetProjectTopics, useStartProject } from "@hooks/project.hook";
import type { SuggestedTopic } from "@type/project.type";
import { toTitleCase } from "@utils/function.util";
import moment from "moment";
import { lazy, Suspense, useCallback, useMemo } from "react";
import { LuFolderKanban, LuNotepadText, LuPenLine } from "react-icons/lu";
import { toaster } from "@components/ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import LinkButton from "@components/shared/buttons/LinkButton";

// lazy imports
const EditTopicDialog = lazy(() => import("@components/projects/edit-topic-dialog"));
const ProjectPreviewDialog = lazy(() => import("@components/projects/project-preview-dialog"));
const OfflineGuide = lazy(() => import("@components/projects/offline-guide"));



const Projects = () => {
    const { data: me, isLoading: userLoading } = useMe();
    const isL400 = useMemo(() => me?.studentProfile?.level === "L400", [me?.studentProfile]);
    const queryClient = useQueryClient();

    const { data: topicsData, isLoading: topicsLoading } = useGetProjectTopics(me?.studentProfile?.currentSession);
    const { data: project, isLoading: projectsLoading } = useGetProjects();

    const hasApprovedTopic = useMemo(() => !!project?.approvedTopic, [project]);
    const approvedTopic = useMemo(() => project?.approvedTopic, [project]);

    const { mutate: connectGoogle, isPending: connectingGoogle } = useConnectGoogle({
        onSuccess: (res) => {
            if (res.data.authUrl) {
                window.location.href = res.data.authUrl;
            }
        }
    });

    const { mutate: startProject, isPending: startingProject } = useStartProject({
        onSuccess: () => {
            toaster.success({ description: "Project started successfully. Google Doc created!" });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
    });

    const handleStartProject = useCallback(() => {
        if (!me?.studentProfile?.googleAccessToken) {
            connectGoogle();
        } else {
            startProject();
        }
    }, [me, connectGoogle, startProject]);



    if (userLoading || ((topicsLoading || projectsLoading) && isL400)) return (
        <Stack gap="6" maxW="3xl">
            <Flex width="full" gap="4">
                <SkeletonCircle size="10" />
                <SkeletonText noOfLines={2} />
            </Flex>
            <Skeleton height="200px" />
            <Skeleton height="200px" />
            <Skeleton height="200px" />
        </Stack>
    );

    if (!isL400) return (
        <AbsoluteCenter w="full">
            <EmptyStateView
                icon={<LuFolderKanban />}
                title="Feature not available"
                description="Project feature is only available to 400 Level students."
            />
        </AbsoluteCenter>
    );

    return (
        <SimpleGrid columns={{ base: 1, md: 4 }} gap="8" h="calc(100vh - 68px)" m={{ base: "0", md: "-4" }}>
            <GridItem colSpan={3} p={{ base: 0, md: 4 }} spaceY={10}>
                {/* default view for project topics */}
                {!hasApprovedTopic ? (<Stack gap="6">
                    <Flex justify="space-between" align="center">
                        <Heading>Project Topics</Heading>
                        {topicsData && <CreateTopicDialog />}
                    </Flex>

                    <For
                        each={topicsData || []}
                        fallback={
                            <EmptyStateView
                                icon={<LuNotepadText />}
                                title="No project topics found"
                                description="You have not created any project topics yet."
                                action={<CreateTopicDialog />}
                            />
                        }
                    >
                        {(topic, index) => (
                            <ProjectTopicCard key={topic.id} topic={topic} index={index} />
                        )}
                    </For>
                </Stack>) : (
                    <Stack maxW="4xl" gap="4">
                        <Heading>{approvedTopic?.title}</Heading>
                        <Text>{approvedTopic?.description}</Text>

                        {/* start project button if google doc url is not available */}
                        {(!project?.googleDocUrl || !me?.studentProfile?.googleAccessToken) &&
                            <Stack>
                                <Button
                                    onClick={handleStartProject}
                                    size="xl"
                                    colorPalette={"accent"}
                                    w={{ base: "full", md: "fit" }}
                                    loading={connectingGoogle || startingProject}
                                >
                                    {!me?.studentProfile?.googleAccessToken ? "Connect Google" : "Start Project"}
                                </Button>
                                <Span fontSize="xs" color="fg.subtle">
                                    {!me?.studentProfile?.googleAccessToken && "Google account required."}
                                </Span>
                            </Stack>}

                        {/* write project button if google doc url is available */}
                        {project?.googleDocUrl &&
                            <>
                                <Box w="fit">
                                    <LinkButton
                                        to={`?doc-url=${project?.googleDocUrl}&#project-editor`}
                                        replace={true}
                                        size="xl"
                                        w="fit"
                                        colorPalette={"accent"}>
                                        <LuPenLine /> Write Project
                                    </LinkButton>
                                </Box>
                                <Suspense fallback={<Skeleton h="8" w="24" />}>
                                    <ProjectPreviewDialog />
                                </Suspense>
                            </>
                        }
                    </Stack>
                )}

                <Stack>
                    <Heading>Offline Guide</Heading>
                    <Suspense fallback={<SkeletonText h="8" noOfLines={4} />}>
                        <OfflineGuide />
                    </Suspense>
                </Stack>
            </GridItem>

            <GridItem
                pos={{ base: "static", md: "fixed" }}
                w="96"
                right="0"
                h="full" bg={{ base: "none", md: "bg" }}
                borderLeft={{ base: "none", md: "xs" }}
                borderLeftColor={{ base: "none", md: "border.muted" }}
                pt="4" pl={{ md: "6" }}>
                <Stack gap="6" h="full">
                    <Heading size="sm">Supervisor Information</Heading>
                    {project?.supervisor ? (
                        <DataList.Root orientation="vertical" gap="4">
                            <DataList.Item>
                                <DataList.ItemLabel>Name</DataList.ItemLabel>
                                <DataList.ItemValue fontWeight="medium">
                                    {project.supervisor.title} {project.supervisor.firstName} {project.supervisor.surname} {project.supervisor.otherName}
                                </DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.ItemLabel>Email</DataList.ItemLabel>
                                <DataList.ItemValue>{project.supervisor.user.email}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.ItemLabel>Faculty</DataList.ItemLabel>
                                <DataList.ItemValue>{project?.supervisor?.faculty}</DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.ItemLabel>Department</DataList.ItemLabel>
                                <DataList.ItemValue>{project?.supervisor?.department}</DataList.ItemValue>
                            </DataList.Item>
                        </DataList.Root>
                    ) : (
                        <Text fontSize="sm" color="fg.muted">No supervisor assigned yet.</Text>
                    )}
                </Stack>
            </GridItem>
        </SimpleGrid>
    )
}

const ProjectTopicCard = ({ topic, index }: { topic: SuggestedTopic; index: number }) => {
    const statusColor = {
        PENDING: "orange",
        APPROVED: "green",
        REJECTED: "red"
    }[topic.status] || "gray";

    return (
        <Card.Root flexDir={"row"} width="full" variant="outline" borderColor="border.muted">
            <Flex
                bg="bg.muted"
                align="center"
                justify="center"
                fontSize="lg"
                w="20"
                fontWeight="bold"
            >
                #{index + 1}
            </Flex>
            <Card.Body>
                <Flex justify="space-between" align="flex-start" mb="4">

                    <Card.Title>{topic.title}</Card.Title>
                    <Badge colorPalette={statusColor}>
                        {toTitleCase(topic.status)}
                    </Badge>
                </Flex>

                <Text fontSize="sm" color="fg.muted">
                    {topic.description}
                </Text>

                <HStack mt="6" justify="space-between">
                    <Text fontSize="xs" color="fg.subtle">
                        Created on {moment(topic.createdAt).fromNow()}
                    </Text>
                    {topic.status === "PENDING" && <Suspense>
                        <EditTopicDialog topic={topic} />
                    </Suspense>}
                </HStack>
            </Card.Body>
        </Card.Root>
    )
}

export default Projects;