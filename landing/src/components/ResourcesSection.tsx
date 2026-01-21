import { Box, Container, Heading, Text, SimpleGrid, Button, Flex } from "@chakra-ui/react";
import { BookOpen, Book, Laptop2, Download } from "lucide-react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export default function ResourcesSection() {
  const resources = [
    {
      title: "Handbook",
      subtitle: "Departmental Student Handbook",
      action: "Click to download",
      icon: Book,
      color: "green.500",
      bg: "green.50",
      btnColor: "green"
    },
    {
      title: "E-Books",
      subtitle: "Access our digital library",
      action: "View Available E-books",
      icon: BookOpen,
      color: "blue.500",
      bg: "blue.50",
      btnColor: "blue"
    },
    {
      title: "E-Courses",
      subtitle: "Online learning materials",
      action: "Available E-courses",
      icon: Laptop2,
      color: "indigo.500",
      bg: "indigo.50",
      btnColor: "indigo"
    }
  ];

  return (
    <Box bg="#f8fafc" py={{ base: 16, md: 24 }} id="resources">
      <Container maxW="1200px" px={{ base: 4, md: 8 }}>
        <Heading
          textAlign="center"
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="700"
          color="#1e293b"
          mb={4}
          fontFamily="serif"
        >
          Resources
        </Heading>
        <Text textAlign="center" color="gray.500" mb={12} maxW="600px" mx="auto">
            Essential tools and materials to support your academic success.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          {resources.map((resource, index) => (
            <MotionBox
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              bg="white"
              p={8}
              borderRadius="xl"
              boxShadow="sm"
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "xl"
              }}
            >
              <Flex
                w={16}
                h={16}
                bg={resource.bg}
                color={resource.color}
                borderRadius="full"
                align="center"
                justify="center"
                mb={6}
              >
                <resource.icon size={28} />
              </Flex>

              <Heading as="h3" fontSize="xl" fontWeight="700" color="#1e293b" mb={2}>
                {resource.title}
              </Heading>

              <Text color="gray.500" mb={6} fontSize="sm">
                {resource.subtitle}
              </Text>

              <Button
                variant="outline"
                colorScheme={resource.btnColor}
                size="sm"
                w="full"
                mt="auto"
              >
                {resource.action} {resource.title === "Handbook" && <Box ml={2} display="inline-flex"><Download size={14} /></Box>}
              </Button>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
