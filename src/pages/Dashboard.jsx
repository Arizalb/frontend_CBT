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
import hero_cbt from "../utils/hero_cbt.png"; // Import hero image from utils

function Dashboard() {
  // Menggunakan useColorModeValue untuk mendukung dark mode
  const bg = useColorModeValue("gray.50", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const buttonBg = useColorModeValue("gray.200", "gray.700");
  const buttonHoverBg = useColorModeValue("gray.300", "gray.600");

  return (
    <Box minH={"100vh"}>
      <Box
        p={6}
        maxW="1200px"
        mx="auto"
        mt={12}
        bg={bg}
        borderRadius="lg"
        shadow="md"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
        >
          {/* Left Side: Text and Buttons */}
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
              Welcome to the CBT Dashboard
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color={textColor} mb={6}>
              Manage your exams, track your results, or update your profile.
              Everything you need in one place.
            </Text>
            {/* Hanya tombol View Profile */}
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

          {/* Right Side: Hero Image */}
          <Box>
            <Image
              src={hero_cbt}
              alt="CBT Hero"
              boxSize={{ base: "300px", md: "500px" }}
              objectFit="cover"
              borderRadius="lg"
              shadow="lg"
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default Dashboard;
