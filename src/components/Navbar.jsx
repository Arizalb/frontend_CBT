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
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";

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
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole("");
    navigate("/login");
    onLogoutClose();
  };

  // Menu berdasarkan role
  const menuLinks = (
    <>
      <Text as={Link} to="/" _hover={{ color: "teal.500" }} mr={4}>
        Home
      </Text>
      {role === "admin" && (
        <Text as={Link} to="/manage" _hover={{ color: "teal.500" }} mr={4}>
          Manage
        </Text>
      )}
      {role === "examiner" && (
        <>
          <Text
            as={Link}
            to="/create-exam"
            _hover={{ color: "teal.500" }}
            mr={4}
          >
            Create
          </Text>
          <Text
            as={Link}
            to="/examiner-managing"
            _hover={{ color: "teal.500" }}
            mr={4}
          >
            Manage
          </Text>
        </>
      )}
      {role === "student" && (
        <>
          <Text as={Link} to="/exams" _hover={{ color: "teal.500" }} mr={4}>
            My Exams
          </Text>
          <Text
            as={Link}
            to="/my-results"
            _hover={{ color: "teal.500" }}
            mr={4}
          >
            My Results
          </Text>
        </>
      )}
      <Text as={Link} to="/profile" _hover={{ color: "teal.500" }} mr={4}>
        Profile
      </Text>
    </>
  );

  const bg = useColorModeValue("gray.800", "gray.700");
  const color = useColorModeValue("white", "white");

  return (
    <Box bg={bg} p={4} color={color}>
      <Flex
        maxW="1200px"
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Brand / Logo */}
        <Heading as="h1" size="lg">
          CBT App
        </Heading>

        {/* Desktop Menu */}
        <HStack
          display={{ base: "none", md: "flex" }}
          justifyContent="center"
          spacing={4}
          flex="1"
        >
          {isAuthenticated ? menuLinks : null}
        </HStack>

        <Spacer />

        {/* Desktop Login/Register & Dark Mode */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            colorScheme="teal"
          />
          {isAuthenticated ? (
            <Button colorScheme="red" onClick={onLogoutOpen}>
              Logout
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" colorScheme="teal">
                Login
              </Button>
              <Button as={Link} to="/register" colorScheme="teal">
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
            mr={2}
          />
          <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            aria-label="Open Menu"
          />
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align={"left"}>
                {isAuthenticated ? (
                  menuLinks
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
              Confirm Logout
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onLogoutClose}>
                Cancel
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
