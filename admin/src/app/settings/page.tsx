import { UserSquare, CreditCard, Settings2 } from "lucide-react";
import { Box, Tabs } from "@chakra-ui/react";
import IDCardSettingsTab from "@components/settings/IDCardSettingsTab";
import PaymentSettingsTab from "@components/settings/PaymentSettingsTab";
import SystemSettingsTab from "@components/settings/SystemSettingsTab";

const SettingsPage = () => {
    return (
        <Box maxW="1400px" mx="auto">
            <Tabs.Root defaultValue="id-card" variant="enclosed">
                <Tabs.List mb="8">
                    <Tabs.Trigger value="id-card">
                        <UserSquare size={16} /> ID Card
                    </Tabs.Trigger>
                    <Tabs.Trigger value="payment">
                        <CreditCard size={16} /> Payment
                    </Tabs.Trigger>
                    <Tabs.Trigger value="system">
                        <Settings2 size={16} /> System
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="id-card">
                    <IDCardSettingsTab />
                </Tabs.Content>
                <Tabs.Content value="payment">
                    <PaymentSettingsTab />
                </Tabs.Content>
                <Tabs.Content value="system">
                    <SystemSettingsTab />
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    );
};

export default SettingsPage;
