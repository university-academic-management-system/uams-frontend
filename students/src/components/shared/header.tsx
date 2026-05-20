import { ButtonGroup, Flex } from "@chakra-ui/react";
import { SidebarToggleButton } from "./sidebar";
import NotificationDrawer from "./notification-drawer";
import AuditLogs from "./audit-log";

const Header = () => {
    return <>
        <Flex
            bg="bg"
            p="6"
            pl="0"
            align={"center"}
            justify={"space-between"}
            h="16"
            w="full"
        >
            <SidebarToggleButton />


            <ButtonGroup gap="2">
                <NotificationDrawer />.
                <AuditLogs />
            </ButtonGroup>
        </Flex>
    </>
}



export default Header;