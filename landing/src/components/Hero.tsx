import { useState, useEffect } from "react";
import { Box, Container, Heading, Text, Button } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion.create(Box);

const heroImages = [
  "/slider2-1.jpeg",
  "/second-building.jpeg"
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {/* Background Image Carousel */}
      <AnimatePresence>
        <MotionBox
          key={currentImageIndex}
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage={`url('${heroImages[currentImageIndex]}')`}
          bgSize="cover"
          backgroundPosition="center"
          bgRepeat="no-repeat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          zIndex={0}
        />
      </AnimatePresence>

      {/* Dark Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.4)" 
        zIndex={1}
      />

      <Container maxW="1200px" position="relative" zIndex={2} px={{ base: 4, md: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          maxW="900px"
          mx="auto"
          textAlign="center"
        >
           {/* Blue Text Box Overlay */}
          <Box
             bg="#0284c7"
             p={{ base: 6, md: 10 }}
             borderRadius="md"
             boxShadow="lg"
             maxWidth="800px"
             mx="auto"
          >
             <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="700"
                color="white"
                lineHeight="1.2"
                mb={4}
              >
                Building the Next Generation of Computer Scientists
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="white"
                fontWeight="500"
                mb={8}
              >
                University of Port Harcourt, Faculty of Computing, Department of Computer Science
              </Text>

              <Button
                color="#0284c7"
                bg="white"
                size="lg"
                px={8}
                fontSize="md"
                fontWeight="700"
                _hover={{
                  bg: "gray.100",
                }}
                onClick={scrollToFeatures}
              >
                Learn more
              </Button>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
