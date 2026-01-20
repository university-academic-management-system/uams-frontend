import { Box, Flex, Text, Button, IconButton, Stack, Collapsible, Image } from "@chakra-ui/react";
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
          <Flex align="center" gap={3} cursor="pointer">
            <Image
              src="/landing-logo.jpg"
              alt="UNIPORT Logo"
              // w={12}
              h={14}
              // borderRadius="full"
              objectFit="cover"
            />
          </Flex>
        </Link>

        {/* Desktop Navigation */}
        <Flex
          display={{ base: "none", lg: "flex" }}
          align="center"
          gap={8}
          flex={1}
          justify="center"
        >
          {[
            { name: "Home", href: "#home" },
            { name: "About", href: "#about" },
            { name: "Research", href: "#research" },
            { name: "Collaborations", href: "#partners" },
            { name: "Digital Labs", href: "#labs" },
            { name: "Updates", href: "#news" },
          ].map((link) => (
            <Text
              key={link.name}
              color="gray.600"
              fontWeight="500"
              cursor="pointer"
              position="relative"
              _hover={{ color: "#1a365d" }}
              onClick={() => scrollToSection(link.href)}
              transition="color 0.2s"
              fontSize="sm"
            >
              {link.name}
            </Text>
          ))}
        </Flex>

        {/* Login Button - Desktop */}
        <Flex display={{ base: "none", lg: "flex" }} align="center" gap={4}>
          {/* <Button
            variant="ghost"
            size="sm"
            px={2}
            aria-label="Search"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Button> */}
          <Button
            bg="#0284c7" // Light blue like in the screenshot
            color="white"
            px={6}
            py={5}
            borderRadius="md"
            fontWeight="600"
            fontSize="sm"
            _hover={{
              bg: "#0369a1",
            }}
            transition="all 0.3s"
            onClick={onLoginClick}
          >
            Login
          </Button>
        </Flex>

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
