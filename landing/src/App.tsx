import { useState } from "react";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <Box>
      <Navbar onLoginClick={openLogin} />
      <Hero onLoginClick={openLogin} />
      <Features />
      <About />
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </Box>
  );
}

export default App;
