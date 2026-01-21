import { Box, Container, Heading, Text, SimpleGrid, Flex, Button, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export default function About() {
  const cards = [
    {
      title: "Welcome Address",
      subtitle: "From the HOD's Desk",
      image: "/HOD.jpeg", 
      link: "#"
    },
    {
      title: "About",
      subtitle: "Our Philosophy | Focus Areas",
      image: "/About.jpeg", 
      link: "#"
    },
    {
      title: "Trainings Courses & Certifications",
      subtitle: "Enhance your skills",
      image: "/Training.jpeg", 
      link: "#"
    }
  ];

  return (
    <Box id="about" position="relative">
      <Box py={{ base: 16, md: 20 }} bg="white">
        <Container maxW="1200px" px={{ base: 4, md: 8 }}>
          <Heading
            textAlign="center"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold" 
            fontFamily="serif"
            color="#1e293b"
            mb={12}
          >
            Welcome
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {cards.map((card, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                bg="white"
                borderRadius="sm"
                boxShadow="lg"
                overflow="hidden"
                position="relative"
                role="group"
                _hover={{
                     transform: "translateY(-5px)",
                     transition: "transform 0.3s"
                }}
              >
                <Box h="300px" bg="gray.200" position="relative">
                    <Image
                      src={card.image}
                      alt={card.title}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                     {/* Overlay Content */}
                     <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        right={0}
                        p={6}
                        bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
                     >
                        <Heading fontSize="xl" color="white" mb={1}>{card.title}</Heading>
                        <Text fontSize="sm" color="gray.200">{card.subtitle}</Text>
                     </Box>
                     
                     <Box
                        position="absolute"
                        bottom={6}
                        right={6}
                        bg="white"
                        borderRadius="full"
                        p={2}
                        color="gray.800"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                     </Box>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Links Banner */}
      <Box bg="#0284c7" py={12}>
          <Container maxW="1200px" px={{ base: 4, md: 8 }}>
              <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={8}>
                 <Box textAlign={{ base: "center", md: "left" }}>
                     <Heading fontSize="2xl" color="white" mb={2} fontFamily="serif">Other Popular Links</Heading>
                 </Box>
                 <Flex gap={4} wrap="wrap" justify="center">
                     {["Academic Programs", "Research & Innovations", "Industry Partnerships & Collaborations"].map((link) => (
                         <Button
                            key={link}
                            variant="outline"
                            color="white"
                            borderColor="rgba(255,255,255,0.3)"
                            _hover={{ bg: "white", color: "#0284c7" }}
                            size="lg"
                         >
                            {link}
                         </Button>
                     ))}
                 </Flex>
              </Flex>
          </Container>
      </Box>
    </Box>
  );
}
