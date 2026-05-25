
import { Badge, ButtonGroup, Flex, Group, Heading } from "@chakra-ui/react";
import { SidebarToggleButton } from "./Sidebar";
import NotificationDrawer from "./Notification-drawer";
import { sidebarStore } from "@stores/ui.store";
import { useLocation } from "react-router";
import { useCallback, useMemo } from "react";

import useAuthStore from "@stores/auth.store";
import AuditLogs from "./audit-log";

const Navbar = () => {
  const { isCollapsed } = sidebarStore();
    const path = useLocation().pathname;
    const links = useMemo(() => [
        {
            label: "Dashboard",
            href: "/dashboard",
        },
        {
            label: "Students",
            href: "/students",
        },
        {
            label: "Lecturers",
            href: "/lecturers",
        },
        {
            label: "Courses",
            href: "/courses",
        },
        {
            label: "Results",
            href: "/results",
        },
        {
            label: "Projects",
            href: "/projects",
        },
        {
            label: "Timetable",
            href: "/timetable",
        },
        {
            label: "Announcement",
            href: "/announcement",
        },
        {
            label: "Profile",
            href: "/profile",
        },
        {
            label: "Settings",
            href: "/settings",
        }
    ], []);

    const isActive = useCallback((href: string) => {
        return path.endsWith(href);
    }, [path]);

    const activeLink = links.find((link) => isActive(link.href));

  const { user } = useAuthStore();

  // Get the primary role (prefer user?.role, else first role from roles array)
  const userRole = user?.role || (user?.roles && user.roles[0]) || "Staff";

  return (  <>
                 <Flex
                  bg="bg"
                  p="6"
                  pl="0"
                  align={"center"}
                  justify={"space-between"}
                  h="16"
                  w="full"
              >
                  <Group>
                      <SidebarToggleButton />
                      {isCollapsed && <Heading>{activeLink?.label}</Heading>}
                  </Group>
      
      
                  <ButtonGroup gap="2">
                    <AuditLogs />
                      <NotificationDrawer />
                  </ButtonGroup>

      {/* Role Badge */}
      <Badge
        colorPalette="blue"
        fontSize="lg"
        px="3"
        py="1"
        borderRadius="full"
        textTransform="capitalize"
      >
        {userRole}
      </Badge>
    </Flex>
    </>
  );
};

export default Navbar;