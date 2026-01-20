import {
  Box,
  Flex,
  // Heading,
  Text,
  IconButton,
  VStack,
  Button,
  Icon,
  Image,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, School, Settings, ArrowRight } from "lucide-react";

const MotionBox = motion.create(Box);

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginOptions = [
  {
    id: "student",
    label: "Continue as Student",
    icon: GraduationCap,
    url: "/students/login",
    color: "blue",
    description: "Access your dashboard, grades, and course materials",
  },
  {
    id: "lecturer",
    label: "Continue as Lecturer",
    icon: BookOpen,
    url: "/lecturer/login",
    color: "teal",
    description: "Manage your classes, students, and curriculum",
  },
  {
    id: "dept_admin",
    label: "Continue as Dept. Admin",
    icon: School,
    url: "/departmental-admin/login",
    color: "purple",
    description: "Manage departmental resources and scheduling",
  },
  {
    id: "university_admin",
    label: "Continue as University Admin",
    icon: Settings,
    url: "/university-admin/login",
    color: "orange",
    description: "Oversee university-wide management, operations, users, and system settings",
  },
];

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleNavigation = (url: string) => {
    // Navigate to the specific login page
    window.location.href = url;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <MotionBox
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.6)"
            backdropFilter="blur(8px)"
            zIndex={2000}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <MotionBox
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={2001}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal */}
            <MotionBox
              w={{ base: "95%", sm: "500px" }}
              maxH="90vh"
              overflowY="auto"
              bg="white"
              borderRadius="3xl"
              boxShadow="0 30px 80px rgba(0, 0, 0, 0.3)"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Box p={8} position="relative">
                {/* Close Button */}
                <IconButton
                  position="absolute"
                  top={4}
                  right={4}
                  variant="ghost"
                  aria-label="Close modal"
                  onClick={onClose}
                  borderRadius="full"
                  size="sm"
                  _hover={{ bg: "gray.100" }}
                >
                  <Text fontSize="xl">×</Text>
                </IconButton>

                {/* Header */}
                <VStack gap={2} mb={8} align="center">
                  <Image
                    src="/logo1.png"
                    alt="University Logo"
                    // w={20}
                    h={14}
                    mb={2}
                  />
                  {/* <Heading
                    textAlign="center"
                    fontSize="2xl"
                    fontWeight="800"
                    color="#1e293b"
                  >
                    Welcome to UAMS
                  </Heading> */}
                  <Text textAlign="center" color="gray.500" fontSize="md">
                    Please select your role to continue
                  </Text>
                </VStack>

                {/* Role Selection Buttons */}
                <VStack gap={4} w="full">
                  {loginOptions.map((option) => (
                    <Button
                      key={option.id}
                      w="full"
                      h="auto"
                      p={4}
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                      bg="white"
                      border="2px solid"
                      borderColor="gray.100"
                      borderRadius="2xl"
                      _hover={{
                        borderColor: "#1a365d",
                        bg: "rgba(26, 54, 93, 0.02)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                      }}
                      transition="all 0.2s"
                      onClick={() => handleNavigation(option.url)}
                      className="group"
                    >
                      <Flex
                        w={12}
                        h={12}
                        borderRadius="xl"
                        bg={`${option.color}.50`}
                        color={`${option.color}.600`}
                        align="center"
                        justify="center"
                        fontSize="xl"
                        mr={4}
                        transition="all 0.2s"
                        _groupHover={{
                          bg: "#1a365d",
                          color: "white",
                        }}
                      >
                        <Icon as={option.icon} />
                      </Flex>
                      <Box textAlign="left" flex={1}>
                        <Text
                          fontSize="md"
                          fontWeight="700"
                          color="gray.800"
                          mb={0.5}
                          _groupHover={{ color: "#1a365d" }}
                        >
                          {option.label}
                        </Text>
                        <Text fontSize="xs" color="gray.500" fontWeight="500" whiteSpace="normal" lineHeight="1.4">
                          {option.description}
                        </Text>
                      </Box>
                      <Box
                        color="gray.300"
                        _groupHover={{ color: "#1a365d", transform: "translateX(4px)" }}
                        transition="all 0.2s"
                      >
                        <Icon as={ArrowRight} />
                      </Box>
                    </Button>
                  ))}
                </VStack>
                
                <Text textAlign="center" mt={8} color="gray.400" fontSize="xs">
                   Having trouble? <Text as="span" color="#1a365d" fontWeight="600" cursor="pointer" _hover={{ textDecoration: "underline" }}>Contact Support</Text>
                </Text>
              </Box>
            </MotionBox>
          </MotionBox>
        </>
      )}
    </AnimatePresence>
  );
}
