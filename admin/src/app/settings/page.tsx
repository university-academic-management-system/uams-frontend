import { lazy, Suspense } from "react";
import { UserSquare, CreditCard, Settings2 } from "lucide-react";
import { Box, Tabs, Spinner, Center } from "@chakra-ui/react";

const IDCardSettingsTab = lazy(() => import("@components/settings/IDCardSettingsTab"));
const PaymentSettingsTab = lazy(() => import("@components/settings/PaymentSettingsTab"));
const SystemSettingsTab = lazy(() => import("@components/settings/SystemSettingsTab"));

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
                    <Suspense fallback={<Center p="10"><Spinner /></Center>}>
                        <IDCardSettingsTab />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content value="payment">
                    <Suspense fallback={<Center p="10"><Spinner /></Center>}>
                        <PaymentSettingsTab />
                    </Suspense>
                </Tabs.Content>
                <Tabs.Content value="system">
                    <Suspense fallback={<Center p="10"><Spinner /></Center>}>
                        <SystemSettingsTab />
                    </Suspense>
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    );
};

export default SettingsPage;
