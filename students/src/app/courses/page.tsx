import { Skeleton, Stack, Tabs, useBreakpointValue } from "@chakra-ui/react"
import { useMe } from "@hooks/auth.hook";
import { normalizeLevel } from "@utils/function.util";
import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router";

// lazy import
const LevelTabContent = lazy(() => import("@components/courses/level-tab-content"));

const Courses = () => {
    const { data: me, isLoading } = useMe();
    const [sp, setSp] = useSearchParams();
    const [activeTab, setActiveTab] = useState(sp.get("level") || "L100");

    useEffect(() => {
        setSp({ level: activeTab || "L100", semester: sp.get("semester") || "FIRST" });
    }, [activeTab, setSp, sp]);

    const orientation = useBreakpointValue<"horizontal" | "vertical">({
        base: "horizontal",
        md: "vertical",
    })
    // const is4yearsDegree = useMemo(() => me?.studentProfile?.degreeAwardedCode?.toLocaleLowerCase()?.replaceAll(".", "")?.trim() === "bsc", [me]);
    const currentLevel = useMemo(() => parseInt(normalizeLevel(me?.studentProfile?.level || "L100")), [me]);

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
        <Tabs.Root
            variant="line"
            value={activeTab}
            onValueChange={(e) => setActiveTab(e.value)}
            orientation={orientation}
            colorPalette={"accent"}
            lazyMount
            gap="12"
        >
            <Tabs.List w="fit" pos={{ base: "static", md: "fixed" }} left="" top="20" bg="bg.subtle" h="full" zIndex={"sticky"}>
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

            <Tabs.Content value="L100" w="full" ml={{ base: 0, md: 28 }}>
                <Suspense>
                    <LevelTabContent level="L100" />
                </Suspense>

            </Tabs.Content>
            <Tabs.Content value="L200" w="full" ml={{ base: 0, md: 28 }}>
                <Suspense>
                    <LevelTabContent level="L200" />
                </Suspense>
            </Tabs.Content>
            <Tabs.Content value="L300" w="full" ml={{ base: 0, md: 28 }}>
                <Suspense>
                    <LevelTabContent level="L300" />
                </Suspense>
            </Tabs.Content>
            <Tabs.Content value="L400" w="full" ml={{ base: 0, md: 28 }}>
                <Suspense>
                    <LevelTabContent level="L400" />
                </Suspense>
            </Tabs.Content>
        </Tabs.Root>
    )
}



export default Courses;


