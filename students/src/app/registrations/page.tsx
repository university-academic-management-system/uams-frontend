import { Tabs, useBreakpointValue } from "@chakra-ui/react"
import { lazy, Suspense, useEffect, useState } from "react"
import { useSearchParams } from "react-router";


// lazy loads
const CoursesTabContent = lazy(() => import("@components/registrations/courses-tab-content"));
const TranscriptsTabsContent = lazy(() => import("@components/registrations/transcripts-tab-content"));
const IDCardTabContent = lazy(() => import("@components/registrations/idcard-tab-content"));



const Registrations = () => {
    const [sp, setSp] = useSearchParams();
    const [activeTab, setActiveTab] = useState(sp.get("tab") || "courses");

    useEffect(() => {
        setSp({ tab: activeTab || "courses", level: sp.get("level") || "L100", semester: sp.get("semester") || "FIRST" });
    }, [activeTab, setSp, sp]);

    const orientation = useBreakpointValue<"horizontal" | "vertical">({
        base: "horizontal",
        md: "vertical",
    })

    return (
        <Tabs.Root
            variant="line"
            value={activeTab}
            onValueChange={(e) => setActiveTab(e.value)}
            orientation={orientation}
            colorPalette={"accent"}
            lazyMount
            gap="12"
        >
            <Tabs.List pos={{ base: "static", md: "fixed" }} left="" top="20" bg="bg.subtle" h="full" zIndex={"sticky"}>
                <Tabs.Trigger value="courses" >
                    Courses
                </Tabs.Trigger>
                <Tabs.Trigger value="transcripts" >
                    Transcripts
                </Tabs.Trigger>
                <Tabs.Trigger value="id-cards" >
                    ID Card
                </Tabs.Trigger>
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
                <Suspense>
                    <IDCardTabContent />
                </Suspense>
            </Tabs.Content>
        </Tabs.Root>
    )
}


export default Registrations;


