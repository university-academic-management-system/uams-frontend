import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const MotionBox = motion.create(Box);

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const userTypes = [
  { id: "student", label: "Student", icon: "👨‍🎓" },
  { id: "lecturer", label: "Lecturer", icon: "👨‍🏫" },
  { id: "faculty_admin", label: "Faculty Admin", icon: "🏛️" },
  { id: "dept_admin", label: "Dept Admin", icon: "⚙️" },
];

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [selectedType, setSelectedType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    // where is the login code?
    //this landing page is not complete
    console.log({ email, password, selectedType, rememberMe });
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
          >
            {/* Modal */}
            <MotionBox
              w={{ base: "100%", sm: "450px" }}
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
            {/* Header */}
            <Box
              p={8}
              pb={0}
              position="relative"
            >
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

              {/* Logo */}
              <Flex align="center" justify="center" mb={6}>
                <Box
                  w={12}
                  h={12}
                  borderRadius="xl"
                  bgGradient="to-br"
                  gradientFrom="#1a365d"
                  gradientTo="#0d9488"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="white" fontWeight="800" fontSize="xl">
                    U
                  </Text>
                </Box>
              </Flex>

              <Heading
                textAlign="center"
                fontSize="2xl"
                fontWeight="800"
                color="#1e293b"
                mb={2}
              >
                Welcome Back
              </Heading>
              <Text textAlign="center" color="gray.500" mb={6}>
                Sign in to continue to UAMS
              </Text>
            </Box>

            {/* Form */}
            <Box as="form" onSubmit={handleSubmit} p={8} pt={0}>
              {/* User Type Selection */}
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={3}>
                  I am a:
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {userTypes.map((type) => (
                    <Box
                      key={type.id}
                      flex="1"
                      minW="calc(50% - 4px)"
                      cursor="pointer"
                      onClick={() => setSelectedType(type.id)}
                    >
                      <Box
                        p={3}
                        borderRadius="xl"
                        border="2px solid"
                        borderColor={selectedType === type.id ? "#1a365d" : "gray.200"}
                        bg={selectedType === type.id ? "rgba(26, 54, 93, 0.05)" : "white"}
                        transition="all 0.2s"
                        _hover={{
                          borderColor: selectedType === type.id ? "#1a365d" : "gray.300",
                        }}
                      >
                        <Flex align="center" gap={2}>
                          <Text fontSize="lg">{type.icon}</Text>
                          <Text
                            fontSize="sm"
                            fontWeight={selectedType === type.id ? "600" : "500"}
                            color={selectedType === type.id ? "#1a365d" : "gray.600"}
                          >
                            {type.label}
                          </Text>
                        </Flex>
                      </Box>
                    </Box>
                  ))}
                </Flex>
              </Box>

              {/* Email Input */}
              <Stack gap={4} mb={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Email Address
                  </Text>
                  <Input
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: "#1a365d",
                      boxShadow: "0 0 0 3px rgba(26, 54, 93, 0.1)",
                    }}
                    _hover={{ borderColor: "gray.300" }}
                    transition="all 0.2s"
                    required
                  />
                </Box>

                {/* Password Input */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                    Password
                  </Text>
                  <Box position="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      size="lg"
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="gray.200"
                      pr={12}
                      _focus={{
                        borderColor: "#1a365d",
                        boxShadow: "0 0 0 3px rgba(26, 54, 93, 0.1)",
                      }}
                      _hover={{ borderColor: "gray.300" }}
                      transition="all 0.2s"
                      required
                    />
                    <IconButton
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      variant="ghost"
                      size="sm"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      borderRadius="lg"
                    >
                      <Text fontSize="sm">{showPassword ? "🙈" : "👁️"}</Text>
                    </IconButton>
                  </Box>
                </Box>
              </Stack>

              {/* Remember Me & Forgot Password */}
              <Flex justify="space-between" align="center" mb={6}>
                <Flex
                  align="center"
                  gap={2}
                  cursor="pointer"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <Box
                    w={5}
                    h={5}
                    borderRadius="md"
                    border="2px solid"
                    borderColor={rememberMe ? "#1a365d" : "gray.300"}
                    bg={rememberMe ? "#1a365d" : "white"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.2s"
                  >
                    {rememberMe && (
                      <Text color="white" fontSize="xs" fontWeight="bold">
                        ✓
                      </Text>
                    )}
                  </Box>
                  <Text fontSize="sm" color="gray.600">
                    Remember me
                  </Text>
                </Flex>

                <Text
                  fontSize="sm"
                  color="#0d9488"
                  fontWeight="600"
                  cursor="pointer"
                  _hover={{ color: "#0b7a71" }}
                  transition="color 0.2s"
                >
                  Forgot password?
                </Text>
              </Flex>

              {/* Submit Button */}
              <Button
                type="submit"
                w="full"
                bg="#1a365d"
                color="white"
                size="lg"
                py={7}
                borderRadius="xl"
                fontWeight="600"
                fontSize="md"
                _hover={{
                  bg: "#2c5282",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 30px rgba(26, 54, 93, 0.3)",
                }}
                transition="all 0.3s"
              >
                Sign In
              </Button>

              {/* Sign Up Link */}
              <Text textAlign="center" mt={6} color="gray.500" fontSize="sm">
                Don't have an account?{" "}
                <Text
                  as="span"
                  color="#1a365d"
                  fontWeight="600"
                  cursor="pointer"
                  _hover={{ color: "#0d9488" }}
                  transition="color 0.2s"
                >
                  Contact your institution
                </Text>
              </Text>
            </Box>
            </MotionBox>
          </MotionBox>
        </>
      )}
    </AnimatePresence>
  );
}
