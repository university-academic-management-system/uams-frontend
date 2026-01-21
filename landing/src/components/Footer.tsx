import { Box, Container, Flex, Text, Button, Image } from "@chakra-ui/react";

export default function Footer() {
  const links = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Research", href: "#research" },
    { name: "Collaborations", href: "#partners" },
    { name: "Updates", href: "#news" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Box bg="#1a365d" color="white" pt={12} pb={8}>
      <Container maxW="1200px" px={{ base: 4, md: 8 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap={8}
          mb={12}
        >
          {/* Left: Logo */}
          <Flex align="center" gap={3}>
            <Image
              src="/landing-logo.jpg"
              alt="UNIPORT Logo"
              h={14}
              objectFit="cover"
            />
          </Flex>

          {/* Center: Navigation */}
          <Flex gap={{ base: 4, md: 8 }} wrap="wrap" justify="center">
            {links.map((link) => (
              <Text
                key={link.name}
                cursor="pointer"
                fontWeight="500"
                fontSize="sm"
                _hover={{ color: "#38bdf8" }}
                onClick={() => scrollToSection(link.href)}
                transition="color 0.2s"
              >
                {link.name}
              </Text>
            ))}
          </Flex>

          {/* Right: CTA Button */}
          <Button
            bg="#facc15"
            color="#1a365d"
            fontWeight="bold"
            px={6}
            _hover={{ bg: "#eab308" }}
            size="md"
          >
            Training Courses
          </Button>
        </Flex>

        {/* Bottom: Copyright */}
        <Box borderTop="1px solid" borderColor="rgba(255,255,255,0.1)" pt={8} textAlign="center">
           <Text fontSize="sm" color="gray.400">
             © {new Date().getFullYear()} Department of Computer Science, Faculty of Computing, University of Port Harcourt.
           </Text>
        </Box>
      </Container>
    </Box>
  );
}
