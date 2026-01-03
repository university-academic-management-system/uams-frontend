import { Box, Container, Heading, Text, SimpleGrid, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const features = [
  {
    icon: "🎓",
    title: "Student Portal",
    description: "Access grades, schedules, course materials, and academic records all in one place.",
    color: "#1a365d",
  },
  {
    icon: "👨‍🏫",
    title: "Faculty Management",
    description: "Manage courses, track attendance, submit grades, and communicate with students effortlessly.",
    color: "#0d9488",
  },
  {
    icon: "📚",
    title: "Course Registration",
    description: "Seamless online course enrollment with real-time availability and prerequisite checking.",
    color: "#7c3aed",
  },
  {
    icon: "📊",
    title: "Grade Tracking",
    description: "Comprehensive grading system with analytics, GPA calculation, and progress reports.",
    color: "#ea580c",
  },
  {
    icon: "🏛️",
    title: "Department Analytics",
    description: "Powerful insights for department heads and administrators to make data-driven decisions.",
    color: "#0891b2",
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    description: "Role-based access control ensuring data privacy and security for all users.",
    color: "#be185d",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Features() {
  return (
    <Box
      id="features"
      py={{ base: 16, md: 24 }}
      bg="white"
      position="relative"
      overflow="hidden"
    >
      {/* Background Decoration */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="400px"
        bgGradient="to-b"
        gradientFrom="gray.50"
        gradientTo="white"
      />

      <Container maxW="1400px" position="relative" zIndex={1} px={{ base: 4, md: 8 }}>
        {/* Section Header */}
        <Box textAlign="center" mb={16}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Text
              display="inline-block"
              bg="rgba(13, 148, 136, 0.1)"
              color="#0d9488"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="600"
              mb={4}
            >
              ✨ Features
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Heading
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              fontWeight="800"
              mb={4}
            >
              <Text as="span" color="#1e293b">
                Everything You Need,{" "}
              </Text>
              <Text
                as="span"
                bgGradient="to-r"
                gradientFrom="#1a365d"
                gradientTo="#0d9488"
                bgClip="text"
              >
                In One Place
              </Text>
            </Heading>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.600"
              maxW="700px"
              mx="auto"
              lineHeight="1.8"
            >
              UAMS provides a comprehensive suite of tools designed to streamline 
              academic operations and enhance the educational experience for everyone.
            </Text>
          </MotionBox>
        </Box>

        {/* Features Grid */}
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
            {features.map((feature) => (
              <MotionBox
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Box
                  bg="white"
                  p={8}
                  borderRadius="2xl"
                  boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
                  border="1px solid"
                  borderColor="gray.100"
                  h="full"
                  transition="all 0.3s"
                  _hover={{
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                    borderColor: "transparent",
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Hover Gradient Overlay */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="4px"
                    bgGradient="to-r"
                    gradientFrom={feature.color}
                    gradientTo="#0d9488"
                    opacity={0}
                    transition="opacity 0.3s"
                    css={{
                      ".group:hover &, *:hover > &": {
                        opacity: 1,
                      },
                    }}
                  />

                  <Flex
                    w={16}
                    h={16}
                    borderRadius="2xl"
                    bg={`${feature.color}10`}
                    align="center"
                    justify="center"
                    mb={6}
                    fontSize="2xl"
                  >
                    {feature.icon}
                  </Flex>

                  <Heading
                    as="h3"
                    fontSize="xl"
                    fontWeight="700"
                    color="#1e293b"
                    mb={3}
                  >
                    {feature.title}
                  </Heading>

                  <Text color="gray.600" lineHeight="1.7">
                    {feature.description}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </MotionBox>
      </Container>
    </Box>
  );
}
