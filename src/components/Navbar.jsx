import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useColorMode,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  Image,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import logo from "../utils/logo.png";
import { logout } from "../services/authService";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();

  const cancelRef = useRef();
  const navigate = useNavigate();

  // Cek token dan role dari localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");

      setIsAuthenticated(!!token);
      setRole(userRole || "");
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setRole("");
    navigate("/login");
    onLogoutClose();
  };

  // Menu berdasarkan role
  const menuLinks = (
    <>
      <Text
        as={Link}
        to="/"
        _hover={{ color: "teal.400", textDecoration: "underline" }}
        fontWeight="bold"
        mr={{ base: 2, md: 1 }}
        fontSize={{ base: "md", md: "sm", lg: "md" }}
        whiteSpace="nowrap"
      >
        Home
      </Text>
      {role === "admin" && (
        <Text
          as={Link}
          to="/manage"
          _hover={{ color: "teal.400", textDecoration: "underline" }}
          fontWeight="bold"
          mr={{ base: 2, md: 1 }}
          fontSize={{ base: "md", md: "sm", lg: "md" }}
          whiteSpace="nowrap"
        >
          Manage
        </Text>
      )}
      {role === "examiner" && (
        <>
          <Text
            as={Link}
            to="/create-exam"
            _hover={{ color: "teal.400", textDecoration: "underline" }}
            fontWeight="bold"
            mr={{ base: 2, md: 1 }}
            fontSize={{ base: "md", md: "sm", lg: "md" }}
            whiteSpace="nowrap"
          >
            Create
          </Text>
          <Text
            as={Link}
            to="/examiner-managing"
            _hover={{ color: "teal.400", textDecoration: "underline" }}
            fontWeight="bold"
            mr={{ base: 2, md: 1 }}
            fontSize={{ base: "md", md: "sm", lg: "md" }}
            whiteSpace="nowrap"
          >
            Manage
          </Text>
        </>
      )}
      {role === "student" && (
        <>
          <Text
            as={Link}
            to="/exams"
            _hover={{ color: "teal.400", textDecoration: "underline" }}
            fontWeight="bold"
            mr={{ base: 2, md: 1 }}
            fontSize={{ base: "md", md: "sm", lg: "md" }}
            whiteSpace="nowrap"
          >
            My Exams
          </Text>
          <Text
            as={Link}
            to="/my-results"
            _hover={{ color: "teal.400", textDecoration: "underline" }}
            fontWeight="bold"
            mr={{ base: 2, md: 1 }}
            fontSize={{ base: "md", md: "sm", lg: "md" }}
            whiteSpace="nowrap"
          >
            My Results
          </Text>
        </>
      )}
      <Text
        as={Link}
        to="/profile"
        _hover={{ color: "teal.400", textDecoration: "underline" }}
        fontWeight="bold"
        mr={0}
        fontSize={{ base: "md", md: "sm", lg: "md" }}
        whiteSpace="nowrap"
      >
        Profile
      </Text>
    </>
  );

  const bg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const navShadow = useColorModeValue("md", "lg");

  return (
    <Box
      bg={bg}
      borderBottom={`1.5px solid ${borderColor}`}
      boxShadow={navShadow}
      py={{ base: 2, md: 2 }}
      px={{ base: 2, sm: 4, md: 8, lg: 0 }}
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex
        maxW="1200px"
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
        minH="60px"
        px={{ base: 0, md: 2, lg: 0 }}
      >
        {/* Brand / Logo */}
        <HStack spacing={{ base: 1, md: 2 }}>
          <Image
            src={logo}
            alt="OnTest Logo"
            boxSize={{ base: "32px", md: "38px" }}
          />
          <Heading
            as="h1"
            size="md"
            color="teal.500"
            letterSpacing="tight"
            fontWeight="extrabold"
            ml={1}
            fontSize={{ base: "lg", md: "xl" }}
          >
            OnTest
          </Heading>
          {role && (
            <Badge
              colorScheme="purple"
              ml={2}
              fontSize={{ base: "0.75em", md: "0.85em" }}
              px={2}
              py={0.5}
              borderRadius="md"
              textTransform="capitalize"
            >
              {role}
            </Badge>
          )}
        </HStack>

        {/* Desktop Menu */}
        <HStack
          display={{ base: "none", md: "flex" }}
          justifyContent="center"
          spacing={{ base: 1, md: 2, lg: 3 }}
          ml={{ md: 2, lg: 8 }}
          flexWrap="wrap"
          overflowX="auto"
          width="auto"
        >
          {isAuthenticated ? menuLinks : null}
        </HStack>

        <Spacer />

        {/* Desktop Login/Register & Dark Mode */}
        <HStack spacing={2} display={{ base: "none", md: "flex" }}>
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            colorScheme="teal"
            variant="ghost"
            fontSize="xl"
          />
          {isAuthenticated ? (
            <Button colorScheme="red" onClick={onLogoutOpen} size="sm">
              Logout
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" colorScheme="teal" size="sm">
                Login
              </Button>
              <Button as={Link} to="/register" colorScheme="teal" size="sm">
                Register
              </Button>
            </>
          )}
        </HStack>

        {/* Mobile Buttons */}
        <HStack display={{ base: "flex", md: "none" }}>
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            colorScheme="teal"
            variant="ghost"
            fontSize="xl"
            mr={1}
          />
          <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            aria-label="Open Menu"
            colorScheme="teal"
            variant="outline"
          />
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <HStack>
                <Image src={logo} alt="OnTest Logo" boxSize="32px" />
                <Text fontWeight="bold" color="teal.500">
                  OnTest
                </Text>
                {role && (
                  <Badge
                    colorScheme="purple"
                    ml={2}
                    fontSize="0.85em"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    textTransform="capitalize"
                  >
                    {role}
                  </Badge>
                )}
              </HStack>
            </DrawerHeader>
            <Divider mb={2} />
            <DrawerBody>
              <VStack spacing={4} align={"left"}>
                {isAuthenticated ? (
                  <>
                    {menuLinks}
                    <Button colorScheme="red" onClick={onLogoutOpen} w="full">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to="/login" colorScheme="teal" w="full">
                      Login
                    </Button>
                    <Button
                      as={Link}
                      to="/register"
                      colorScheme="teal"
                      w="full"
                    >
                      Register
                    </Button>
                  </>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutOpen}
        leastDestructiveRef={cancelRef}
        onClose={onLogoutClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Konfirmasi Logout
            </AlertDialogHeader>
            <AlertDialogBody>Apakah Anda yakin ingin keluar?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onLogoutClose}>
                Batal
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default Navbar;
