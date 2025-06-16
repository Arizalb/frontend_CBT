import { useEffect, useState } from "react";
import { getUserProfile } from "../services/authService";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  Avatar,
  VStack,
  HStack,
  Icon,
  Badge,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEnvelope, FaUserShield, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Warna dinamis
  const cardBg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const accent = useColorModeValue("purple.400", "purple.300");

  useEffect(() => {
    const cachedProfile = sessionStorage.getItem("userProfile");
    if (cachedProfile) {
      setUser(JSON.parse(cachedProfile));
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        sessionStorage.setItem("userProfile", JSON.stringify(data));
      } catch (error) {
        console.error("Gagal mendapatkan profil pengguna", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Center h="100vh" mx="auto" my={12}>
        <Spinner size="xl" color="teal.400" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center h="100vh" mx="auto" my={12}>
        <Text>Data profil tidak ditemukan.</Text>
      </Center>
    );
  }

  return (
    <Box
      minH="100vh"
      px={2}
      py={8}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="full"
        maxW="420px"
        mx="auto"
        bg={cardBg}
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        border={`1px solid ${border}`}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <Stack
          direction="row"
          align="center"
          justify="center"
          mb={4}
          spacing={2}
        >
          <Icon as={FaUserCircle} color={accent} boxSize={7} />
          <Badge
            colorScheme="teal"
            fontSize="1em"
            px={3}
            py={1}
            borderRadius="full"
          >
            Profile
          </Badge>
        </Stack>
        <Heading
          mb={2}
          fontSize={{ base: "2xl", md: "3xl" }}
          color={useColorModeValue("teal.600", "teal.300")}
          fontWeight="extrabold"
          letterSpacing="tight"
          lineHeight="shorter"
        >
          My Profile
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color={textColor} mb={6}>
          Informasi akun CBT kamu.
        </Text>
        <Avatar
          size="xl"
          name={user.name}
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          mb={4}
          border="3px solid white"
          boxShadow="0px 0px 20px rgba(255, 255, 255, 0.4)"
          mx="auto"
        />
        <VStack spacing={4} align="center" mb={2}>
          <Text
            fontWeight="bold"
            fontSize="xl"
            color={textColor}
            letterSpacing="tight"
          >
            {user.name}
          </Text>
          <HStack>
            <Icon as={FaEnvelope} color="blue.300" />
            <Text fontSize="md" color={textColor}>
              {user.email}
            </Text>
          </HStack>
          <HStack>
            <Icon as={FaUserShield} color="purple.300" />
            <Text fontSize="md" color={textColor}>
              {user.role}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

export default Profile;
