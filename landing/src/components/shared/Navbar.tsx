import {
    Box,
    Flex,
    HStack,
    Link as ChakraLink,
    Container,
    Image,
    IconButton,
    Stack,
} from "@chakra-ui/react";
import { LuMenu, LuUser, LuX } from "react-icons/lu";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuthStore from "@stores/auth.store";
import LinkButton from "./buttons/LinkButton";

const LOGO_SRC = "/images/a7f14cb8262ed215ba9b9d5819404f20e896d5cc.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { token, user } = useAuthStore();

    const profileUrl = useMemo(() => {
        const urlMap = new Map([
            ["STUDENT", `${location.host}/students/`],
            ["LECTURER", `${location.host}/lecturer/dashboard`],
            ["ERO", `${location.host}/lecturer/dashboard`],
            ["HOD", `${location.host}/lecturer/dashboard`],
            ["ADMIN", `${location.host}/admin/`],
            ["DEPARTMENT_ADMIN", `${location.host}/admin/`],
            ["NONE", location.host]
        ]);

        const roles = [user?.role, ...user?.roles || []].filter(Boolean).filter(r => r !== "STAFF");
        const key = roles[0] || "NONE" as const;
        return urlMap.get(key) || location.host;
    }, [user]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleNavClick = (href: string) => {
        if (href.startsWith("#")) {
            const id = href.substring(1);
            if (window.location.pathname !== "/") {
                navigate("/");
                setTimeout(() => scrollToSection(id), 100);
            } else {
                scrollToSection(id);
                // Update URL without reloading page
                window.history.pushState(null, "", href);
            }
        } else {
            window.location.href = href;
        }
    };

    const navLinks = [
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Research", href: "#research" },
        { label: "Collaborations", href: "https://www.uniport.edu.ng/" },
        { label: "Admissions", href: "https://www.uniport.edu.ng/" },
        { label: "Updates", href: "https://www.uniport.edu.ng/" }
    ];

    return (
        <>
            <Box as="nav" position="sticky" top={0} zIndex={100} bg="white" boxShadow="sm">
                {/* Main Header */}
                <Container maxW="container.xl" py={4}>
                    <Flex justify="space-between" align="center">
                        {/* Logo */}
                        <HStack gap={4}>
                            <Image src={LOGO_SRC} alt="Uniport" h={{ base: "45px", md: "65px" }} objectFit="contain" />
                        </HStack>

                        {/* Desktop Nav Links */}
                        <HStack gap={8} display={{ base: "none", lg: "flex" }}>
                            {navLinks.map((item) => (
                                <ChakraLink
                                    key={item.label}
                                    onClick={() => handleNavClick(item.href)}
                                    color="gray.600"
                                    _hover={{ color: "#2AB0E8", cursor: "pointer" }}
                                    fontSize="sm"
                                    fontWeight="medium"
                                >
                                    {item.label}
                                </ChakraLink>
                            ))}
                        </HStack>

                        {/* Actions */}
                        <HStack gap={{ base: 2, md: 4 }}>
                            {!(token || user) ? (<Link
                                to="/auth/login"
                                style={{
                                    backgroundColor: "#2AB0E8",
                                    color: "white",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 500,
                                    transition: "all 0.2s",
                                    textDecoration: "none",
                                    padding: "8px 24px",
                                    fontSize: "14px",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#23a1d5")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2AB0E8")}
                            >
                                Login
                            </Link>) : (
                                <LinkButton colorPalette={"accent"} to={profileUrl}>
                                    <LuUser />  Profile
                                </LinkButton>
                            )}

                            {/* Mobile Menu Toggle */}
                            <IconButton
                                display={{ base: "flex", lg: "none" }}
                                aria-label="Toggle Navigation"
                                variant="ghost"
                                onClick={toggleMenu}
                            >
                                {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                            </IconButton>
                        </HStack>
                    </Flex>
                </Container>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <Box
                        display={{ base: "block", lg: "none" }}
                        bg="white"
                        borderTop="1px solid"
                        borderColor="gray.100"
                        pb={8}
                        px={4}
                        position="absolute"
                        top="100%"
                        left={0}
                        right={0}
                        boxShadow="md"
                    >
                        <Stack gap={1} py={4}>
                            {navLinks.map((item) => (
                                <ChakraLink
                                    key={item.label}
                                    onClick={() => { setIsOpen(false); handleNavClick(item.href); }}
                                    fontSize="md"
                                    fontWeight="medium"
                                    color="gray.700"
                                    py={3}
                                    _hover={{ cursor: "pointer" }}
                                >
                                    {item.label}
                                </ChakraLink>
                            ))}

                            {!(token || user) ? (<Link
                                to="/auth/login"
                                style={{
                                    backgroundColor: "#2AB0E8",
                                    color: "white",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 500,
                                    transition: "all 0.2s",
                                    textDecoration: "none",
                                    padding: "8px 24px",
                                    fontSize: "14px",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#23a1d5")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2AB0E8")}
                            >
                                Login
                            </Link>) : (
                                <LinkButton colorPalette={"accent"} to={profileUrl}>
                                    <LuUser />  Profile
                                </LinkButton>
                            )}
                        </Stack>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default Navbar;