import { Container, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Header from "./Header";

const Main = () => {
    return (
        <Stack bg="bg.subtle" w="full" flex="1" overflow={"hidden"}>
            <Header />
            <Container overflowY={"auto"}  w="full" maxW={"full"} p="6" flex={1}>
                <Outlet />
            </Container>
        </Stack>
    )
}

export default Main;