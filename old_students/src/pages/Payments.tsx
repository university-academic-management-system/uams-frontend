import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box, Flex, Text, Button, Input, IconButton, HStack, Image,
  Badge, Spacer,
  useBreakpointValue, Stack
} from '@chakra-ui/react';
import { Search, Plus, ChevronLeft, ChevronRight, ChevronDown, X, CreditCard, IdCard, FileText, Loader2, Download } from 'lucide-react';
import { useNavigate } from 'react-router';
import apiClient from '../services/api';
import { paymentService } from '../services/paymentService';
import { toaster } from '../components/ui/toaster';

type ApiPayment = {
  id: string;
  transactionId: string;
  reference: string;
  payerName: string;
  studentName: string;
  paymentFor: string;
  paymentType: string;
  amount: string;
  currency: string;
  date: string;
  status: string;
  statusBadge: string;
};

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₦${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const formatDate = (isoDate: string) => {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const truncateId = (id: string) => {
  if (id.length <= 16) return id;
  return `${id.substring(0, 8)}....${id.substring(id.length - 4)}`;
};

const capitalizeStatus = (status: string) => {
  if (!status) return status;
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status.toLowerCase();
  const styles: Record<string, { bg: string; color: string }> = {
    success: { bg: '#dcfce7', color: '#16a34a' },
    pending: { bg: '#fef9c3', color: '#ca8a04' },
    decline: { bg: '#fee2e2', color: '#dc2626' },
    failed: { bg: '#fee2e2', color: '#dc2626' },
  };
  const s = styles[normalized] || { bg: '#f1f5f9', color: '#64748b' };

  return (
    <Badge
      px={3} py={1}
      bg={s.bg}
      color={s.color}
      rounded="full"
      fontSize="11px"
      fontWeight="bold"
      textTransform="capitalize"
    >
      {capitalizeStatus(status)}
    </Badge>
  );
};

// Make Payment Modal
const MakePaymentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleChoose = (type: string) => {
    navigate(`/payments/new?type=${encodeURIComponent(type)}`);
    onClose();
  };

  return (
    <Box position="fixed" inset={0} zIndex={70} display="flex" alignItems="center" justifyContent="center">
      <Box position="absolute" inset={0} bg="blackAlpha.700" onClick={onClose} />
      <Box
        bg="white"
        p={8}
        shadow="2xl"
        zIndex={80}
        w={{ base: '90%', md: '500px' }}
        maxW="95vw"
        rounded="xl"
        position="relative"
      >
        <IconButton
          aria-label="Close"
          variant="ghost"
          onClick={onClose}
          position="absolute"
          top={4}
          right={4}
          size="sm"
        >
          <X size={20} />
        </IconButton>

        <Flex justify="center" mb={8} mt={2}>
          <Text fontWeight="bold" color="#16a34a" fontSize="lg">Make New Payment</Text>
        </Flex>

        <Stack gap={4}>
          <Button
            variant="outline"
            h="64px"
            justifyContent="flex-start"
            onClick={() => handleChoose('registration')}
            bg="#F0FFF4"
            borderColor="#C6F6D5"
            borderWidth="1px"
            _hover={{ bg: '#C6F6D5', borderColor: '#9AE6B4' }}
            color="gray.600"
            fontWeight="normal"
            rounded="lg"
            display="flex"
            alignItems="center"
          >
            <Box mx="auto" display="flex" alignItems="center" gap={3}>
              <IdCard size={20} color="#64748B" />
              <Text fontSize="md">Pay for ID Card</Text>
            </Box>
          </Button>

          <Button
            variant="outline"
            h="64px"
            justifyContent="flex-start"
            onClick={() => handleChoose('transcript')}
            bg="#F0FFF4"
            borderColor="#C6F6D5"
            borderWidth="1px"
            _hover={{ bg: '#C6F6D5', borderColor: '#9AE6B4' }}
            color="gray.600"
            fontWeight="normal"
            rounded="lg"
            display="flex"
            alignItems="center"
          >
            <Box mx="auto" display="flex" alignItems="center" gap={3}>
              <FileText size={20} color="#64748B" />
              <Text fontSize="md">Pay for Transcript</Text>
            </Box>
          </Button>

          <Button
            variant="outline"
            h="64px"
            justifyContent="flex-start"
            onClick={() => handleChoose('other')}
            bg="#F0FFF4"
            borderColor="#C6F6D5"
            borderWidth="1px"
            _hover={{ bg: '#C6F6D5', borderColor: '#9AE6B4' }}
            color="gray.600"
            fontWeight="normal"
            rounded="lg"
            display="flex"
            alignItems="center"
          >
            <Box mx="auto" display="flex" alignItems="center" gap={3}>
              <CreditCard size={20} color="#64748B" />
              <Text fontSize="md">Make Other Payments</Text>
            </Box>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [makeModalOpen, setMakeModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get('/student/payments')
      .then((res) => {
        const data = res.data?.data?.payments ?? res.data?.payments ?? [];
        setPayments(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Failed to fetch payments:', err))
      .finally(() => setLoading(false));
  }, []);

  const hasDateFilter = dateFrom || dateTo;

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const q = query.trim().toLowerCase();
      if (q) {
        const inText =
          p.payerName.toLowerCase().includes(q) ||
          p.transactionId.toLowerCase().includes(q) ||
          p.paymentFor.toLowerCase().includes(q);
        if (!inText) return false;
      }
      if (statusFilter !== 'all' && p.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      return true;
    });
  }, [payments, query, statusFilter]);

  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
  };

  const handleDownload = async (paymentId: string) => {
    setDownloadingId(paymentId);
    try {
      await paymentService.downloadReceipt(paymentId);
      toaster.create({
        title: 'Success',
        description: 'Receipt downloaded successfully',
        type: 'success',
        closable:true
      });
    } catch (err) {
      toaster.create({
        title: 'Error',
        description: 'Failed to download receipt',
        type: 'error',
        closable:true
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const selectStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '6px 28px 6px 12px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#334155',
    appearance: 'none' as const,
    cursor: 'pointer',
    height: '36px',
  };

  return (
    <Box p={{ base: 4, lg: 8 }} maxW="1600px" mx="auto">
      {/* Header */}
      <Flex align="center" mb={6}>
        <Text fontSize={{ base: 'lg', lg: '2xl' }} fontWeight="bold" color="slate.800">
          Payment History{' '}
          <Text as="span" fontWeight="medium" color="gray.400">({filtered.length})</Text>
        </Text>
        <Spacer />
        {/* <Button
          bg="#16a34a"
          color="white"
          _hover={{ bg: '#15803d' }}
          rounded="xl"
          px={6}
          py={5}
          h="auto"
          fontSize="13px"
          fontWeight="bold"
          shadow="md"
          onClick={() => setMakeModalOpen(true)}
        >
          <Plus size={16} style={{ marginRight: '8px' }} />
          Make New Payment
        </Button> */}
      </Flex>

      {/* Filters Row */}
      <Flex
        align="center"
        mb={6}
        gap={3}
        flexWrap="wrap"
        bg="white"
        rounded="xl"
        px={{ base: 3, lg: 5 }}
        py={3}
        border="1px"
        borderColor="gray.100"
        shadow="sm"
      >
        {/* Search */}
        <Box position="relative" flex={{ base: '1 1 100%', md: '0 1 auto' }} maxW={{ md: '280px' }}>
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.300" zIndex={1}>
            <Search size={16} />
          </Box>
          <Input
            placeholder="Search by Transaction Id"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            pl={9}
            pr={4}
            py={2}
            fontSize="12px"
            fontWeight="medium"
            color="slate.800"
            _placeholder={{ color: 'gray.300' }}
            _focus={{ outline: 'none', borderColor: 'blue.300' }}
            h="36px"
          />
        </Box>

        <Spacer display={{ base: 'none', md: 'block' }} />

        {/* Status Filter */}
        <Box position="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="all" style={{ background: 'white' }}>Status</option>
            <option value="Success" style={{ background: 'white' }}>Success</option>
            <option value="Pending" style={{ background: 'white' }}>Pending</option>
            <option value="Decline" style={{ background: 'white' }}>Decline</option>
          </select>
          <Box position="absolute" right={2} top="50%" transform="translateY(-50%)" pointerEvents="none" color="gray.400">
            <ChevronDown size={14} />
          </Box>
        </Box>

        {/* Session Filter */}
        <Box position="relative">
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="all" style={{ background: 'white' }}>Session</option>
            <option value="2024/2025" style={{ background: 'white' }}>2024/2025</option>
            <option value="2025/2026" style={{ background: 'white' }}>2025/2026</option>
          </select>
          <Box position="absolute" right={2} top="50%" transform="translateY(-50%)" pointerEvents="none" color="gray.400">
            <ChevronDown size={14} />
          </Box>
        </Box>

        {/* Date Range */}
        <HStack gap={2}>
          <Text fontSize="11px" fontWeight="bold" color="gray.400">From</Text>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            fontSize="11px"
            fontWeight="bold"
            color="slate.700"
            h="36px"
            w="130px"
          />
          <Text fontSize="11px" fontWeight="bold" color="gray.400">To</Text>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            fontSize="11px"
            fontWeight="bold"
            color="slate.700"
            h="36px"
            w="130px"
          />
          {hasDateFilter && (
            <Box cursor="pointer" color="gray.400" _hover={{ color: 'gray.600' }} onClick={clearDateFilter}>
              <X size={16} />
            </Box>
          )}
        </HStack>
      </Flex>

      {/* Table */}
      <Box
        bg="white"
        rounded={{ base: '20px', lg: '24px' }}
        border="1px"
        borderColor="gray.100"
        shadow="sm"
        overflowX="auto"
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC' }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>S/N</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Transaction Id</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Payment from</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Payment for</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '16px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <Flex justify="center" align="center" gap={3}>
                    <Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
                    <Text fontSize="sm" color="gray.400" fontWeight="medium">Loading payments...</Text>
                  </Flex>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                  No payments found
                </td>
              </tr>
            ) : (
              filtered.map((p, idx) => (
                <tr
                  key={p.transactionId}
                  style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{idx + 1}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155', fontWeight: 500 }}>{truncateId(p.transactionId)}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155', fontWeight: 500 }}>{p.payerName}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155', fontWeight: 500 }}>{p.paymentFor}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>{formatCurrency(p.amount)}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{formatDate(p.date)}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <StatusBadge status={p.status} />
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <IconButton
                      aria-label="Download Receipt"
                      variant="ghost"
                      size="sm"
                      colorScheme="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(p.transactionId);
                      }}
                      disabled={downloadingId === p.transactionId}
                      loading={downloadingId === p.transactionId}
                    >
                      {downloadingId === p.transactionId ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                    </IconButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>

      <MakePaymentModal isOpen={makeModalOpen} onClose={() => setMakeModalOpen(false)} />
    </Box>
  );
};

export default Payments;
