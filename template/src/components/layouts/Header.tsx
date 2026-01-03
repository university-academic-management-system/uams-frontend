import { Flex, Icon, Input, InputGroup, Separator } from "@chakra-ui/react";
import { LuBell, LuSearch, LuUser } from "react-icons/lu";

const Header = () => {
    return (
        <Flex bg="bg" boxSizing={"border-box"} h="49px" px="4" align={"center"} justify={"space-between"} borderBottom={"sm"} borderBottomColor={"border"}>
            <InputGroup startElement={<Icon as={LuSearch} />}>
                <Input size="xs" w="60" placeholder="Search" />
            </InputGroup>

            <Flex gap="4">
                <Icon as={LuBell} color="fg.muted" />
                <Separator orientation={"vertical"} />
                <Icon as={LuUser} color="fg.muted" />
            </Flex>
        </Flex>
    )
}

export default Header;