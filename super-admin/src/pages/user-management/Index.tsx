import { Box, Heading, Spinner } from "@chakra-ui/react"
import { lazy, Suspense } from "react";
// import Stats from "./_components/Stats";
const Stats = lazy(() => import("./_components/Stats"));

const Dashboard = () => {
    return (
        <Box>
            <Suspense fallback={<Spinner />}>
                <Stats />
            </Suspense>
            <Heading>User Management</Heading>
        </Box>
    )
}
export default Dashboard;