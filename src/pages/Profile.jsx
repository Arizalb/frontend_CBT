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
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEnvelope, FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bg = useColorModeValue("gray.50", "gray.800"); // Background utama
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.6)",
    "rgba(26, 32, 44, 0.8)"
  ); // Card transparan
  const border = useColorModeValue("rgba(0,0,0,0.2)", "rgba(255,255,255,0.2)"); // Border adaptif
  const textColor = useColorModeValue("gray.800", "gray.200"); // Warna teks
  const glowColor = useColorModeValue(
    "rgb(0, 255, 255)",
    "rgba(255,0,127,0.6)"
  ); // Warna Aurora

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mendapatkan profil pengguna", error);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Center h="100vh" bg={bg} mx="auto" my={12}>
        <Spinner size="xl" color="teal.400" />
      </Center>
    );
  }

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      minH="100vh"
      display="flex"
      mx="auto"
      my={12}
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      bg={bg}
    >
      {/* Aurora Background */}
      <Box position="absolute" w="full" h="full" zIndex="-1">
        <motion.div
          animate={{
            opacity: [0.6, 1, 0.6],
            x: [-80, 80, -80],
            y: [-60, 60, -60],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            background: `radial-gradient(circle, ${glowColor} 10%, transparent 70%)`,
            filter: "blur(120px)",
            top: "15%",
            left: "15%",
          }}
        ></motion.div>

        <motion.div
          animate={{
            opacity: [0.3, 0.8, 0.3],
            x: [60, -60, 60],
            y: [80, -80, 80],
            rotate: [360, 240, 120, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            background: `radial-gradient(circle, ${glowColor} 20%, transparent 80%)`,
            filter: "blur(100px)",
            bottom: "10%",
            right: "15%",
          }}
        ></motion.div>
      </Box>

      {/* Card Profile */}
      <Box
        as={motion.div}
        whileHover={{
          scale: 1.05,
          boxShadow: `0px 0px 30px ${glowColor}`,
        }}
        maxW="450px"
        w="full"
        bg={cardBg}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        textAlign="center"
        backdropFilter="blur(15px)"
        border={`1px solid ${border}`}
        position="relative"
        overflow="hidden"
      >
        {/* Glow effect inside card */}
        <motion.div
          animate={{
            x: ["-100%", "100%"],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: "-50%",
            width: "200%",
            height: "100%",
            background: `linear-gradient(45deg, ${glowColor}, rgba(0, 0, 0, 0))`,
            filter: "blur(20px)",
          }}
        ></motion.div>

        {/* Avatar */}
        <Avatar
          size="xl"
          name={user.name}
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          mb={4}
          border="3px solid white"
          boxShadow="0px 0px 20px rgba(255, 255, 255, 0.4)"
        />

        {/* Nama */}
        <Heading
          as="h2"
          size="lg"
          mb={2}
          color={textColor}
          textShadow="2px 2px 5px rgba(0,0,0,0.4)"
        >
          {user.name}
        </Heading>

        <VStack spacing={3} align="center">
          <HStack>
            <Icon as={FaEnvelope} color="blue.300" />
            <Text
              fontSize="md"
              fontWeight="medium"
              color={textColor}
              textShadow="1px 1px 5px rgba(0,0,0,0.3)"
            >
              {user.email}
            </Text>
          </HStack>

          <HStack>
            <Icon as={FaUserShield} color="purple.300" />
            <Text
              fontSize="md"
              fontWeight="medium"
              color={textColor}
              textShadow="1px 1px 5px rgba(0,0,0,0.3)"
            >
              {user.role}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

export default Profile;
