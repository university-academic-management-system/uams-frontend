import { Flex } from "@chakra-ui/react"
import Sidebar from "./Sidebar";
import Main from "./Main";
import SubSidebar from "./SubSidebar";
import { useEffect, useState } from "react";


const RootLayout = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        (() => {
            setIsMounted(true)
        })()
    }, [])

    // Don't render anything until we're on the client side
    if (!isMounted) {
        return null
    }
    return (
        <Flex h="vh">
            <Sidebar />
            <SubSidebar />
            <Main />
        </Flex>
    )
}

export default RootLayout;