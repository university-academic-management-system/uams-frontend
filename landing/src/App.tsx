import { useState } from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PromoSection from "./components/PromoSection";
import About from "./components/About";
import NewsSection from "./components/NewsSection";
import ResourcesSection from "./components/ResourcesSection";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <Box position="relative">
      <Navbar onLoginClick={openLogin} />
      <Hero />
      <PromoSection />
      <About />
      <NewsSection />
      <ResourcesSection />
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </Box>
  );
}

export default App;
