import { Flex, Tabs } from "@chakra-ui/react";
import type { Level } from "@type/index.type";
import { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router";


const SemesterTabContent = lazy(() => import("@components/courses/semester-tab-content"));
const ResultDownloader = lazy(() => import("@components/courses/result-downloader"));



const LevelTabContent = ({ level }: { level: "L100" | "L200" | "L300" | "L400" | "L500" }) => {
    const [sp, setSp] = useSearchParams();
    const [activeTab, setActiveTab] = useState(sp.get("semester") || "FIRST");

    useEffect(() => {
        setSp({ semester: activeTab || "FIRST", level: sp.get("level") || "L100" });
    }, [activeTab, setSp, sp]);

    return (
        <Tabs.Root variant="enclosed" defaultValue="FIRST" lazyMount value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
            <Flex justify="space-between" align="center">
                <Tabs.List pos="sticky" top="0" zIndex={"sticky"}>
                    <Tabs.Trigger value="FIRST">
                        1st Semester
                    </Tabs.Trigger>
                    <Tabs.Trigger value="SECOND">
                        2nd Semester
                    </Tabs.Trigger>
                </Tabs.List>
                <Suspense>
                    <ResultDownloader />
                </Suspense>
            </Flex>

            <Tabs.Content value="FIRST" w="full">
                <Suspense>
                    <SemesterTabContent level={level as Level} semester="FIRST" />
                </Suspense>
            </Tabs.Content>
            <Tabs.Content value="SECOND" w="full">
                <Suspense>
                    <SemesterTabContent level={level as Level} semester="SECOND" />
                </Suspense>
            </Tabs.Content>
        </Tabs.Root>
    )
}

export default LevelTabContent;
