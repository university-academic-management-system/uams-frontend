import { Alert, Badge, Box, Card, CheckboxCard, CheckboxGroup, CloseButton, DataList, Flex, GridItem, Heading, Separator, SimpleGrid, Skeleton, Stack, Tabs, Text } from "@chakra-ui/react"
import { useMe } from "@hooks/auth.hook";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ActionBar, Button, Checkbox, Portal, Table } from "@chakra-ui/react"
import { useCourses, useRegisterCourses } from "@hooks/course.hook";
import { EmptyStateView } from "@components/shared/empty-state";
import { Chart, useChart } from "@chakra-ui/charts"
import { Label, Pie, PieChart, Sector, Tooltip } from "recharts"
import { normalizeLevel, normalizeSemester } from "@utils/function.util";
import { LuX } from "react-icons/lu";
import { Tooltip as CTooltip } from "@components/ui/tooltip";
import { useDashboardStats } from "@hooks/dashboard.hook";
import { toaster } from "@components/ui/toaster";
import type { CoursesResponse } from "@type/course.type";
import { useSearchParams } from "react-router";



const CoursesTabContent = () => {
    const { data: me, isLoading } = useMe();
    const [sp, setSp] = useSearchParams();
    const [activeTab, setActiveTab] = useState(sp.get("level") || "L100");
    // const is4yearsDegree = useMemo(() => me?.studentProfile?.degreeAwardedCode?.toLocaleLowerCase()?.replaceAll(".", "")?.trim() === "bsc", [me]);
    const currentLevel = useMemo(() => parseInt(me?.studentProfile?.level?.replaceAll("L", "") || "0"), [me]);

    useEffect(() => {
        setSp({ tab: sp.get("tab") || "courses", level: activeTab || "L100", semester: sp.get("semester") || "FIRST" });
    }, [activeTab, setSp, sp]);

    if (isLoading) {
        return (
            <Stack gap="4">
                <Skeleton h="8" />
                <Skeleton h="10" />
                <Skeleton h="80" />
            </Stack>
        )
    }


    return (
        <Tabs.Root defaultValue="L100" value={activeTab} onValueChange={(e) => setActiveTab(e.value)} lazyMount variant={"enclosed"}>
            <Tabs.List >
                <Tabs.Trigger value="L100">
                    100 Level
                </Tabs.Trigger>
                <Tabs.Trigger disabled={currentLevel < 200} value="L200">
                    200 Level
                </Tabs.Trigger>
                <Tabs.Trigger disabled={currentLevel < 300} value="L300">
                    300 Level
                </Tabs.Trigger>
                <Tabs.Trigger disabled={currentLevel < 400} value="L400">
                    400 Level
                </Tabs.Trigger>

            </Tabs.List>
            <Tabs.Content value="L100">
                <Suspense>
                    <LevelTabContent level="L100" />
                </Suspense>

            </Tabs.Content>
            <Tabs.Content value="L200">
                <Suspense>
                    <LevelTabContent level="L200" />
                </Suspense>
            </Tabs.Content>
            <Tabs.Content value="L300">
                <Suspense>
                    <LevelTabContent level="L300" />
                </Suspense>
            </Tabs.Content>
            <Tabs.Content value="L400">
                <Suspense>
                    <LevelTabContent level="L400" />
                </Suspense>
            </Tabs.Content>
        </Tabs.Root>
    )
}


const LevelTabContent = ({ level }: { level: "L100" | "L200" | "L300" | "L400" | "L500" }) => {
    const [sp, setSp] = useSearchParams();
    const [activeTab, setActiveTab] = useState(sp.get("semester") || "FIRST");

    useEffect(() => {
        setSp({ tab: sp.get("tab") || "courses", semester: activeTab || "FIRST", level: sp.get("level") || "L100" });
    }, [activeTab, setSp, sp]);

    return (
        <Tabs.Root defaultValue="FIRST" lazyMount value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
            <Tabs.List pos="sticky" top="0" zIndex={"sticky"} bg="bg.subtle">
                <Tabs.Trigger value="FIRST">
                    1st Semester
                </Tabs.Trigger>
                <Tabs.Trigger value="SECOND">
                    2nd Semester
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="FIRST" w="full">
                <Suspense>
                    <SemesterTabContent level={level} semester="FIRST" />
                </Suspense>
            </Tabs.Content>
            <Tabs.Content value="SECOND" w="full">
                <Suspense>
                    <SemesterTabContent level={level} semester="SECOND" />
                </Suspense>
            </Tabs.Content>
        </Tabs.Root>
    )
}


const SemesterTabContent = ({ level, semester }: { level: "L100" | "L200" | "L300" | "L400" | "L500"; semester: "FIRST" | "SECOND" }) => {
    const [selection, setSelection] = useState<{ id: string; units: number }[]>([])
    const { data: response, isLoading, refetch } = useCourses({ level, semester });
    const { data: settings, isLoading: settingsLoading } = useDashboardStats();
    const items = useMemo(() => response?.courses || [], [response])

    const { mutate: registerCourses, isPending: isRegistering } = useRegisterCourses({
        onSuccess: () => {
            toaster.create({
                title: "Success",
                description: "Courses registered successfully",
                type: "success"
            })
            setSelection([])
            refetch()
        }
    })

    const carryOverUnits = useMemo(() => response?.carryOverCourses?.reduce((acc, item) => acc + item.units, 0) || 0, [response])
    const registeredUnits = response?.registeredCreditUnit || 0
    const maxUnits = response?.maxCreditUnit || 24

    const selectionUnits = useMemo(() => selection.reduce((acc, item) => acc + item.units, 0), [selection])
    const totalUnits = registeredUnits + carryOverUnits + selectionUnits

    const hasSelection = selection.length > 0
    const selectableItems = useMemo(() => items.filter(item => !item.isRegistered), [items])
    const indeterminate = hasSelection && selection.length < selectableItems.length

    const handleRegister = () => {
        const courseIds = [
            ...selection.map((s) => s.id),
            ...(response?.carryOverCourses?.map((c) => c.id) || [])
        ]

        if (courseIds.length === 0) {
            toaster.create({
                title: "No courses selected",
                description: "Please select at least one course to register.",
                type: "warning"
            })
            return
        }

        registerCourses({ courses: courseIds })
    }

    const rows = useMemo(() => items.map((item) => (
        <Table.Row
            key={item.id}
            data-selected={selection.some((id) => id.id === item.id) ? "" : undefined}
            bg="bg"
            borderBottomColor="border.muted"
        >
            <Table.Cell borderBottomColor="border.muted">
                <Checkbox.Root
                    disabled={settings?.currentSemester != semester || item.isRegistered}
                    size="sm"
                    top="0.5"
                    aria-label="Select row"
                    checked={selection.some((id) => id.id === item.id)}
                    onCheckedChange={(changes) => {
                        if (changes.checked) {
                            if (totalUnits + item.units > maxUnits) {
                                toaster.create({
                                    title: "Credit limit exceeded",
                                    description: `You cannot exceed the maximum of ${maxUnits} units for this semester.`,
                                    type: "error"
                                })
                                return
                            }
                            setSelection((prev) => [...prev, { id: item.id, units: item.units }])
                        } else {
                            setSelection((prev) => prev.filter((id) => id.id !== item.id))
                        }
                    }}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                </Checkbox.Root>
            </Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.code}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.title}</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">{item.units} Units</Table.Cell>
            <Table.Cell borderBottomColor="border.muted">
                <Badge colorPalette="gray">
                    {item.courseType}
                </Badge>
            </Table.Cell>
            <Table.Cell borderBottomColor="border.muted">
                <Badge colorPalette={item.isRegistered ? "green" : "yellow"}>
                    {item.isRegistered ? "Registered" : "Not Registered"}
                </Badge>
            </Table.Cell>
        </Table.Row>
    )), [items, selection, settings, semester, totalUnits, maxUnits]);


    if (isLoading || settingsLoading) {
        return (
            <Table.Root>
                <Table.Body>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Table.Row key={i}>
                            <Table.Cell><Skeleton h="4" w="4" /></Table.Cell>
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                            <Table.Cell><Skeleton h="4" w="full" /></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        )
    }

    if (items.length === 0) {
        return (
            <EmptyStateView
                title="No courses found"
                description={`No courses available for ${normalizeLevel(level)} Level - ${normalizeSemester(semester)} semester.`}
            />
        )
    }

    return <SimpleGrid columns={{ base: 1, md: 4 }} gap="4">

        {/* table */}
        <GridItem colSpan={{ base: 1, md: 3 }}>
            <Box rounded={"md"} overflow={"hidden"} border="xs" borderColor="border.muted">
                <Table.ScrollArea maxW={{ base: "xl", md: "full" }}>
                    <Table.Root variant="outline" stickyHeader size="lg" w="full">
                        <Table.Header>
                            <Table.Row bg="bg.muted">
                                <Table.ColumnHeader w="6" borderBottomColor="border.muted">
                                    <Checkbox.Root
                                        disabled={settings?.currentSemester != semester || selectableItems.length === 0}
                                        size="sm"
                                        top="0.5"
                                        aria-label="Select all rows"
                                        checked={indeterminate ? "indeterminate" : (selectableItems.length > 0 && selection.length === selectableItems.length)}
                                        onCheckedChange={(changes) => {
                                            if (changes.checked) {
                                                // Check if all selectable items together exceed the limit
                                                const totalSelectableUnits = selectableItems.reduce((acc, item) => acc + item.units, 0)
                                                if (registeredUnits + carryOverUnits + totalSelectableUnits > maxUnits) {
                                                    toaster.create({
                                                        title: "Credit limit exceeded",
                                                        description: `Selecting all courses would exceed the maximum of ${maxUnits} units. Please select manually.`,
                                                        type: "error"
                                                    })
                                                    return
                                                }
                                                setSelection(selectableItems.map((item) => ({ id: item.id, units: item.units })))
                                            } else {
                                                setSelection([])
                                            }
                                        }}
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.ColumnHeader>
                                <Table.ColumnHeader borderBottomColor="border.muted">Code</Table.ColumnHeader>
                                <Table.ColumnHeader borderBottomColor="border.muted">Title</Table.ColumnHeader>
                                <Table.ColumnHeader borderBottomColor="border.muted">Units</Table.ColumnHeader>
                                <Table.ColumnHeader borderBottomColor="border.muted">Type</Table.ColumnHeader>
                                <Table.ColumnHeader borderBottomColor="border.muted">Status</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>{rows}</Table.Body>
                    </Table.Root>
                </Table.ScrollArea>

                <ActionBar.Root open={hasSelection}>
                    <Portal>
                        <ActionBar.Positioner>
                            <ActionBar.Content>
                                <ActionBar.SelectionTrigger>
                                    {totalUnits} Units selected / {maxUnits}
                                </ActionBar.SelectionTrigger>
                                <ActionBar.Separator />
                                <Button
                                    loading={isRegistering}
                                    onClick={handleRegister}
                                    variant="solid"
                                    colorPalette="accent"
                                    size="xl"
                                >
                                    Register Selected
                                </Button>

                                <CTooltip content="Clear Selection">
                                    <CloseButton disabled={isRegistering} onClick={() => setSelection([])}>
                                        <LuX />
                                    </CloseButton>
                                </CTooltip>
                            </ActionBar.Content>
                        </ActionBar.Positioner>
                    </Portal>
                </ActionBar.Root>
            </Box>
        </GridItem>

        {/* chart */}
        <GridItem>
            <RegistrationStatusChart response={response} isLoading={isLoading} />
        </GridItem>
    </SimpleGrid>
}


// ... (skipping imports already there)

const RegistrationStatusChart = ({ response, isLoading }: { response?: CoursesResponse["data"]; isLoading: boolean }) => {
    const courses = response?.courses || []

    const registered = courses.filter((c) => c.isRegistered).length
    const total = courses.length
    const remaining = total - registered

    const carryOvers = useMemo(() => (response?.carryOverCourses || []).map((item) => ({
        value: item.id,
        label: item.title,
        level: item.level,
        semester: item.semester,
        units: item.units,
    })), [response]);

    const chart = useChart({
        data: [
            { name: "Registered", value: registered, color: "green.solid" },
            { name: "To be registered", value: remaining, color: "bg.muted" },
        ],
    })


    if (isLoading) {
        return (
            <Skeleton h="200px" w="200px" mx="auto" rounded="full" />
        )
    }

    if (total === 0 && carryOvers.length === 0) return null

    return (
        <Stack w="full" p="4" bg="bg" rounded="md" border="xs" borderColor="border.muted">
            <Chart.Root boxSize="200px" mx="auto" chart={chart}>
                <PieChart responsive>
                    <Tooltip
                        cursor={false}
                        animationDuration={100}
                        content={<Chart.Tooltip hideLabel />}
                    />
                    <Pie
                        innerRadius={70}
                        outerRadius={100}
                        isAnimationActive={false}
                        data={chart.data}
                        dataKey={chart.key("value")}
                        nameKey="name"
                        startAngle={180}
                        endAngle={0}
                        paddingAngle={2}
                        shape={(props) => (
                            <Sector {...props} fill={chart.color(props.payload!.color)} />
                        )}
                    >
                        <Label
                            content={({ viewBox }) => (
                                <Chart.RadialText
                                    viewBox={viewBox}
                                    title={`${registered}/${total}`}
                                    description="Courses Registered"
                                />
                            )}
                        />
                    </Pie>
                </PieChart>
            </Chart.Root>

            <Flex mt="-12">
                <DataList.Root orientation="horizontal">
                    <DataList.Item>
                        <DataList.ItemLabel>Registered units</DataList.ItemLabel>
                        <DataList.ItemValue>{response?.registeredCreditUnit}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Max units</DataList.ItemLabel>
                        <DataList.ItemValue>{response?.maxCreditUnit}</DataList.ItemValue>
                    </DataList.Item>
                </DataList.Root>
            </Flex>

            <Separator borderColor={"border.muted"} />

            <Stack>
                <Heading size="md">Carryover courses</Heading>
                <Alert.Root status="info" size="sm">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>Note</Alert.Title>
                        <Alert.Description>
                            Carryover courses are automatically registered when you register for a new semester.
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>

                <CheckboxGroup disabled defaultValue={carryOvers.map((item) => item.value)}>
                    <Stack gap="2">
                        {carryOvers?.length > 0 ? (
                            carryOvers?.map((item) => (
                                <CheckboxCard.Root checked size="sm" key={item.value} value={item.value}>
                                    <CheckboxCard.HiddenInput />
                                    <CheckboxCard.Control justifyContent={"start"}>
                                        <CheckboxCard.Indicator />
                                        <CheckboxCard.Content>
                                            <CheckboxCard.Label mt="-1">{item.label}</CheckboxCard.Label>
                                            <CheckboxCard.Description>
                                                <Text>{item.units} units</Text>
                                                <Text>
                                                    {`${normalizeLevel(item.level)} Level - ${normalizeSemester(item.semester)}`}
                                                </Text>
                                            </CheckboxCard.Description>
                                        </CheckboxCard.Content>
                                    </CheckboxCard.Control>
                                </CheckboxCard.Root>
                            ))) : (
                            <Card.Root rounded="md" borderColor={"border.muted"}>
                                <EmptyStateView title="No carryover courses" description="You have no active carryover courses." />
                            </Card.Root>
                        )}
                    </Stack>
                </CheckboxGroup>
            </Stack>
        </Stack>
    )
}




export default CoursesTabContent;
