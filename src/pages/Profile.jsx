import { useEffect, useState } from "react";
import { getUserProfile } from "../services/authService";
import { Box, Heading, Text, Spinner, Center } from "@chakra-ui/react";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <Center h="100vh">
        {" "}
        {/* Menggunakan Center untuk memposisikan di tengah */}
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={6} maxW="800px" mx="auto" mt={12} minH={"100vh"}>
      <Heading as="h2" mb={6}>
        Profil
      </Heading>
      <Text>Nama: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Role: {user.role}</Text>
    </Box>
  );
}

export default Profile;
