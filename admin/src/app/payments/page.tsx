import { useNavigate } from "react-router";
import { Box } from "@chakra-ui/react";
import PaymentsSummaryView from "@components/payments/PaymentsSummaryView";

const PaymentsPage = () => {
    const navigate = useNavigate();

    const handleViewDetails = (programTypeCode: string) => {
        navigate(`/payments/${programTypeCode}`);
    };

    return (
        <Box>
            <PaymentsSummaryView onViewDetails={handleViewDetails} />
        </Box>
    );
};

export default PaymentsPage;
