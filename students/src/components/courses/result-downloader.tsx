import { Button, Menu, Portal } from "@chakra-ui/react"
import { toaster } from "@components/ui/toaster";
import { useResultStore } from "@stores/data.store";
import { normalizeSemester } from "@utils/function.util";
import { snapdom } from "@zumer/snapdom";
import type { SelectionDetails } from "node_modules/@chakra-ui/react/dist/types/components/menu/namespace";
import { useCallback, useTransition } from "react";
import { LuDownload } from "react-icons/lu";


const ResultDownloader = () => {
    const { setType } = useResultStore();
    const [isPending, startTransition] = useTransition();

    const handleClick = useCallback((details: SelectionDetails) => {
        switch (details.value) {
            case "FIRST": {
                // download receipt
                try {
                    setType("FIRST");
                    startTransition(async () => {
                        const blob = await snapdom(document.getElementById("result-template") as HTMLDivElement);
                        await blob.toJpg({ scale: 2, quality: 1, cache: "disabled" });
                        await blob.download({ filename: `${normalizeSemester(details.value)}-result.jpg`, type: "jpg", scale: 2 });
                    })
                } catch (error) {
                    toaster.error({ description: "Error downloading result" })
                    console.error("Error downloading result", error);
                }
            }
                break;
            case "SECOND": {
                // download receipt
                try {
                    setType("SECOND");
                    startTransition(async () => {
                        const blob = await snapdom(document.getElementById("result-template") as HTMLDivElement);
                        await blob.toJpg({ scale: 4, quality: 1, cache: "disabled" });
                        await blob.download({ filename: `${normalizeSemester(details.value)}-result.jpg`, type: "jpg", scale: 4 });
                    })
                } catch (error) {
                    toaster.error({ description: "Error downloading result" })
                    console.error("Error downloading result", error);
                }
            }
                break;
            case "ALL":
                break;
        }
    }, [setType]);

    return (
        <Menu.Root onSelect={handleClick} closeOnSelect>
            <Menu.Trigger asChild>
                <Button loading={isPending} colorPalette={"accent"} variant="ghost" size="sm">
                    <LuDownload />  Download Result
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="FIRST">1st Semester</Menu.Item>
                        <Menu.Item value="SECOND">2nd Semester</Menu.Item>
                        <Menu.Item value="ALL">All Semesters</Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}


export default ResultDownloader;
