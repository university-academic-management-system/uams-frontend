import { CloseButton, Drawer, Icon, IconButton, Image, Portal, Separator, Stack } from "@chakra-ui/react"
import { Tooltip } from "@components/ui/tooltip";
import { LuMenu } from "react-icons/lu";
import { useLocation } from "react-router";
import { useCallback, useMemo } from "react";
import LinkButton from "./buttons/LinkButton";
import { LogoutButton, UserPersona } from "./Sidebar";
import { navigationLinks, type NavigationLink } from "@constants/navigation";

const MobileSideDrawer = () => {
    const path = useLocation().pathname;
    const links = useMemo(() => navigationLinks, []);

    const isActive = useCallback((href: string) => {
        return path.endsWith(href);
    }, [path]);

    return (
        <Drawer.Root  modal={false} closeOnInteractOutside={true}>
            <Tooltip content="Menu">
                <Drawer.Trigger asChild hideFrom={"md"}>
                    <IconButton variant="ghost" size="md" color="fg.muted">
                        <LuMenu />
                    </IconButton>
                </Drawer.Trigger>
            </Tooltip>
            <Portal>
                <Drawer.Positioner pt="14" pr="4" pb="4">
                    <Drawer.Content rounded="md">
                        <Drawer.Header>
                            <Image src="/admin/assets/uphcscLG.png" alt="UPHCSC Logo" h="10" w="auto" />
                        </Drawer.Header>
                        <Drawer.Body>
                            <Stack align={"stretch"} gap="2" w="full" pt="0">
                                {links.map((link: NavigationLink) => <Drawer.ActionTrigger key={link.href}>
                                    <LinkButton
                                        to={link.href}
                                        w="full"
                                        variant="ghost"
                                        size="xl"
                                        pl="2"
                                        justifyContent={"start"}
                                        color={isActive(link.href) ? "accent" : "fg.muted"}
                                        fontWeight={"600"}
                                    >
                                        <Icon as={link.icon} size="md" color={isActive(link.href) ? "accent" : "fg.muted"} />
                                        {link.label}
                                    </LinkButton>
                                </Drawer.ActionTrigger>
                                )}
                            </Stack>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Stack flex="1" justify={"end"}>
                                <LogoutButton />
                                <Separator borderColor="border.muted" />
                                <UserPersona />
                            </Stack>
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

export default MobileSideDrawer;
