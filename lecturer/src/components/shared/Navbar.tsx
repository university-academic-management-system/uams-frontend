import { Flex, Icon, Separator, Badge } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import useAuthStore from "@stores/auth.store";

const Navbar = () => {
  const { user } = useAuthStore();

  // Get the primary role (prefer user?.role, else first role from roles array)
  const userRole = user?.role || (user?.roles && user.roles[0]) || "Staff";

  return (
    <Flex
      as="header"
      align="center"
      justify="flex-end"
      gap="4"
      px="6"
      py="3"
      bg="white"
      borderBottom="1px solid"
      borderColor="border.muted"
    >
      {/* Notification Bell */}
      <Icon as={Bell} boxSize="5" color="fg.muted" cursor="pointer" />

      {/* Divider */}
      <Separator orientation="vertical" height="6" />

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
  );
};

export default Navbar;