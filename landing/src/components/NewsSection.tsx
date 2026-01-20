import { Box, Container, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const newsItems = [
  {
    id: 1,
    title: "Department Launches New AI Research Lab",
    date: "March 15, 2026",
    category: "Research",
    excerpt: "The Department of Computer Science is proud to announce the opening of its state-of-the-art Artificial Intelligence Research Laboratory, sponsored by top tech partners.",
    image: "/news-ai.jpg" // Placeholder path
  },
  {
    id: 2,
    title: "Students Win National Coding Hackathon",
    date: "February 28, 2026",
    category: "Achievement",
    excerpt: "A team of final year Computer Science students secured the first place in the Annual National Software Development Hackathon held in Lagos.",
    image: "/news-hackathon.jpg" // Placeholder path
  },
  {
    id: 3,
    title: "Upcoming Guest Lecture: Future of Cybersecurity",
    date: "April 10, 2026",
    category: "Events",
    excerpt: "Join us for an insightful session with Dr. Alan Turing (not really) on the evolving landscape of cybersecurity threats and defenses.",
    image: "/news-cyber.jpg" // Placeholder path
  }
];

export default function NewsSection() {
  return (
    <Box bg="white" py={{ base: 16, md: 24 }} id="news">
      <Container maxW="1000px" px={{ base: 4, md: 8 }}>
        <Heading
          textAlign="center"
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="700"
          color="#1e293b"
          mb={12}
        >
          Featured News & Updates
        </Heading>

        <VStack gap={8} align="stretch">
          {newsItems.map((news, index) => (
            <MotionBox
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              borderWidth="1px"
              borderColor="gray.100"
              borderRadius="xl"
              overflow="hidden"
              _hover={{ boxShadow: "lg", borderColor: "blue.100" }}
              bg="white"
            >
              <Flex direction={{ base: "column", md: "row" }}>
                <Box
                  w={{ base: "full", md: "300px" }}
                  h={{ base: "200px", md: "auto" }}
                  bg="gray.200"
                  flexShrink={0}
                  position="relative"
                >
                  {/* Placeholder for Image */}
                    <Flex align="center" justify="center" h="full" bgGradient="to-br from-gray.100 to-gray.300">
                        <Text color="gray.500" fontSize="sm">News Image</Text>
                    </Flex>
                </Box>

                <Box p={6} flex={1}>
                  <Flex align="center" gap={3} mb={3}>
                    <Box bg="#e0f2fe" color="#0284c7" px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold">
                      {news.category}
                    </Box>
                    <Text fontSize="sm" color="gray.500">
                      {news.date}
                    </Text>
                  </Flex>

                  <Heading as="h3" fontSize="xl" fontWeight="700" color="#1e293b" mb={3}>
                    {news.title}
                  </Heading>

                  <Text color="gray.600" lineHeight="1.6">
                    {news.excerpt}
                  </Text>
                </Box>
              </Flex>
            </MotionBox>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
