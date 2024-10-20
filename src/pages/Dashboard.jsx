import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import hero_cbt from "../utils/ontest_logo.png"; // Import hero image
import Statistics from "../components/Statistics"; // Import Statistics component
import { getUserProfile } from "../services/authService"; // Import getUserProfile

function Dashboard() {
  const [userRole, setUserRole] = useState(null); // Store user role here

  const bg = useColorModeValue("gray.50", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const buttonBg = useColorModeValue("gray.200", "gray.700");
  const buttonHoverBg = useColorModeValue("gray.300", "gray.600");

  const whiteGlow = useColorModeValue(
    "none",
    "drop-shadow(3px 0 3px rgba(255, 255, 255, 0.8))"
  );

  // Fetch user profile and role from getUserProfile
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const profile = await getUserProfile(); // Fetch user profile
        setUserRole(profile.role); // Assuming profile contains a 'role' field
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }

    fetchUserProfile();
  }, []);

  return (
    <Box minH={"100vh"}>
      <Box
        p={6}
        maxW="1200px"
        mx="auto"
        my={12}
        bg={bg}
        borderRadius="lg"
        shadow="md"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
        >
          <Box
            maxW="600px"
            textAlign={{ base: "center", md: "left" }}
            mb={{ base: 8, md: 0 }}
          >
            <Heading
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              color={headingColor}
            >
              Welcome to the CBT OnTest Dashboard
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color={textColor} mb={6}>
              Manage your exams, track your results, or update your profile.
              Everything you need in one place.
            </Text>
            <Button
              as={Link}
              to="/profile"
              bg={buttonBg}
              size="lg"
              _hover={{ bg: buttonHoverBg }}
              _dark={{ color: "white" }}
            >
              View Profile
            </Button>
            <Text fontSize="sm" color={textColor} mt={4}>
              Explore more features through the navigation menu above.
            </Text>
          </Box>
          <Box>
            <Image
              src={hero_cbt}
              alt="CBT Hero"
              boxSize={{ base: "300px", md: "500px" }}
              objectFit="cover"
              borderRadius="lg"
              filter={whiteGlow}
            />
          </Box>
        </Flex>

        {/* Conditionally render Statistics only for admin */}
        {userRole === "admin" && <Statistics />}
      </Box>
    </Box>
  );
}

export default Dashboard;
