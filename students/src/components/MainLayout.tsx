import React, { useState, useEffect } from 'react';
import { 
  Box, Flex, Text, Image, Button, Input, 
  IconButton, HStack 
} from '@chakra-ui/react';
import { 
  Search,
  Bell,
  History,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';
import authService from '../services/authService';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { NavigationItem } from '../types';

const Logo = ({ collapsed }: { collapsed?: boolean }) => (
  <Flex align="center" justify={collapsed ? "center" : "start"} w={collapsed ? "full" : "auto"}>
    <Image 
      src="/assets/logos.png" 
      alt="UniEdu Logo" 
      h={{ base: '10', lg: '12' }}
      w={collapsed ? '10' : 'auto'}
      objectFit="contain"
      maxW="full"
      onError={(e: any) => {
        e.target.style.display = 'none';
      }}
    />
  </Flex>
);

const SidebarItem = ({ 
  iconSrc, 
  label, 
  active, 
  onClick,
  collapsed = false,
}: { 
  iconSrc: string, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  collapsed?: boolean,
}) => {
  const content = (
    <Button
      onClick={onClick}
      variant="ghost"
      w="full"
      display="flex"
      alignItems="center"
      justifyContent={collapsed ? 'center' : 'flex-start'}
      gap={collapsed ? 0 : 4}
      px={collapsed ? 2 : 5}
      py={collapsed ? 3 : 6}
      rounded="2xl"
      bg={active ? '#e8eff7' : 'transparent'}
      color="#1e293b"
      fontWeight={active ? 'bold' : 'normal'}
      _hover={{ bg: active ? '#e8eff7' : 'gray.50' }}
      role="group"
      transition="all 0.2s"
      title={collapsed ? label : undefined}
    >
      <Image 
        src={iconSrc} 
        alt={label} 
        boxSize={collapsed ? '20px' : '22px'} 
        objectFit="contain" 
      />
      <Box as="span" ml={collapsed ? 0 : 3} style={{ transition: 'opacity 0.18s, width 0.18s', opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', overflow: 'hidden', display: 'inline-block' }}>
        <Text fontSize="15px" display="inline">{label}</Text>
      </Box>
    </Button>
  );

  return (
    <Box px={collapsed ? 1 : 4} py={1.5}>
      {content}
    </Box>
  );
};

const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sidebarCollapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', isSidebarCollapsed ? 'true' : 'false');
    } catch {}
  }, [isSidebarCollapsed]);

  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (pathname: string): NavigationItem => {
    if (pathname.startsWith('/courses')) return 'courses';
    if (pathname.startsWith('/registration')) return 'registration';
    if (pathname.startsWith('/payments')) return 'payments';
    if (pathname.startsWith('/schedule')) return 'schedule';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getTabFromPath(location.pathname);

  // Logout handler
  const handleLogout = () => {
    authService.logout();
  };
  
  // Build user object from local storage (matches LoginUser type)
  const user = authService.getStoredUser();
  const userName = user?.fullName || 'Student';
  const userEmail = user?.email || 'student@uniedu.com';

  return (
    <Flex h="100vh" bg="#fcfdfe" overflow="hidden">
      {/* Sidebar Overlay - Mobile */}
      {isMobileMenuOpen && (
        <Box 
          pos="fixed" inset={0} bg="blackAlpha.500" zIndex={40} 
          display={{ base: 'block', lg: 'none' }}
          backdropFilter="blur(4px)"
          transition="opacity 0.2s"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <Box
        as="aside"
        pos={{ base: 'fixed', lg: 'relative' }}
        insetY={0} left={0} w={{ base: isSidebarCollapsed ? '20' : '72' }} minW={{ base: isSidebarCollapsed ? '20' : '72' }} bg="white" borderRight="1px" borderColor="gray.100"
        display="flex" flexDirection="column" zIndex={50}
        transform={{ base: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)', lg: 'none' }}
        transition="transform 0.3s, width 200ms ease"
        overflow="hidden"
      >
        <Flex 
          p={{ base: 6, lg: isSidebarCollapsed ? 4 : 8 }} 
          mb={4} 
          align="center" 
          justify={isSidebarCollapsed ? 'center' : 'space-between'} 
          direction={isSidebarCollapsed ? 'column' : 'row'}
          gap={isSidebarCollapsed ? 4 : 0}
        >
          <Logo collapsed={isSidebarCollapsed} />
          
          <IconButton
            aria-label="Toggle sidebar"
            display={{ base: 'none', lg: 'flex' }}
            variant="ghost"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            color="gray.400"
            _hover={{ bg: 'gray.100' }}
          >
            <Menu size={20} />
          </IconButton>

          <IconButton 
            aria-label="Close menu"
            display={{ base: 'flex', lg: 'none' }}
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(false)}
            rounded="full"
            color="gray.400"
            _hover={{ bg: 'gray.100' }}
          >
            <X size={24} />
          </IconButton>
        </Flex>

        <Box flex={1} overflowY="auto" css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '2px' },
        }}>
          <SidebarItem iconSrc="/assets/House (1).png" label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} collapsed={isSidebarCollapsed} />
          <SidebarItem iconSrc="/assets/BookOpen (1).png" label="Courses" active={activeTab === 'courses'} onClick={() => { navigate('/courses/results'); setIsMobileMenuOpen(false); }} collapsed={isSidebarCollapsed} />
          <SidebarItem iconSrc="/assets/Books (1).png" label="Registration" active={activeTab === 'registration'} onClick={() => { navigate('/registration'); setIsMobileMenuOpen(false); }} collapsed={isSidebarCollapsed} />
          <SidebarItem iconSrc="/assets/CalendarDots (1).png" label="Schedule" active={activeTab === 'schedule'} onClick={() => { navigate('/schedule'); setIsMobileMenuOpen(false); }} collapsed={isSidebarCollapsed} />
          <SidebarItem iconSrc="/assets/Money (1).png" label="Payments" active={activeTab === 'payments'} onClick={() => { navigate('/payments'); setIsMobileMenuOpen(false); }} collapsed={isSidebarCollapsed} />
          <SidebarItem iconSrc="/assets/305ae6c7f315bb219eb3b785a763838d55d71e73 (1).png" label="Settings" active={activeTab === 'settings'} onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} collapsed={isSidebarCollapsed} />
        </Box>

        <Box p={isSidebarCollapsed ? 4 : 6} borderTop="1px" borderColor="gray.100">
          <Button 
            size="sm" 
            variant="ghost" 
            w="full" 
            onClick={handleLogout}
            display="flex"
            alignItems="center"
            justifyContent={isSidebarCollapsed ? 'center' : 'flex-start'}
            gap={3}
            px={isSidebarCollapsed ? 2 : 4}
            py={5}
            rounded="xl"
            color="gray.500"
            fontWeight="medium"
            _hover={{ bg: 'red.50', color: 'red.500' }}
            transition="all 0.2s"
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <Text fontSize="14px">Logout</Text>}
          </Button>
          {!isSidebarCollapsed && (
            <Text mt={4} fontSize="10px" color="gray.400" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" textAlign="center">
              Version 1.0.4
            </Text>
          )}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Flex flex={1} direction="column" minW={0} overflow="hidden">
        {/* Header */}
        <Flex 
          h={{ base: 20, lg: 24 }} bg="white" borderBottom="1px" borderColor="gray.50" 
          align="center" justify="space-between" px={{ base: 4, lg: 8 }} shrink={0}
        >
          <Flex align="center" gap={{ base: 2, lg: 4 }} flex={1}>
            <IconButton 
              aria-label="Open menu"
              hideFrom="lg"
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(true)}
              color="gray.500"
              rounded="lg"
            >
              <Menu size={24} />
            </IconButton>

            <Box position="relative" maxW={{ base: '160px', sm: 'xs', lg: 'md' }} w="full">
              <Input 
                placeholder="Search" 
                bg="white" 
                border="1px solid"
                borderColor="gray.300" 
                rounded="full" 
                py={{ base: 2, lg: 2.5 }}
                pl={4}
                pr={10}
                fontSize={{ base: 'xs', lg: 'sm' }}
                color="#1e293b"
                _focus={{ borderColor: 'blue.400', boxShadow: 'none' }}
                _placeholder={{ color: 'gray.400' }}
              />
              <Box position="absolute" right={4} top="50%" transform="translateY(-50%)" color="gray.400" pointerEvents="none">
                <Search size={16} />
              </Box>
            </Box>
          </Flex>

          <Flex align="center" gap={{ base: 4, lg: 6 }} ml={4} shrink={0}>
            <HStack spacing={3} display="flex">
              <Box as="button" p={2} color="gray.400" _hover={{ color: 'gray.600' }} transition="colors 0.2s">
                <Bell size={20} />
              </Box>
              <Box as="button" p={2} color="gray.400" _hover={{ color: 'gray.600' }} transition="colors 0.2s">
                <History size={20} />
              </Box>
            </HStack>
            
            <Flex align="center" gap={{ base: 2, lg: 3 }}>
              <Flex w={{ base: 9, lg: 10 }} h={{ base: 9, lg: 10 }} rounded="full" bg="#0891b2" align="center" justify="center" color="white" shadow="sm" overflow="hidden" shrink={0}>
                <User size={20} />
              </Flex>
              <Flex direction="column" display={{ base: 'none', sm: 'flex' }}>
                <Text fontSize={{ base: '12px', lg: '13px' }} fontWeight="bold" color="#1e293b" lineHeight="tight" noOfLines={1} maxW={{ base: '80px', lg: 'none' }}>{userName}</Text>
                <Text fontSize="10px" color="gray.400" fontWeight="medium" lineHeight="tight" noOfLines={1}>{userEmail}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {/* Scrollable Content Container */}
        <Box flex={1} overflowY="auto" bg="#f8f9fb" css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '2px' },
        }}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;
