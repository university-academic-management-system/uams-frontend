import React, { useState } from 'react';
import { Box, Flex, Text, Button, Stack, Input, Grid, GridItem, VStack, Icon } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRightLeft, Building, Hash, AlignJustify } from 'lucide-react';
import { initCourseRegistrationPayment } from '../services/registrationService';

const useQuery = () => new URLSearchParams(useLocation().search);

const PaymentMethodItem = ({ icon: IconComp, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <Flex 
    align="center" 
    p={4} 
    cursor="pointer" 
    bg={active ? 'white' : 'transparent'}
    borderLeftWidth={active ? '4px' : '0'}
    borderColor="green.500"
    color={active ? 'green.500' : 'gray.500'}
    _hover={{ bg: 'white', color: 'green.600' }}
    transition="all 0.2s"
  >
    <IconComp size={18} style={{ marginRight: '12px' }} />
    <Text fontSize="sm" fontWeight={active ? 'bold' : 'medium'}>{label}</Text>
  </Flex>
);

const PaymentsNew: React.FC = () => {
  const query = useQuery();
  const type = query.get('type') || 'other';
  const purpose = query.get('purpose') || '';
  const semesterId = query.get('semesterId') || '';
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const labelMap: Record<string, string> = {
    registration: 'ID Card',
    transcript: 'Transcript Processing',
    other: 'Other Payment',
  };

  const paymentPurpose = labelMap[type] ?? labelMap.other;
  const amount = 5000; // Could be dynamic based on type

  const handlePayment = async () => {
    // ID Card payments (no semesterId required)
    if (purpose === 'idcard') {
      setIsProcessing(true);
      setErrorMessage(null);
      
      // Mock payment success
      setTimeout(() => {
        // Store payment confirmation
        localStorage.setItem('idCardPaymentSuccess', 'true');
        localStorage.setItem('idCardPaymentDate', new Date().toISOString());
        
        setSuccessMessage('Payment Successful! Your ID Card payment has been confirmed.');
        setTimeout(() => {
          navigate('/registration/other');
        }, 2000);
      }, 1500);
      return;
    }
    
    // Course registration payments
    if (type === 'registration') {
      if (!semesterId) {
        setErrorMessage('Semester ID is required for registration payment');
        return;
      }
      
      setIsProcessing(true);
      setErrorMessage(null);
      
      const callbackUrl = `${window.location.origin}/payments`;
      const result = await initCourseRegistrationPayment(semesterId, amount, callbackUrl);
      
      if (result.success && result.authorizationUrl) {
        // Redirect to Paystack checkout
        window.location.href = result.authorizationUrl;
      } else {
        setErrorMessage(result.message);
        setIsProcessing(false);
      }
    } else {
      // Handle other payment types
      setIsProcessing(true);
      setErrorMessage(null);
      
      // Mock payment success
      setTimeout(() => {
        alert('✅ Payment Successful!');
        navigate('/payments');
      }, 1500);
    }
  };

  return (
    <Box p={{ base: 4, lg: 8 }}>
      {/* Success Notification */}
      {successMessage && (
        <Box 
          position="fixed" 
          top={4} 
          right={4} 
          bg="linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
          color="white"
          px={6}
          py={4}
          rounded="xl"
          shadow="lg"
          display="flex"
          alignItems="center"
          gap={3}
          zIndex={9999}
          animation="slideIn 0.3s ease-out"
        >
          <Box fontSize="xl">✓</Box>
          <Box>
            <Text fontSize="sm" fontWeight="bold">{successMessage}</Text>
          </Box>
        </Box>
      )}

      {/* Header not strictly needed if we assume it's inside the dashboard layout, but good to have a title */}
      <Box bg="white" rounded="2xl" p={{ base: 6, lg: 10 }} shadow="sm">
        <Heading fontSize="2xl" mb={8} fontWeight="bold" color="#1e293b">Make Payment</Heading>

        {/* Top Info Bar */}
        <Flex justify="space-between" align="flex-start" mb={10} wrap="wrap" gap={6}>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1} textTransform="uppercase" fontWeight="bold">Purpose</Text>
            <Text fontWeight="bold" fontSize="lg" color="#1e293b">{paymentPurpose}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1} textTransform="uppercase" fontWeight="bold">Transaction ID:</Text>
            <Text fontWeight="bold" fontSize="lg" color="#1e293b">06c1774d-46ad....90ae</Text>
          </Box>
          <Box textAlign="right">
            <Text fontSize="xs" color="gray.500" mb={1} textTransform="uppercase" fontWeight="bold">Amount:</Text>
            <Text fontWeight="bold" fontSize="3xl" color="#0052EA">NGN {amount.toLocaleString()}</Text>
          </Box>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "280px 1fr" }} gap={0} bg="#F8FAFC" rounded="xl" overflow="hidden" border="1px" borderColor="gray.100">
          {/* Left Sidebar */}
          <GridItem p={6} borderRight={{ base: 'none', md: '1px' }} borderBottom={{ base: '1px', md: 'none' }} borderColor="gray.100">
            <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={4} textTransform="uppercase" letterSpacing="wider">Pay With</Text>
            <VStack align="stretch" spacing={1}>
              <PaymentMethodItem icon={CreditCard} label="Card" active />
              <PaymentMethodItem icon={ArrowRightLeft} label="Transfer" />
              <PaymentMethodItem icon={Building} label="Bank" />
              <PaymentMethodItem icon={Hash} label="*# USSD" />
            </VStack>
          </GridItem>

          {/* Right Content */}
          <GridItem bg="white" p={{ base: 6, lg: 12 }}>
            <Flex justify="space-between" mb={10} align="center">
              <Icon as={AlignJustify} color="#0052EA" boxSize={8} />
              <Text fontSize="sm" color="green.500" fontWeight="bold">Pay NGN {amount.toLocaleString()}</Text>
            </Flex>

            <VStack spacing={8} maxW="500px" mx="auto">
              <Text fontWeight="bold" fontSize="lg" color="#334155">Enter your card details to pay</Text>
              
              <Box w="full">
                <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={2} textTransform="uppercase">Card Number</Text>
                <Input placeholder="0000 0000 0000 0000" size="lg" fontSize="md" bg="gray.50" border="none" _focus={{ bg: 'white', ring: 1, ringColor: 'blue.500' }} h="56px" />
              </Box>

              <Grid templateColumns="1fr 1fr" gap={6} w="full">
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={2} textTransform="uppercase">Card Expiry</Text>
                  <Input placeholder="MM / YY" size="lg" fontSize="md" bg="gray.50" border="none" _focus={{ bg: 'white', ring: 1, ringColor: 'blue.500' }} h="56px" />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={2} textTransform="uppercase">CVV</Text>
                  <Input placeholder="123" size="lg" fontSize="md" bg="gray.50" border="none" _focus={{ bg: 'white', ring: 1, ringColor: 'blue.500' }} h="56px" />
                </Box>
              </Grid>

              {errorMessage && (
                <Box w="full" p={3} bg="red.50" border="1px" borderColor="red.200" rounded="lg">
                  <Text fontSize="sm" color="red.600" fontWeight="medium">{errorMessage}</Text>
                </Box>
              )}

              <Button 
                w="full" 
                bg="#4ADE80" 
                _hover={{ bg: '#22c55e' }} 
                color="white" 
                size="lg" 
                h="56px" 
                fontSize="md" 
                fontWeight="bold" 
                rounded="lg" 
                mt={4} 
                onClick={handlePayment}
                isLoading={isProcessing}
                loadingText="Processing..."
              >
                Pay NGN {amount.toLocaleString()}
              </Button>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

// Helper component for Heading since it wasn't imported
const Heading = ({ children, ...props }: any) => <Text as="h1" {...props}>{children}</Text>;

export default PaymentsNew;
