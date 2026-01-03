import { Box, Flex, Text, Button, IconButton, Stack, Collapsible } from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionBox = motion.create(Box);

interface NavbarProps {
  onLoginClick: () => void;
}

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <MotionBox
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="rgba(255, 255, 255, 0.95)"
      backdropFilter="blur(10px)"
      boxShadow="0 2px 20px rgba(0, 0, 0, 0.08)"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={4}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Link to="/">
          <Flex align="center" gap={2} cursor="pointer">
            <Box
              w={10}
              h={10}
              borderRadius="xl"
              bgGradient="to-br"
              gradientFrom="#1a365d"
              gradientTo="#0d9488"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontWeight="800" fontSize="lg">
                U
              </Text>
            </Box>
            <Text
              fontSize="xl"
              fontWeight="800"
              bgGradient="to-r"
              gradientFrom="#1a365d"
              gradientTo="#0d9488"
              bgClip="text"
            >
              UAMS
            </Text>
          </Flex>
        </Link>

        {/* Desktop Navigation */}
        <Flex
          display={{ base: "none", lg: "flex" }}
          align="center"
          gap={8}
        >
          {navLinks.map((link) => (
            <Text
              key={link.name}
              color="gray.600"
              fontWeight="500"
              cursor="pointer"
              position="relative"
              _hover={{ color: "#1a365d" }}
              onClick={() => scrollToSection(link.href)}
              transition="color 0.2s"
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-4px",
                left: 0,
                width: "0%",
                height: "2px",
                bg: "#0d9488",
                transition: "width 0.3s",
              }}
              css={{
                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              {link.name}
            </Text>
          ))}
        </Flex>

        {/* Login Button - Desktop */}
        <Box display={{ base: "none", lg: "block" }}>
          <Button
            bg="#1a365d"
            color="white"
            px={8}
            py={6}
            borderRadius="full"
            fontWeight="600"
            _hover={{
              bg: "#2c5282",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 30px rgba(26, 54, 93, 0.3)",
            }}
            transition="all 0.3s"
            onClick={onLoginClick}
          >
            Login
          </Button>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", lg: "none" }}
          variant="ghost"
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
        >
          <Box as="span" position="relative" w={6} h={5}>
            <Box
              as="span"
              position="absolute"
              h="2px"
              w="full"
              bg="#1a365d"
              borderRadius="full"
              transition="all 0.3s"
              top={isOpen ? "50%" : 0}
              transform={isOpen ? "rotate(45deg)" : "none"}
            />
            <Box
              as="span"
              position="absolute"
              h="2px"
              w="full"
              bg="#1a365d"
              borderRadius="full"
              top="50%"
              transform="translateY(-50%)"
              opacity={isOpen ? 0 : 1}
              transition="all 0.3s"
            />
            <Box
              as="span"
              position="absolute"
              h="2px"
              w="full"
              bg="#1a365d"
              borderRadius="full"
              transition="all 0.3s"
              bottom={isOpen ? "50%" : 0}
              transform={isOpen ? "rotate(-45deg)" : "none"}
            />
          </Box>
        </IconButton>
      </Flex>

      {/* Mobile Menu */}
      <Collapsible.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <Collapsible.Content>
          <Box
            display={{ base: "block", lg: "none" }}
            pb={6}
            px={4}
            bg="white"
          >
            <Stack gap={4}>
              {navLinks.map((link) => (
                <Text
                  key={link.name}
                  py={2}
                  color="gray.600"
                  fontWeight="500"
                  cursor="pointer"
                  _hover={{ color: "#1a365d" }}
                  onClick={() => scrollToSection(link.href)}
                >
                  {link.name}
                </Text>
              ))}
              <Button
                bg="#1a365d"
                color="white"
                w="full"
                py={6}
                borderRadius="full"
                fontWeight="600"
                _hover={{ bg: "#2c5282" }}
                onClick={onLoginClick}
              >
                Login
              </Button>
            </Stack>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </MotionBox>
  );
}
