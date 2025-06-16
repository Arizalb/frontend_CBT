import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Icon,
  Badge,
  SimpleGrid,
  Image,
  useColorModeValue,
  Divider,
  List,
  ListItem,
  ListIcon,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaChartBar,
  FaRocket,
  FaLightbulb,
  FaQuestionCircle,
  FaCheckCircle,
  FaTrophy,
  FaBookOpen,
  FaUsers,
} from "react-icons/fa";
import hero_cbt from "../utils/ontest_logo.png";
import Statistics from "../components/Statistics";
import { getUserProfile } from "../services/authService";
import Quotes from "../components/Quotes";
import InfoCBT from "../components/InfoCBT";

// Komponen baru: Fitur CBT
function CBTFeatures() {
  const featureBg = useColorModeValue("teal.50", "gray.700");
  const featureText = useColorModeValue("gray.600", "gray.200");
  return (
    <Box w="full" mt={12} mb={12} px={{ base: 0, md: 8 }}>
      <Heading
        size="md"
        color="purple.500"
        mb={6}
        display="flex"
        alignItems="center"
      >
        <Icon as={FaBookOpen} mr={2} /> Fitur Unggulan CBT OnTest
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
        <Box bg={featureBg} borderRadius="lg" p={5}>
          <Icon as={FaTrophy} color="teal.400" boxSize={7} mb={2} />
          <Text fontWeight="bold" mb={1}>
            Penilaian Otomatis
          </Text>
          <Text fontSize="sm" color={featureText}>
            Hasil ujian langsung keluar, tanpa menunggu lama.
          </Text>
        </Box>
        <Box bg={featureBg} borderRadius="lg" p={5}>
          <Icon as={FaUsers} color="teal.400" boxSize={7} mb={2} />
          <Text fontWeight="bold" mb={1}>
            Multi-Device
          </Text>
          <Text fontSize="sm" color={featureText}>
            Bisa diakses dari laptop, tablet, maupun smartphone.
          </Text>
        </Box>
        <Box bg={featureBg} borderRadius="lg" p={5}>
          <Icon as={FaBookOpen} color="teal.400" boxSize={7} mb={2} />
          <Text fontWeight="bold" mb={1}>
            Bank Soal Dinamis
          </Text>
          <Text fontSize="sm" color={featureText}>
            Soal diacak otomatis, mengurangi kecurangan.
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

// Komponen baru: Testimoni
function Testimonials() {
  const testiBg = useColorModeValue("gray.50", "gray.700");
  const testiText = useColorModeValue("gray.700", "gray.200");
  const testiName = useColorModeValue("teal.600", "teal.300");
  return (
    <Box w="full" mt={12} mb={12} px={{ base: 0, md: 8 }}>
      <Heading
        size="md"
        color="teal.500"
        mb={6}
        display="flex"
        alignItems="center"
      >
        <Icon as={FaUsers} mr={2} /> Testimoni Pengguna
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Box bg={testiBg} borderRadius="lg" p={5}>
          <Text fontStyle="italic" color={testiText}>
            "CBT OnTest sangat membantu proses ujian di sekolah kami. Siswa jadi
            lebih semangat!"
          </Text>
          <Text fontWeight="bold" color={testiName} mt={2}>
            — Ibu Sari, Guru SMP
          </Text>
        </Box>
        <Box bg={testiBg} borderRadius="lg" p={5}>
          <Text fontStyle="italic" color={testiText}>
            "Saya suka karena hasil ujian langsung keluar. Tidak perlu menunggu
            lama!"
          </Text>
          <Text fontWeight="bold" color={testiName} mt={2}>
            — Raka, Siswa SMA
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

function Dashboard() {
  const [userRole, setUserRole] = useState(null);

  // Warna dinamis
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const buttonBg = useColorModeValue("teal.400", "teal.600");
  const buttonHoverBg = useColorModeValue("teal.500", "teal.700");
  const accent = useColorModeValue("purple.400", "purple.300");
  const infoCBTBg = useColorModeValue("purple.50", "gray.700");
  const infoCBTText = useColorModeValue("purple.800", "purple.100");

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const profile = await getUserProfile();
        setUserRole(profile.role);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }
    fetchUserProfile();
  }, []);

  return (
    <Box p={6} maxW="1000px" mx="auto" mt={12} minH={"100vh"}>
      {/* Section 1: Welcome */}
      <Box
        w="full"
        maxW="900px"
        mx="auto"
        mb={12}
        px={{ base: 2, md: 6 }}
        textAlign="center"
      >
        <Stack
          direction="row"
          align="center"
          justify="center"
          mb={2}
          spacing={2}
        >
          <Icon as={FaRocket} color={accent} boxSize={7} />
          <Badge
            colorScheme="teal"
            fontSize="1em"
            px={3}
            py={1}
            borderRadius="full"
          >
            Welcome Back!
          </Badge>
        </Stack>
        <Heading
          mb={3}
          fontSize={{ base: "2xl", md: "4xl" }}
          color={headingColor}
          fontWeight="extrabold"
          letterSpacing="tight"
          lineHeight="shorter"
        >
          CBT OnTest Dashboard
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color={textColor} mb={2}>
          Manage your exams, track your results, and update your profile.
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} color={textColor} mb={6}>
          <b>Everything you need in one playful dashboard!</b>
        </Text>
        <Stack
          direction={{ base: "column", sm: "row" }}
          spacing={4}
          justify="center"
          mb={2}
        >
          <Button
            as={Link}
            to="/profile"
            leftIcon={<FaUserCircle />}
            bg={buttonBg}
            color="white"
            size="lg"
            _hover={{ bg: buttonHoverBg }}
            shadow="md"
          >
            View Profile
          </Button>
          <Button
            as={Link}
            to={userRole === "admin" ? "/manage" : "/exams"}
            leftIcon={<FaChartBar />}
            bg={accent}
            color="white"
            size="lg"
            _hover={{ bg: "purple.500" }}
            shadow="md"
          >
            {userRole === "admin" ? "Manage Exams" : "View Exams"}
          </Button>
        </Stack>
      </Box>

      {/* Section 2: InfoCBT dan Logo */}
      <SimpleGrid
        columns={{ base: 1, md: 4 }}
        spacing={8}
        maxW="1000px"
        mx="auto"
        mb={12}
        px={{ base: 2, md: 6 }}
      >
        {/* Logo mengambil 1/4 lebar grid */}
        <Flex
          align="center"
          justify="center"
          gridColumn={{ base: "auto", md: "span 1" }}
          h="100%"
        >
          <Box
            borderRadius="full"
            p={3}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            w={{ base: "120px", md: "140px" }}
            h={{ base: "120px", md: "140px" }}
          >
            <Image
              src={hero_cbt}
              alt="CBT Hero"
              boxSize={{ base: "80px", md: "100px" }}
              objectFit="contain"
              style={{
                filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.18))",
              }}
            />
          </Box>
        </Flex>
        {/* InfoCBT mengambil 3/4 lebar grid */}
        <Box
          as="section"
          gridColumn={{ base: "auto", md: "span 3" }}
          display="flex"
          alignItems="stretch"
        >
          <InfoCBT />
        </Box>
      </SimpleGrid>

      <Divider my={8} />

      <CBTFeatures />

      <Divider my={8} />

      {/* Section: Tips Sukses CBT */}
      <Box mb={12} px={{ base: 0, md: 8 }}>
        <Heading
          size="md"
          color={accent}
          mb={4}
          display="flex"
          alignItems="center"
        >
          <Icon as={FaLightbulb} mr={2} /> Tips Sukses CBT
        </Heading>
        <List spacing={3} color={textColor}>
          <ListItem>
            <ListIcon as={FaCheckCircle} color="teal.400" />
            Pastikan koneksi internet stabil sebelum ujian.
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheckCircle} color="teal.400" />
            Baca instruksi soal dengan teliti.
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheckCircle} color="teal.400" />
            Jangan lupa cek waktu pengerjaan secara berkala.
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheckCircle} color="teal.400" />
            Siapkan alat tulis jika diperlukan untuk coret-coret.
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheckCircle} color="teal.400" />
            Tetap tenang dan percaya diri!
          </ListItem>
        </List>
      </Box>

      <Divider my={8} />

      <Testimonials />

      <Divider my={8} />

      {/* Section: Info Bantuan */}
      <Box mb={12} px={{ base: 0, md: 8 }}>
        <Heading
          size="md"
          color={accent}
          mb={4}
          display="flex"
          alignItems="center"
        >
          <Icon as={FaQuestionCircle} mr={2} /> Bantuan & Kontak
        </Heading>
        <Text color={textColor} mb={2}>
          Jika mengalami kendala teknis atau butuh bantuan, silakan hubungi
          admin CBT:
        </Text>
        <Text fontWeight="bold" color="teal.600">
          Email: admin@cbt-ontest.com
        </Text>
        <Text fontWeight="bold" color="teal.600">
          WhatsApp: 0812-3456-7890
        </Text>
      </Box>

      <Divider my={8} />

      {/* Section: Quotes */}
      <Box mb={12} px={{ base: 0, md: 8 }}>
        <Quotes />
      </Box>

      {/* Conditionally render Statistics only for admin */}
      {userRole === "admin" && (
        <Box mt={12}>
          <Statistics />
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
