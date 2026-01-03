import { Box, Container, Flex, SimpleGrid, Text, Stack, Input, Button, Link as ChakraLink } from "@chakra-ui/react";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Support", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press", href: "#" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Community", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Security", href: "#" },
    ],
  },
};

const socialLinks = [
  { name: "Twitter", icon: "𝕏", href: "#" },
  { name: "LinkedIn", icon: "in", href: "#" },
  { name: "Facebook", icon: "f", href: "#" },
  { name: "Instagram", icon: "📷", href: "#" },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Box
      id="contact"
      bg="#0f172a"
      color="white"
      pt={{ base: 16, md: 20 }}
      pb={8}
    >
      <Container maxW="1400px" px={{ base: 4, md: 8 }}>
        {/* Newsletter Section */}
        <Box
          bg="linear-gradient(135deg, rgba(26, 54, 93, 0.8) 0%, rgba(13, 148, 136, 0.8) 100%)"
          borderRadius="3xl"
          p={{ base: 8, md: 12 }}
          mb={16}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-50%"
            right="-20%"
            w="400px"
            h="400px"
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.05)"
          />
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap={6}
            position="relative"
            zIndex={1}
          >
            <Box textAlign={{ base: "center", md: "left" }}>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={2}>
                Stay Updated with UAMS
              </Text>
              <Text color="whiteAlpha.800">
                Get the latest news and updates delivered to your inbox.
              </Text>
            </Box>
            <Flex gap={3} w={{ base: "full", md: "auto" }}>
              <Input
                placeholder="Enter your email"
                bg="white"
                color="gray.800"
                borderRadius="full"
                border="none"
                px={6}
                _placeholder={{ color: "gray.500" }}
                flex={1}
                minW={{ md: "280px" }}
              />
              <Button
                bg="white"
                color="#1a365d"
                borderRadius="full"
                px={8}
                fontWeight="600"
                _hover={{
                  bg: "gray.100",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.3s"
              >
                Subscribe
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Main Footer Content */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap={8} mb={12}>
          {/* Brand */}
          <Box gridColumn={{ base: "span 2", md: "span 3", lg: "span 2" }}>
            <Flex align="center" gap={2} mb={4}>
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
              <Text fontSize="xl" fontWeight="800">
                UAMS
              </Text>
            </Flex>
            <Text color="gray.400" mb={6} maxW="300px" lineHeight="1.8">
              Empowering educational institutions with modern academic management solutions.
            </Text>
            <Flex gap={3}>
              {socialLinks.map((social) => (
                <ChakraLink
                  key={social.name}
                  href={social.href}
                  w={10}
                  h={10}
                  borderRadius="lg"
                  bg="whiteAlpha.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.3s"
                  _hover={{
                    bg: "#0d9488",
                    transform: "translateY(-2px)",
                    textDecoration: "none",
                  }}
                >
                  <Text fontSize="sm" fontWeight="600">
                    {social.icon}
                  </Text>
                </ChakraLink>
              ))}
            </Flex>
          </Box>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <Box key={key}>
              <Text fontWeight="600" mb={4} color="white">
                {section.title}
              </Text>
              <Stack gap={3}>
                {section.links.map((link) => (
                  <Text
                    key={link.name}
                    color="gray.400"
                    fontSize="sm"
                    cursor="pointer"
                    transition="color 0.2s"
                    _hover={{ color: "#0d9488" }}
                    onClick={() => scrollToSection(link.href)}
                  >
                    {link.name}
                  </Text>
                ))}
              </Stack>
            </Box>
          ))}
        </SimpleGrid>

        {/* Bottom Bar */}
        <Box
          pt={8}
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text color="gray.500" fontSize="sm" textAlign={{ base: "center", md: "left" }}>
              © {new Date().getFullYear()} UAMS - University Academic Management System. All rights reserved.
            </Text>
            <Flex gap={6}>
              <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{ color: "gray.300" }}>
                Privacy
              </Text>
              <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{ color: "gray.300" }}>
                Terms
              </Text>
              <Text color="gray.500" fontSize="sm" cursor="pointer" _hover={{ color: "gray.300" }}>
                Cookies
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
