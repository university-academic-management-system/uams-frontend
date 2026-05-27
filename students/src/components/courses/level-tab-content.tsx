import { Tabs } from "@chakra-ui/react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router";


const SemesterTabContent = lazy(() => import("@components/courses/semester-tab-content"));

const LevelTabContent = ({ level }: { level: "L100" | "L200" | "L300" | "L400" | "L500" }) => {
    const [sp, setSp] = useSearchParams();
    const [activeTab, setActiveTab] = useState(sp.get("semester") || "FIRST");

    useEffect(() => {
        setSp({ semester: activeTab || "FIRST", level: sp.get("level") || "L100" });
    }, [activeTab, setSp, sp]);

    return (
        <Tabs.Root variant="enclosed" defaultValue="FIRST" lazyMount value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
            <Tabs.List pos="sticky" top="0" zIndex={"sticky"}>
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

export default LevelTabContent;
