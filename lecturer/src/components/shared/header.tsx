import { Badge, Flex, Group, Heading, Separator } from "@chakra-ui/react";
import { SidebarToggleButton } from "./sidebar";
import NotificationDrawer from "./notification-drawer";
import { sidebarStore } from "@stores/ui.store";
import { useLocation } from "react-router";
import { useCallback, useMemo } from "react";
import useAuthStore from "@stores/auth.store";
import AuditLogs from "./audit-log";

const Navbar = () => {
  const { isCollapsed } = sidebarStore();
  const path = useLocation().pathname;
  const links = useMemo(() => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Students", href: "/students" },
    { label: "Lecturers", href: "/lecturers" },
    { label: "Courses", href: "/courses" },
    { label: "Results", href: "/results" },
    { label: "Projects", href: "/projects" },
    { label: "Timetable", href: "/timetable" },
    { label: "Announcement", href: "/announcement" },
    { label: "Profile", href: "/profile" },
    { label: "Settings", href: "/settings" }
  ], []);

  const isActive = useCallback((href: string) => path.endsWith(href), [path]);
  const activeLink = links.find((link) => isActive(link.href));
  const { user } = useAuthStore();
  const userRole = user?.role || (user?.roles && user.roles[0]) || "Staff";

  return (
    <>
      <Flex
        bg="bg"
        p="6"
        pl="0"
        align="center"
        justify="space-between"
        h="16"
        w="full"
      >
        <Group>
          <SidebarToggleButton />
          {isCollapsed && <Heading>{activeLink?.label}</Heading>}
        </Group>

        <Flex align="center" gap="3">
          <AuditLogs />
          <NotificationDrawer />
          <Separator orientation="vertical" h="6" />
          <Badge ml="2">{userRole}</Badge>
        </Flex>
      </Flex>
    </>
  );
};

export default Navbar;