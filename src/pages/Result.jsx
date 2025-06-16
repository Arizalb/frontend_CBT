import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Badge,
  Divider,
  VStack,
  Button,
} from "@chakra-ui/react";
import axios from "axios";

function Results() {
  const { examId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResultDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/results/student/${examId}/detail`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResult(data);
      } catch (error) {
        setResult(null);
      } finally {
        setLoading(false);
      }
    };
    if (examId) fetchResultDetail();
  }, [examId]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!result) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="red.400">Gagal memuat hasil ujian.</Text>
        <Button mt={4} onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="800px" mx="auto" mt={12}>
      <Heading as="h2" mb={6}>
        Detail Jawaban Ujian
      </Heading>
      <Text mb={2}>
        <b>Tanggal Submit:</b> {new Date(result.submittedAt).toLocaleString()}
      </Text>
      <Text mb={4}>
        <b>Total Nilai:</b> {result.totalMarksObtained}
      </Text>
      <Divider mb={4} />
      <VStack spacing={6} align="stretch">
        {result.answers.map((answer, idx) => (
          <Box
            key={answer.questionId || idx}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
          >
            <Text fontWeight="bold" mb={2}>
              {idx + 1}. {answer.questionText || "Soal Essay"}
            </Text>

            {answer.type === "multiple_choice" ? (
              <>
                <Text>
                  Jawaban Anda:{" "}
                  <Badge
                    colorScheme={answer.isCorrect ? "green" : "red"}
                    fontSize="1em"
                    mr={2}
                  >
                    {answer.selectedAnswer !== undefined
                      ? answer.selectedAnswer
                      : "Tidak dijawab"}
                  </Badge>
                  <Badge colorScheme={answer.isCorrect ? "green" : "red"}>
                    {answer.isCorrect ? "Benar" : "Salah"}
                  </Badge>
                </Text>
              </>
            ) : (
              <>
                <Text>
                  Jawaban Essay: {answer.essayAnswer || "Tidak dijawab"}
                </Text>
                <Text>
                  Nilai:{" "}
                  <Badge colorScheme="blue">
                    {answer.marksObtained ?? "-"}
                  </Badge>
                </Text>
              </>
            )}
          </Box>
        ))}
      </VStack>
      <Button mt={8} colorScheme="teal" onClick={() => navigate(-1)}>
        Kembali ke Daftar Ujian
      </Button>
    </Box>
  );
}

export default Results;
