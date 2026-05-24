import { Bell, History, Menu } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Box, Flex, Button } from '@chakra-ui/react';

interface HeaderProps {
    onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();

    return (
        <Flex
            as="header"
            h="16"
            bg="white"
            borderBottom="xs"
            borderColor="border.muted"
            alignItems="center"
            justifyContent="space-between"
            px={{ base: "4", md: "8" }}
            position="sticky"
            top="0"
            zIndex="40"
            gap="4"
        >
            <Flex alignItems="center" gap="4" flex="1">
                <Box
                    as="button"
                    onClick={onMenuClick}
                    display={{ base: "block", lg: "none" }}
                    p="2"
                    borderRadius="md"
                    _hover={{ bg: "fg.subtle" }}
                >
                    <Menu size={24} color="#64748b" />
                </Box>
                <Box maxW="lg" w="full" />
            </Flex>

            <Flex alignItems="center" gap="6">
                <Flex
                    alignItems="center"
                    gap="4"
                    color="fg.muted"
                >
                    <Button
                        onClick={() => navigate('/audit-logs')}
                        position="relative"
                        _hover={{ color: "blue.600" }}
                        transition="all 0.2s"
                        p="2"
                        borderRadius="lg"
                        background="transparent"
                        color="gray.600"
                        title="Audit Log"
                    >
                        <History size={20} />
                    </Button>
                    <Button
                        onClick={() => navigate('/notifications')}
                        position="relative"
                        _hover={{ color: "blue.600" }}
                        transition="all 0.2s"
                        p="2"
                        borderRadius="lg"
                        background="transparent"
                        color="gray.600"
                    >
                        <Bell size={20} />
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Header;
