import { ColorModeButton } from "@components/ui/color-mode";
import useUserStore from "@stores/user.store";
import { Container, Flex, Heading } from "@chakra-ui/react";

const DashboardPage = () => {
    const { name } = useUserStore();

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