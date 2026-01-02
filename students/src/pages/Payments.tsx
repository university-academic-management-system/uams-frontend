import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box, Flex, Text, Button, Input, IconButton, HStack, Image,
  Badge, Spacer,
  useBreakpointValue, Stack
} from '@chakra-ui/react';
import { Search, Filter, FileText, Plus, ChevronLeft, ChevronRight, X, BookOpen, CreditCard, CheckCircle2, XCircle, Clock, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Payment = {
  id: string;
  transactionId: string;
  from: string;
  paymentFor: string;
  amount: string;
  method: string;
  date: string;
  status: 'Succeeded' | 'Pending' | 'Decline';
};

const createSample = (n = 20) => Array.from({ length: n }).map((_, i) => {
  // Generate a UUID-like string
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  return {
    id: String(i + 1),
    transactionId: uuid,
    from: 'Grace Hopkins',
    paymentFor: i % 3 === 0 ? 'Course Registration' : (i % 3 === 1 ? 'School fees' : 'Departmental dues'),
    amount: i % 3 === 0 ? '₦230,000' : (i % 3 === 1 ? '₦340,000' : '₦45,000'),
    method: i % 4 === 0 ? 'Bank transfer' : (i % 3 === 0 ? 'Mastercard ****7845' : 'VISA ****7345'),
    date: `23-08-2025`,
    status: i % 5 === 0 ? 'Pending' : (i % 4 === 0 ? 'Decline' : 'Succeeded') as Payment['status'],
  };
});

const sampleData = createSample(37);

// Map payment method string -> asset image
const getMethodIcon = (method: string) => {
  if (/VISA/i.test(method)) return '/assets/dbe6fcea94b57473b3ac92ebfd373581c53ffdf8 (2).png';
  if (/Mastercard/i.test(method)) return '/assets/10b571fd0d881b731c970262e0cc1b5bfad7c107 (1).png';
  if (/Bank/i.test(method) || /transfer/i.test(method)) return '/assets/3b543946b234ab5b1742eccf85f0c75277b92ddd (1).png';
  return '/assets/3b543946b234ab5b1742eccf85f0c75277b92ddd (1).png';
};

function useLocalOutsideClick(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;
      const target = e.target as Node;
      if (el.contains(target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

function showToast({ title, status = 'info' }: { title: string; status?: 'info' | 'success' | 'warning' | 'error' }) {
  if (typeof document === 'undefined') { alert(title); return; }
  const el = document.createElement('div');
  el.textContent = title;
  el.setAttribute('role', 'status');
  Object.assign(el.style, {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    backgroundColor: status === 'success' ? '#16a34a' : status === 'warning' ? '#f59e0b' : status === 'error' ? '#ef4444' : '#111827',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '8px',
    zIndex: '9999',
    fontSize: '13px',
  } as React.CSSProperties);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
} 

const PaymentDetailModal: React.FC<{ isOpen: boolean; onClose: () => void; payment?: Payment | null }> = ({ isOpen, onClose, payment }) => {
  const toast = (opts: { title: string; status?: 'info' | 'success' | 'warning' | 'error' }) => showToast(opts);
  if (!payment || !isOpen) return null;
  return (
    <Box position="fixed" inset={0} zIndex={70} display="flex" alignItems="center" justifyContent="center">
      <Box position="absolute" inset={0} bg="blackAlpha.600" onClick={onClose} />
      <Box bg="white" p={6} rounded="12px" shadow="lg" zIndex={80} minW={{ base: '90%', md: '640px' }}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontWeight="bold">Payment details — {payment.transactionId}</Text>
          <IconButton aria-label="Close" icon={<X size={16} />} variant="ghost" onClick={onClose} />
        </Flex>

        <Stack spacing={3}>
          <Text><strong>From:</strong> {payment.from}</Text>
          <Text><strong>Payment for:</strong> {payment.paymentFor}</Text>
          <Text><strong>Amount:</strong> {payment.amount}</Text>
          <Text><strong>Method:</strong> <HStack display="inline-flex" spacing={2} align="center"><Image src={getMethodIcon(payment.method)} alt={payment.method} w="32px" h="auto" objectFit="contain" /><span>{payment.method}</span></HStack></Text>
          <Text><strong>Date:</strong> {payment.date}</Text>
          <Text><strong>Status:</strong> {payment.status}</Text>
        </Stack>

        <Flex mt={5} justify="flex-end" gap={3}>
          <Button variant="ghost" onClick={() => { navigator.clipboard?.writeText(payment.transactionId); toast({ title: 'Copied transaction id', status: 'success' }); }}>Copy ID</Button>
          <Button colorScheme="blue" onClick={() => { toast({ title: 'Receipt exported', status: 'success' }); }}>Export receipt</Button>
        </Flex>
      </Box>
    </Box>
  );
};

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
        position="relative"
      >
        <IconButton 
          aria-label="Close" 
          icon={<X size={20} />} 
          variant="ghost" 
          onClick={onClose} 
          position="absolute"
          top={4}
          right={4}
          size="sm"
        />
        
        <Flex justify="center" mb={8} mt={2}>
          <Text fontWeight="bold" color="#0052EA" fontSize="lg">Make New Payment</Text>
        </Flex>

        <Stack spacing={4}>
          <Button 
            variant="outline" 
            h="64px" 
            justifyContent="flex-start" 
            onClick={() => handleChoose('registration')}
            bg="#F0F4FF"
            borderColor="#E0E7FF"
            borderWidth="1px"
            _hover={{ bg: '#E0E7FF', borderColor: '#C7D2FE' }}
            color="gray.600"
            fontWeight="normal"
            rounded="8px"
            display="flex"
            alignItems="center"
          >
             <Box mx="auto" display="flex" alignItems="center" gap={3}>
                <BookOpen size={20} color="#64748B" />
                <Text fontSize="md">Pay for Course Registration</Text>
             </Box>
          </Button>

          <Button 
            variant="outline" 
            h="64px" 
            justifyContent="flex-start" 
            onClick={() => handleChoose('transcript')}
            bg="#F0F4FF"
            borderColor="#E0E7FF"
            borderWidth="1px"
            _hover={{ bg: '#E0E7FF', borderColor: '#C7D2FE' }}
            color="gray.600"
            fontWeight="normal"
            rounded="8px"
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
            bg="#F0F4FF"
            borderColor="#E0E7FF"
            borderWidth="1px"
            _hover={{ bg: '#E0E7FF', borderColor: '#C7D2FE' }}
            color="gray.600"
            fontWeight="normal"
            rounded="8px"
            display="flex"
            alignItems="center"
          >
             <Box mx="auto" display="flex" alignItems="center" gap={3}>
                <Box as="span" transform="rotate(-15deg)"><CreditCard size={20} color="#64748B" /></Box>
                <Text fontSize="md">Make Other Payments</Text>
             </Box>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Succeeded') {
    return (
      <Badge colorScheme="green" variant="subtle" borderRadius="full" px={3} py={1} display="flex" alignItems="center" width="fit-content" textTransform="none" fontSize="12px" fontWeight="600">
        <Box as="span" mr={1.5}><CheckCircle2 size={14} fill="#22c55e" color="white" /></Box> Succeeded
      </Badge>
    );
  }
  if (status === 'Pending') {
    return (
      <Badge colorScheme="yellow" variant="subtle" borderRadius="full" px={3} py={1} display="flex" alignItems="center" width="fit-content" textTransform="none" fontSize="12px" fontWeight="600">
        <Box as="span" mr={1.5}><Clock size={14} fill="#eab308" color="white" /></Box> Pending
      </Badge>
    );
  }
  if (status === 'Decline') {
    return (
      <Badge colorScheme="red" variant="subtle" borderRadius="full" px={3} py={1} display="flex" alignItems="center" width="fit-content" textTransform="none" fontSize="12px" fontWeight="600">
        <Box as="span" mr={1.5}><XCircle size={14} fill="#ef4444" color="white" /></Box> Decline
      </Badge>
    );
  }
  return <Badge>{status}</Badge>;
};

const Payments: React.FC = () => {
  const toast = (opts: { title: string; status?: 'info' | 'success' | 'warning' | 'error' }) => showToast(opts);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  useLocalOutsideClick(filterRef as React.RefObject<HTMLElement>, () => setShowFilters(false));

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [makeModalOpen, setMakeModalOpen] = useState(false);

  const showTable = useBreakpointValue({ base: false, md: true });

  const filtered = useMemo(() => {
    return sampleData.filter(p => {
      const q = query.trim().toLowerCase();
      if (q) {
        const inText = p.from.toLowerCase().includes(q) || p.transactionId.toLowerCase().includes(q) || p.paymentFor.toLowerCase().includes(q);
        if (!inText) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (methodFilter !== 'all' && !p.method.includes(methodFilter)) return false;
      return true;
    });
  }, [query, statusFilter, methodFilter]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = Math.min((page - 1) * perPage + 1, total || 0);
  const end = Math.min(page * perPage, total);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSel: Record<string, boolean> = {};
      paged.forEach(p => newSel[p.id] = true);
      setSelected(newSel);
    } else {
      setSelected({});
    }
  };

  const downloadCSV = () => {
    if (filtered.length === 0) { toast({ title: 'No rows to export', status: 'warning' }); return; }
    const header = ['Transaction ID', 'From', 'Payment For', 'Amount', 'Method', 'Date', 'Status'];
    const rows = filtered.map(r => [r.transactionId, r.from, r.paymentFor, r.amount, r.method, r.date, r.status]);
    const csv = [header, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'payments.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box p={{ base: 4, lg: 8 }}>
      <Flex align="center" mb={6} gap={4}>
        <Text fontSize={{ base: 'lg', lg: 'xl' }} fontWeight="bold">Payments</Text>
        <Spacer />
        <Button bg="#0052EA" color="white" _hover={{ bg: '#0040C0' }} rounded="8px" px={4} py={2} h="40px" onClick={() => setMakeModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Make New Payment
        </Button>
      </Flex>

      <Box bg="white" p={{ base: 3, lg: 6 }} rounded="16px" border="1px" borderColor="gray.100">
        <Flex align="center" mb={6} wrap="wrap" gap={3}>
          <Text fontSize="lg" fontWeight="bold">Recent Payments</Text>
          <Spacer />
          
          <Input 
            placeholder="Search by name, email or code" 
            value={query} 
            onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
            bg="white" 
            size="md" 
            maxW={{ base: '100%', md: '300px' }} 
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ borderColor: '#0052EA', boxShadow: 'none' }}
          />

          <Button 
            variant="outline" 
            size="md" 
            onClick={downloadCSV}
            fontWeight="medium"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.200"
            color="gray.700"
            _hover={{ bg: 'gray.50' }}
            px={4}
          >
            <Download size={16} style={{ marginRight: '8px' }} /> Export
          </Button>

          <Box position="relative" ref={filterRef}>
            <Button 
              variant="outline" 
              size="md" 
              onClick={() => setShowFilters(s => !s)}
              fontWeight="medium"
              borderRadius="8px"
              border="1px solid"
              borderColor="gray.200"
              color="gray.700"
              _hover={{ bg: 'gray.50' }}
              px={4}
            >
              <Filter size={16} style={{ marginRight: '8px' }} /> Filter
            </Button>
            {showFilters && (
              <Box position="absolute" right={0} mt={2} w="220px" bg="white" border="1px" borderColor="gray.100" rounded="8px" shadow="lg" zIndex={60} p={2}>
                <Text fontWeight="bold" px={3} py={1} fontSize="sm">Status</Text>
                <Button variant="ghost" justifyContent="flex-start" w="full" size="sm" onClick={() => { setStatusFilter('all'); setPage(1); setShowFilters(false); }}>All</Button>
                <Button variant="ghost" justifyContent="flex-start" w="full" size="sm" onClick={() => { setStatusFilter('Succeeded'); setPage(1); setShowFilters(false); }}>Succeeded</Button>
                <Button variant="ghost" justifyContent="flex-start" w="full" size="sm" onClick={() => { setStatusFilter('Pending'); setPage(1); setShowFilters(false); }}>Pending</Button>
                <Button variant="ghost" justifyContent="flex-start" w="full" size="sm" onClick={() => { setStatusFilter('Decline'); setPage(1); setShowFilters(false); }}>Decline</Button>

                <Box my={2} borderTop="1px" borderColor="gray.50" />
                <Text fontWeight="bold" px={3} py={1} fontSize="sm">Method</Text>
                <Button variant="ghost" justifyContent="flex-start" w="full" size="sm" onClick={() => { setMethodFilter('all'); setPage(1); setShowFilters(false); }}>All</Button>
                <Button variant="ghost" justifyContent="flex-start" w="full" size="sm" onClick={() => { setMethodFilter('VISA'); setPage(1); setShowFilters(false); }}>VISA</Button>
                <Button variant="ghost" justifyContent="flex-start" w="full" size="sm" onClick={() => { setMethodFilter('Mastercard'); setPage(1); setShowFilters(false); }}>Mastercard</Button>
                <Button variant="ghost" justifyContent="flex-start" w="full" size="sm" onClick={() => { setMethodFilter('Bank transfer'); setPage(1); setShowFilters(false); }}>Bank transfer</Button>
              </Box>
            )}
          </Box>
        </Flex>

        {showTable ? (
          <Box overflowX="auto">
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead style={{ backgroundColor: '#F8FAFC' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderRadius: '8px 0 0 8px' }}>
                    <input type="checkbox" checked={paged.length > 0 && Object.keys(selected).length === paged.length} onChange={(e) => toggleSelectAll((e.target as HTMLInputElement).checked)} style={{ width: 16, height: 16 }} />
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Transaction Id</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Payment from</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Payment for</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Payment method</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderRadius: '0 8px 8px 0', color: '#64748B', fontSize: '13px', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(p => (
                  <tr key={p.id} onClick={() => { setActivePayment(p); setModalOpen(true); }} style={{ cursor: 'pointer', backgroundColor: 'white' }} role="button" tabIndex={0}>
                    <td style={{ padding: '16px', borderBottom: '1px solid #F1F5F9' }}>
                      <input type="checkbox" checked={!!selected[p.id]} onClick={(e) => e.stopPropagation()} onChange={(e) => setSelected(s => ({ ...s, [p.id]: (e.target as HTMLInputElement).checked }))} style={{ width: 16, height: 16 }} />
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                      {p.transactionId.substring(0, 8)}...{p.transactionId.substring(p.transactionId.length - 4)}
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{p.from}</td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{p.paymentFor}</td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#334155', fontWeight: 500, borderBottom: '1px solid #F1F5F9' }}>{p.amount}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #F1F5F9' }}>
                      <HStack spacing={2} align="center">
                        <Image src={getMethodIcon(p.method)} alt={p.method} w="36px" h="auto" objectFit="contain" />
                        <Text fontSize="13px" color="#334155">{p.method.replace('Mastercard', '').replace('VISA', '').trim() || p.method}</Text>
                      </HStack>
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{p.date}</td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #F1F5F9' }}>
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        ) : (
          <Stack spacing={3}>
            {paged.map(p => (
              <Box key={p.id} p={4} rounded="12px" border="1px" borderColor="gray.100" _hover={{ bg: 'gray.50' }} onClick={() => { setActivePayment(p); setModalOpen(true); }} style={{ cursor: 'pointer' }}>
                <Flex align="center">
                  <input type="checkbox" checked={!!selected[p.id]} onClick={(e) => e.stopPropagation()} onChange={(e) => setSelected(s => ({ ...s, [p.id]: (e.target as HTMLInputElement).checked }))} style={{ marginRight: 12, width: 16, height: 16 }} />
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="bold" mb={1}>{p.paymentFor}</Text>
                    <Text fontSize="xs" color="gray.500" fontFamily="monospace">{p.transactionId.substring(0, 8)}...</Text>
                  </Box>
                  <Box textAlign="right">
                    <Text fontWeight="bold" mb={1}>{p.amount}</Text>
                    <StatusBadge status={p.status} />
                  </Box>
                </Flex>
                <Flex mt={3} justify="space-between" align="center">
                   <HStack spacing={2} align="center">
                      <Image src={getMethodIcon(p.method)} alt={p.method} w="32px" h="auto" objectFit="contain" />
                      <Text fontSize="xs" color="gray.600">{p.method}</Text>
                   </HStack>
                   <Text fontSize="xs" color="gray.400">{p.date}</Text>
                </Flex>
              </Box>
            ))}
          </Stack>
        )}

        {total === 0 && (
          <Flex align="center" justify="center" p={8} color="gray.500">No payments found</Flex>
        )}

        <Flex align="center" justify="space-between" mt={6}>
          <Text fontSize="sm" color="gray.600">Showing {total === 0 ? 0 : start} - {end} of {total}</Text>

          <HStack spacing={2}>
            <IconButton aria-label="Prev" size="sm" variant="outline" icon={<ChevronLeft size={16} />} onClick={() => setPage(p => Math.max(1, p - 1))} isDisabled={page === 1} />
            <IconButton aria-label="Next" size="sm" variant="outline" icon={<ChevronRight size={16} />} onClick={() => setPage(p => Math.min(pages, p + 1))} isDisabled={page === pages} />
            <select style={{ fontSize: 13, padding: '6px 8px', maxWidth: '100px', borderRadius: 4, borderColor: '#E2E8F0' }} value={perPage} onChange={(e) => { setPerPage(Number((e.target as HTMLSelectElement).value)); setPage(1); }}>
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </HStack>
        </Flex>
      </Box>

      <PaymentDetailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} payment={activePayment} />
      <MakePaymentModal isOpen={makeModalOpen} onClose={() => setMakeModalOpen(false)} />
    </Box>
  );
};

export default Payments;
