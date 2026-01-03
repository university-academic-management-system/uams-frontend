import { Box, Container, Heading, Text, SimpleGrid, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const userTypes = [
  {
    icon: "👨‍🎓",
    title: "Students",
    description: "Access your academic journey, track progress, and manage your schedule.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "👨‍🏫",
    title: "Lecturers",
    description: "Manage courses, grade assignments, and connect with students seamlessly.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: "🏛️",
    title: "Faculty Admins",
    description: "Oversee faculty operations, manage staff, and coordinate academic programs.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: "⚙️",
    title: "Department Admins",
    description: "Handle departmental tasks, approvals, and administrative workflows.",
    gradient: "from-teal-500 to-green-500",
  },
];

export default function About() {
  return (
    <Box
      id="about"
      py={{ base: 16, md: 24 }}
      bg="linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)"
      position="relative"
    >
      <Container maxW="1400px" px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 10, lg: 16 }} alignItems="center">
          {/* Left Content */}
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Text
              display="inline-block"
              bg="rgba(26, 54, 93, 0.1)"
              color="#1a365d"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="600"
              mb={4}
            >
              📖 About UAMS
            </Text>

            <Heading
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="800"
              mb={6}
              lineHeight="1.2"
            >
              <Text as="span" color="#1e293b">
                Empowering Education Through{" "}
              </Text>
              <Text
                as="span"
                bgGradient="to-r"
                gradientFrom="#1a365d"
                gradientTo="#0d9488"
                bgClip="text"
              >
                Smart Technology
              </Text>
            </Heading>

            <Text color="gray.600" fontSize="lg" lineHeight="1.9" mb={6}>
              The University Academic Management System (UAMS) is a comprehensive 
              digital platform designed to revolutionize how educational institutions 
              manage their academic operations. From enrollment to graduation, UAMS 
              provides seamless tools for every stakeholder.
            </Text>

            <Text color="gray.600" fontSize="lg" lineHeight="1.9">
              Built with modern technology and user-centric design, UAMS ensures 
              that students, lecturers, faculty, and administrators can focus on 
              what matters most – education.
            </Text>

            {/* Stats */}
            <SimpleGrid columns={3} gap={6} mt={10}>
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Support" },
                { value: "100+", label: "Institutions" },
              ].map((stat, index) => (
                <MotionBox
                  key={stat.label}
                  textAlign="center"
                  p={4}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Text
                    fontSize="2xl"
                    fontWeight="800"
                    bgGradient="to-r"
                    gradientFrom="#1a365d"
                    gradientTo="#0d9488"
                    bgClip="text"
                  >
                    {stat.value}
                  </Text>
                  <Text color="gray.500" fontSize="sm" fontWeight="500">
                    {stat.label}
                  </Text>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>

          {/* Right Content - User Types */}
          <Box>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
              {userTypes.map((type, index) => (
                <MotionBox
                  key={type.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Box
                    p={6}
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                    h="full"
                    position="relative"
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{
                      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    <Flex
                      w={14}
                      h={14}
                      borderRadius="xl"
                      bgGradient="to-br"
                      gradientFrom="#1a365d"
                      gradientTo="#0d9488"
                      align="center"
                      justify="center"
                      mb={4}
                      fontSize="2xl"
                    >
                      {type.icon}
                    </Flex>

                    <Heading
                      as="h3"
                      fontSize="lg"
                      fontWeight="700"
                      color="#1e293b"
                      mb={2}
                    >
                      {type.title}
                    </Heading>

                    <Text color="gray.600" fontSize="sm" lineHeight="1.7">
                      {type.description}
                    </Text>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
