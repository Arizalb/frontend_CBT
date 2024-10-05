import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Flex,
  Icon,
  Box as ChakraBox,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { getCompletedExams } from "../services/resultServices"; // Import fungsi getCompletedExams

function MyResults() {
  const [completedExams, setCompletedExams] = useState([]); // Ini hanya untuk ID ujian
  const [examNames, setExamNames] = useState([]); // Ini untuk nama ujian
  const [loading, setLoading] = useState(true);

  // Call all necessary hooks at the top level
  useEffect(() => {
    const fetchCompletedExams = async () => {
      try {
        const uniqueExamIds = await getCompletedExams(); // Panggil fungsi getCompletedExams
        setCompletedExams(uniqueExamIds); // Simpan data ke dalam state
      } catch (error) {
        console.error("Error fetching completed exams:", error);
      }
    };

    fetchCompletedExams();
  }, []); // Hooks hanya untuk mengambil ID ujian yang sudah diselesaikan

  useEffect(() => {
    if (completedExams.length > 0) {
      const fetchExamNames = async () => {
        try {
          const names = await Promise.all(
            completedExams.map(async (examId) => {
              const token = localStorage.getItem("token"); // Ambil token dari local storage
              if (!token) {
                return "Exam Name Not Found"; // Jika token tidak ada, tampilkan pesan default
              }

              const headers = {
                Authorization: `Bearer ${token}`,
              };

              try {
                const { data } = await axios.get(
                  `https://backend-cbt.vercel.app/api/exams/${examId}`, // Gunakan examId untuk fetch nama ujian
                  { headers }
                );

                return data.title; // Kembalikan nama ujian
              } catch (error) {
                if (error.response && error.response.status === 404) {
                  return "Exam sudah dihapus"; // Pesan jika exam sudah dihapus
                } else {
                  return "Exam Name Not Found";
                }
              }
            })
          );

          setExamNames(names); // Simpan nama ujian ke dalam state
        } catch (error) {
          console.error("Error fetching exam names:", error);
        } finally {
          setLoading(false); // Selesai loading setelah fetch nama ujian
        }
      };

      fetchExamNames();
    }
  }, [completedExams]); // Hook ini akan dijalankan setelah mendapatkan ID ujian

  // Render based on loading state
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (completedExams.length === 0) {
    return (
      <ChakraBox p={4}>
        <Heading as="h2" size="lg" mb={4}>
          My Completed Exams
        </Heading>
        <Text>No exams completed yet.</Text>
      </ChakraBox>
    );
  }

  return (
    <ChakraBox p={6} maxW="1000px" mx="auto" mt={12} minH={"100vh"}>
      <Heading as="h2" size="lg" mb={4}>
        My Completed Exams
      </Heading>
      <Flex direction="column" spacing={3}>
        {completedExams.map((examId, index) => (
          <ChakraBox
            key={examId}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg={useColorModeValue("gray.100", "gray.700")}
            color={useColorModeValue("gray.800", "gray.100")}
            mb={3}
            display="flex"
            alignItems="center"
          >
            <Icon
              as={CheckCircleIcon}
              color={useColorModeValue("green.500", "green.200")}
              mr={2}
            />
            <Text fontWeight="bold">{examNames[index] || "Loading..."}</Text>
          </ChakraBox>
        ))}
      </Flex>
    </ChakraBox>
  );
}

export default MyResults;
