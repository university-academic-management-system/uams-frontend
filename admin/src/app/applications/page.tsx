import { Tabs } from "@chakra-ui/react";

const Applications = () => {
    return <Tabs.Root variant="enclosed">
        <Tabs.List w="fit">
            <Tabs.Trigger value="applications">ID Card Applications</Tabs.Trigger>
            <Tabs.Trigger value="transcript">Transcript Applications</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="applications">
        </Tabs.Content>
        <Tabs.Content value="transcript">
        </Tabs.Content>
    </Tabs.Root>
};

export default Applications;
