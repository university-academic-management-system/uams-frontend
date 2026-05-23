import { Button, CloseButton, Drawer, IconButton, Portal } from "@chakra-ui/react"
import { Tooltip } from "@components/ui/tooltip";
import { LuBell } from "react-icons/lu";


const NotificationDrawer = () => {
    return (
        <Drawer.Root modal={false}>
            <Tooltip content="Notifications">
                <Drawer.Trigger asChild>
                    <IconButton variant="ghost" size="md" color="fg.muted">
                        <LuBell />
                    </IconButton>
                </Drawer.Trigger>
            </Tooltip>
            <Portal>
                <Drawer.Positioner pt="14" pr="16" pb="4">
                    <Drawer.Content rounded="md" >
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

export default NotificationDrawer;
