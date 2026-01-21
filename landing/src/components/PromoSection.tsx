import { Box, Container, Flex, Heading, Text, Button, Stack, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CheckCircle2, Timer } from "lucide-react";

const MotionBox = motion.create(Box);

export default function PromoSection() {
  return (
    <Box bg="#0f172a" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
      {/* Background decoration */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgImage="linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url('/circuit-board.svg')" // Placeholder pattern
        opacity={0.4}
        zIndex={0}
      />

      <Container maxW="1200px" position="relative" zIndex={1} px={{ base: 4, md: 8 }}>
        <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 12, lg: 16 }} align="center">
          
          {/* Left Content */}
          <Box flex={1}>
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="700"
              color="white"
              mb={8}
              lineHeight="1.2"
            >
              Streamline Your Academic Journey with UAMS !!!
            </Heading>

            <Stack gap={6} mb={10}>
              {[
                "Real-time Result Checking & Transcript Generation",
                "Seamless Course Registration Process",
                "Instant Access to Lecture Materials & Resources",
                "Automated Notifications for Important Updates"
              ].map((item, index) => (
                <Flex key={index} gap={4} align="center">
                  <CheckCircle2 color="#38bdf8" size={24} />
                  <Text color="gray.300" fontSize="lg" fontWeight="500">
                    {item}
                  </Text>
                </Flex>
              ))}
            </Stack>

            <Flex gap={4} wrap="wrap" mb={12}>
              <Button
                bg="#ef4444" // Red button
                color="white"
                size="lg"
                px={8}
                _hover={{ bg: "#dc2626" }}
              >
                Access Portal
              </Button>
              <Button
                bg="#ef4444" // Red button
                color="white"
                size="lg"
                px={8}
                _hover={{ bg: "#dc2626" }}
              >
                Department Guide
              </Button>
            </Flex>

            {/* Countdown Timer Mock */}
            <Box>
              <Flex gap={2} align="center" mb={4}>
                 <Timer color="#38bdf8" size={20} />
                 <Text color="#38bdf8" fontWeight="600">Semester Registration Ends In:</Text>
              </Flex>
              <Flex gap={4}>
                {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => (
                  <Box key={label} textAlign="center">
                    <Box
                      bg="rgba(255, 255, 255, 0.1)"
                      borderRadius="md"
                      p={3}
                      minW="70px"
                      mb={2}
                    >
                      <Text fontSize="2xl" fontWeight="700" color="white">
                        {["12", "04", "45", "30"][i]}
                      </Text>
                    </Box>
                    <Text fontSize="xs" color="gray.400">{label}</Text>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>

          {/* Right Image Placeholder */}
          <Box flex={1} w="full">
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
               <Box
                 bg="gray.700"
                 w="full"
                 h={{ base: "300px", md: "500px" }}
                 borderRadius="2xl"
                 display="flex"
                 alignItems="center"
                 justifyContent="center"
                 position="relative"
                 overflow="hidden"
               >
                  <Image 
                    src="/image1.png" 
                    objectFit="stretch" 
                    w="full" 
                    h="full" 
                    alt="Student working on laptop"
                  />
               </Box>
            </MotionBox>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
