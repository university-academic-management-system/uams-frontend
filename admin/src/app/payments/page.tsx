"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import PaymentsSummaryView from "@components/payments/PaymentsSummaryView";
import TransactionsList from "@components/payments/TransactionsList";

type ViewState = "summary" | "transactions";

const PaymentsPage = () => {
    const [currentView, setCurrentView] = useState<ViewState>("summary");
    const [selectedProgram, setSelectedProgram] = useState<{ id: string; name: string } | null>(null);

    const handleViewAllRevenue = (programTypeId: string, programTypeName: string) => {
        setSelectedProgram({ id: programTypeId, name: programTypeName });
        setCurrentView("transactions");
    };

    const handleBackToSummary = () => {
        setCurrentView("summary");
        setSelectedProgram(null);
    };

    return (
        <Box minH="100vh" bg="bg.canvas">
            {currentView === "summary" ? (
                <PaymentsSummaryView onViewAllRevenue={handleViewAllRevenue} />
            ) : (
                <TransactionsList 
                    onBack={handleBackToSummary} 
                    programTypeId={selectedProgram?.id} 
                    programTypeName={selectedProgram?.name}
                />
            )}
        </Box>
    );
};

export default PaymentsPage;
