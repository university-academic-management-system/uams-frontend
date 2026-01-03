import { Box, Container, Heading, Text, Button, Flex, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);

interface HeroProps {
  onLoginClick: () => void;
}

export default function Hero({ onLoginClick }: HeroProps) {
  const scrollToFeatures = () => {
    const element = document.querySelector("#features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      id="home"
      position="relative"
      minH="100vh"
      display="flex"
      alignItems="center"
      overflow="hidden"
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)"
    >
      {/* Animated Background Orbs */}
      <MotionBox
        position="absolute"
        top="-20%"
        right="-10%"
        w={{ base: "300px", md: "600px" }}
        h={{ base: "300px", md: "600px" }}
        borderRadius="full"
        bg="linear-gradient(135deg, rgba(26, 54, 93, 0.1) 0%, rgba(13, 148, 136, 0.15) 100%)"
        filter="blur(60px)"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <MotionBox
        position="absolute"
        bottom="-10%"
        left="-10%"
        w={{ base: "250px", md: "500px" }}
        h={{ base: "250px", md: "500px" }}
        borderRadius="full"
        bg="linear-gradient(135deg, rgba(13, 148, 136, 0.15) 0%, rgba(26, 54, 93, 0.1) 100%)"
        filter="blur(60px)"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <MotionBox
        position="absolute"
        top="30%"
        left="20%"
        w={{ base: "150px", md: "300px" }}
        h={{ base: "150px", md: "300px" }}
        borderRadius="full"
        bg="rgba(13, 148, 136, 0.08)"
        filter="blur(40px)"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Container maxW="1400px" position="relative" zIndex={1} px={{ base: 4, md: 8 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 10, lg: 16 }}
        >
          {/* Left Content */}
          <Box flex={1} textAlign={{ base: "center", lg: "left" }} pt={{ base: 24, lg: 0 }}>
            <MotionText
              display="inline-block"
              bg="rgba(13, 148, 136, 0.1)"
              color="#0d9488"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="600"
              mb={6}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              🎓 Welcome to the Future of Education Management
            </MotionText>

            <MotionHeading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              fontWeight="800"
              lineHeight="1.1"
              mb={6}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Text as="span" color="#1e293b">
                University Academic
              </Text>
              <br />
              <Text
                as="span"
                bgGradient="to-r"
                gradientFrom="#1a365d"
                gradientTo="#0d9488"
                bgClip="text"
              >
                Management System
              </Text>
            </MotionHeading>

            <MotionText
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="600px"
              mx={{ base: "auto", lg: 0 }}
              mb={8}
              lineHeight="1.8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Streamline your academic operations with our comprehensive platform 
              designed for students, lecturers, faculty, and administrators. 
              One system, endless possibilities.
            </MotionText>

            <Stack
              direction={{ base: "column", sm: "row" }}
              gap={4}
              justify={{ base: "center", lg: "flex-start" }}
            >
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  bg="#1a365d"
                  color="white"
                  size="xl"
                  px={10}
                  py={7}
                  fontSize="lg"
                  borderRadius="full"
                  fontWeight="600"
                  _hover={{
                    bg: "#2c5282",
                    transform: "translateY(-3px)",
                    boxShadow: "0 20px 40px rgba(26, 54, 93, 0.3)",
                  }}
                  transition="all 0.3s"
                  onClick={onLoginClick}
                >
                  Get Started
                </Button>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  variant="outline"
                  size="xl"
                  px={10}
                  py={7}
                  fontSize="lg"
                  borderRadius="full"
                  borderWidth="2px"
                  borderColor="#1a365d"
                  color="#1a365d"
                  fontWeight="600"
                  _hover={{
                    bg: "rgba(26, 54, 93, 0.05)",
                    transform: "translateY(-3px)",
                  }}
                  transition="all 0.3s"
                  onClick={scrollToFeatures}
                >
                  Learn More
                </Button>
              </MotionBox>
            </Stack>

            {/* Stats */}
            <Flex
              mt={12}
              gap={{ base: 6, md: 10 }}
              justify={{ base: "center", lg: "flex-start" }}
              flexWrap="wrap"
            >
              {[
                { value: "50K+", label: "Students" },
                { value: "1,200+", label: "Courses" },
                { value: "500+", label: "Faculty" },
              ].map((stat, i) => (
                <MotionBox
                  key={stat.label}
                  textAlign="center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                >
                  <Text
                    fontSize={{ base: "2xl", md: "3xl" }}
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
            </Flex>
          </Box>

          {/* Right Content - Decorative Card Stack */}
          <MotionBox
            flex={1}
            display={{ base: "none", lg: "block" }}
            position="relative"
            h="500px"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Main Card */}
            <MotionBox
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="350px"
              h="400px"
              bg="white"
              borderRadius="3xl"
              boxShadow="0 25px 80px rgba(26, 54, 93, 0.15)"
              p={8}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Box
                w="full"
                h="120px"
                borderRadius="2xl"
                bgGradient="to-br"
                gradientFrom="#1a365d"
                gradientTo="#0d9488"
                mb={6}
              />
              <Box w="80%" h="16px" bg="gray.100" borderRadius="full" mb={4} />
              <Box w="60%" h="16px" bg="gray.100" borderRadius="full" mb={6} />
              <Flex gap={3}>
                <Box flex={1} h="60px" bg="gray.50" borderRadius="xl" />
                <Box flex={1} h="60px" bg="gray.50" borderRadius="xl" />
              </Flex>
            </MotionBox>

            {/* Background Cards */}
            <Box
              position="absolute"
              top="45%"
              left="45%"
              transform="translate(-50%, -50%) rotate(-6deg)"
              w="350px"
              h="400px"
              bg="rgba(26, 54, 93, 0.05)"
              borderRadius="3xl"
            />
            <Box
              position="absolute"
              top="55%"
              left="55%"
              transform="translate(-50%, -50%) rotate(6deg)"
              w="350px"
              h="400px"
              bg="rgba(13, 148, 136, 0.08)"
              borderRadius="3xl"
            />
          </MotionBox>
        </Flex>
      </Container>

      {/* Scroll Indicator */}
      <MotionBox
        position="absolute"
        bottom={8}
        left="50%"
        transform="translateX(-50%)"
        display={{ base: "none", md: "block" }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Box
          w="30px"
          h="50px"
          border="2px solid"
          borderColor="gray.300"
          borderRadius="full"
          position="relative"
        >
          <Box
            position="absolute"
            top={2}
            left="50%"
            transform="translateX(-50%)"
            w="4px"
            h="8px"
            bg="gray.400"
            borderRadius="full"
          />
        </Box>
      </MotionBox>
    </Box>
  );
}
