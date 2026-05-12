import { ColorModeButton } from "@components/ui/color-mode";
import useUserStore from "@stores/user.store";
import { Container, Flex, Heading, Text } from "@chakra-ui/react";

const DashboardPage = () => {
    const { name, email, password, setUser, clearUser } = useUserStore();

    return (
        <Container>
            <Flex justify={"end"}>
                <ColorModeButton />
            </Flex>
            <Heading>Hello {name} 👋</Heading>
           
            {/* <Text></Text> */}
        </Container>
    )
}

export default DashboardPage;