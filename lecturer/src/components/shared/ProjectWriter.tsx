import { Button, CloseButton, Dialog, Portal, useDisclosure } from "@chakra-ui/react"
import { useCallback } from "react";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { useLocation, useNavigate, useSearchParams } from "react-router";


const ProjectWriter = () => {
    const loc = useLocation();
    const [sp] = useSearchParams();
    const navigate = useNavigate();
    const { setOpen } = useDisclosure();

    // useEffect(() => {
    //     setOpen(loc.hash === "#project-editor");
    // }, [open, setOpen, loc]);

    const handleOpenInNewTab = useCallback(() => {
        window.open(sp.get("doc-url") || "", "_blank");
    }, [sp]);

    return (
        <Dialog.Root
            open={loc.hash === "#project-editor"}
            onOpenChange={(d) => {
                setOpen(d.open)
                if (!d.open) {
                    navigate(loc.pathname.replace(loc.hash, ""));
                }
            }}
            size="full"
            role="alertdialog"
            scrollBehavior={"inside"}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Project Editor</Dialog.Title>
                            <Button onClick={handleOpenInNewTab} rounded="full" size="xs" variant="outline">
                                Open in new tab <LuSquareArrowOutUpRight />
                            </Button>
                        </Dialog.Header>
                        <Dialog.Body asChild border="none">
                            <iframe
                                allow="autoplay; encrypted-media"
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
                                src={sp.get("doc-url") || ""}
                                width="100%"
                                height="100%" />
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    )
}

export default ProjectWriter;