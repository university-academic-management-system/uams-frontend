import { Button, CloseButton, Drawer, IconButton, Portal } from "@chakra-ui/react"
import { Tooltip } from "@components/ui/tooltip";
import { LuActivity } from "react-icons/lu";


const AuditLogs = () => {
    return (
        <Drawer.Root role="alertdialog">
            <Tooltip content="Audit Logs">
                <Drawer.Trigger asChild>
                    <IconButton variant="ghost" size="md" color="fg.muted">
                        <LuActivity />
                    </IconButton>
                </Drawer.Trigger>
            </Tooltip>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Drawer Title</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button variant="outline">Cancel</Button>
                            <Button>Save</Button>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

export default AuditLogs;
