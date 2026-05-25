import { Tabs, useBreakpointValue } from "@chakra-ui/react"
import { lazy, Suspense } from "react"


// lazy loads
const CoursesTabContent = lazy(() => import("@components/registrations/courses-tab-content"));
const TranscriptsTabsContent = lazy(() => import("@components/registrations/transcripts-tabs-content"));



const Registrations = () => {
    const orientation = useBreakpointValue<"horizontal" | "vertical">({
        base: "horizontal",
        md: "vertical",
    })

    return (
        <Tabs.Root
            variant="line"
            defaultValue="courses"
            orientation={orientation}
            colorPalette={"accent"}
            lazyMount
            gap="12"
        >
            <Tabs.List pos={{ base: "static", md: "fixed" }} left="" top="20" bg="bg.subtle" h="full" zIndex={"sticky"}>
                <Tabs.Trigger value="courses">Courses</Tabs.Trigger>
                <Tabs.Trigger value="transcripts">Transcripts</Tabs.Trigger>
                <Tabs.Trigger value="id-cards">ID Card</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="courses" w="full" ml={{ base: 0, md: 28 }}>
                <Suspense>
                    <CoursesTabContent />
                </Suspense>
            </Tabs.Content>

            <Tabs.Content value="transcripts" w="full" ml={{ base: 0, md: 28 }}>
                <Suspense>
                    <TranscriptsTabsContent />
                </Suspense>
            </Tabs.Content>

            <Tabs.Content value="id-cards" w="full" ml={{ base: 0, md: 28 }}>
                Manage your ID cards here.
            </Tabs.Content>
        </Tabs.Root>
    )
}


export default Registrations;


