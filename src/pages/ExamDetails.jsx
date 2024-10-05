import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getExamById } from "../services/examService";
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  RadioGroup,
  Radio,
  Stack,
  Textarea,
  Button,
  useToast,
  Spinner,
  useColorMode,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { submitResult } from "../services/resultServices";

function ExamDetails() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [examId, setExamId] = useState(null); // Inisialisasi state untuk examId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({}); // Inisialisasi state untuk jawaban
  const toast = useToast();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await getExamById(id); // Ambil detail ujian

        // Perbaikan: langsung gunakan response, tidak perlu memeriksa response.exam
        if (response) {
          setExam(response); // Simpan detail ujian langsung dari response
          setExamId(response._id); // Simpan examId langsung dari response
        } else {
          throw new Error("Exam data not found");
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setError("Gagal mengambil detail ujian. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  const handleAnswerChange = (questionId, value, type) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        questionId,
        type,
        ...(type === "multiple_choice" && { selectedAnswer: value }),
        ...(type === "essay" && { essayAnswer: value }),
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const studentId = localStorage.getItem("studentId"); // Ambil ID siswa dari localStorage
      const payload = {
        examId,
        studentId,
        answers: Object.values(answers), // Ubah objek jawaban menjadi array
      };

      // Pastikan `examId` tidak null atau undefined
      if (!examId) {
        throw new Error("Exam ID is missing");
      }

      await submitResult(examId, payload); // Kirim hasil ujian dengan examId
      toast({ title: "Jawaban terkirim!", status: "success" });
    } catch (error) {
      console.error("Error submitting exam results:", error);
      toast({
        title: "Gagal mengirim jawaban / Anda sudah submit",
        status: "error",
      });
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Box p={6} maxW="800px" mx="auto" mt={12}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="800px" mx="auto" mt={12}>
      <Heading mb={4}>{exam.title}</Heading>
      <Text mb={4}>{exam.description}</Text>
      <Divider mb={4} />
      <Heading size="md" mb={4}>
        Pertanyaan
      </Heading>

      <VStack spacing={6} align="stretch">
        {exam.questions.map((question, index) => (
          <Box
            key={question._id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg={useColorModeValue("gray.300", "gray.700")}
          >
            <Text mb={4}>
              <strong>{index + 1}.</strong> {question.questionText}
            </Text>

            {question.type === "multiple_choice" && (
              <RadioGroup
                onChange={(value) =>
                  handleAnswerChange(question._id, value, question.type)
                }
                value={answers[question._id]?.selectedAnswer || ""}
              >
                <Stack spacing={3} direction="column">
                  {question.options.map((option, idx) => (
                    <Radio key={idx} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}

            {question.type === "essay" && (
              <Textarea
                placeholder="Tulis jawaban esai Anda..."
                value={answers[question._id]?.essayAnswer || ""}
                onChange={(e) =>
                  handleAnswerChange(
                    question._id,
                    e.target.value,
                    question.type
                  )
                }
              />
            )}
          </Box>
        ))}
      </VStack>

      <Button colorScheme="teal" mt={6} onClick={handleSubmit}>
        Kirim Jawaban
      </Button>
    </Box>
  );
}

export default ExamDetails;
