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
  const [completedExams, setCompletedExams] = useState([]); // Untuk menyimpan ID ujian
  const [examDetails, setExamDetails] = useState([]); // Untuk menyimpan detail ujian (nama dan score)
  const [loading, setLoading] = useState(true);

  // Mengambil ID ujian yang sudah diselesaikan
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
  }, []);

  // Mengambil detail ujian berdasarkan ID ujian
  useEffect(() => {
    const fetchExamDetails = async () => {
      if (completedExams.length > 0) {
        try {
          const details = await Promise.all(
            completedExams.map(async (examId) => {
              const token = localStorage.getItem("token"); // Ambil token dari local storage
              if (!token) {
                return { title: "Exam Name Not Found", score: "N/A" }; // Jika token tidak ada
              }

              const headers = {
                Authorization: `Bearer ${token}`,
              };

              try {
                // Ambil hasil ujian terlebih dahulu
                const resultResponse = await axios.get(
                  `https://backend-cbt.vercel.app/api/results/student/${examId}`, // Endpoint untuk mengambil hasil
                  { headers }
                );

                const resultData = resultResponse.data;

                // Ambil nama ujian
                const examResponse = await axios.get(
                  `https://backend-cbt.vercel.app/api/exams/${examId}`,
                  { headers }
                );

                const examData = examResponse.data;

                return {
                  title: examData.title,
                  score: resultData.totalMarksObtained || "N/A", // Ambil totalMarksObtained dari hasil
                };
              } catch (error) {
                if (error.response && error.response.status === 404) {
                  return { title: "Exam sudah dihapus", score: "N/A" };
                } else {
                  return { title: "Exam Name Not Found", score: "N/A" };
                }
              }
            })
          );

          setExamDetails(details); // Simpan detail ujian ke dalam state
        } catch (error) {
          console.error("Error fetching exam details:", error);
        } finally {
          setLoading(false); // Selesai loading setelah fetch detail ujian
        }
      }
    };

    fetchExamDetails();
  }, [completedExams]);

  // Render berdasarkan state loading
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
        {examDetails.map((examDetail, index) => (
          <ChakraBox
            key={index}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg={useColorModeValue("gray.100", "gray.700")}
            color={useColorModeValue("gray.800", "gray.100")}
            mb={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center">
              <Icon
                as={CheckCircleIcon}
                color={useColorModeValue("green.500", "green.200")}
                mr={2}
              />
              <Text fontWeight="bold">{examDetail.title}</Text>
            </Flex>
            <Text fontWeight="bold" ml={4}>
              Score: {examDetail.score}
            </Text>
          </ChakraBox>
        ))}
      </Flex>
    </ChakraBox>
  );
}

export default MyResults;
