import { Button, Menu, Portal } from "@chakra-ui/react"
import { toaster } from "@components/ui/toaster";
import { useResultStore } from "@stores/data.store";
import { normalizeSemester } from "@utils/function.util";
import { snapdom } from "@zumer/snapdom";
import type { SelectionDetails } from "node_modules/@chakra-ui/react/dist/types/components/menu/namespace";
import { useCallback, useTransition } from "react";
import { LuDownload, LuEllipsis } from "react-icons/lu";


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
            case "ALL": {
                try {
                    setType("ALL");
                    startTransition(async () => {
                        const blob = await snapdom(document.getElementById("result-template") as HTMLDivElement);
                        await blob.toJpg({ scale: 2, quality: 1, cache: "disabled" });
                        await blob.download({ filename: `full-session-result.jpg`, type: "jpg", scale: 2 });
                    })
                } catch (error) {
                    toaster.error({ description: "Error downloading result" })
                    console.error("Error downloading result", error);
                }
            }
                break;
        }
    }, [setType]);

    return <>

        {/* mobile */}
        <Menu.Root onSelect={handleClick} closeOnSelect>
            <Menu.Trigger asChild>
                <Button hideFrom={"md"} loading={isPending} colorPalette={"gray"} variant="ghost" size="sm">
                    <LuEllipsis />
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            <Menu.ItemGroupLabel>Download Result</Menu.ItemGroupLabel>
                            <Menu.Item value="FIRST">1st Semester</Menu.Item>
                            <Menu.Item value="SECOND">2nd Semester</Menu.Item>
                            <Menu.Item value="ALL">All Semesters</Menu.Item>
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>


        {/* desktop */}
        <Menu.Root onSelect={handleClick} closeOnSelect>
            <Menu.Trigger asChild>
                <Button hideBelow={"md"} loading={isPending} colorPalette={"accent"} variant="ghost" size="sm">
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
    </>
}


export default ResultDownloader;
