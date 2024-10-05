import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
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
  Center,
} from "@chakra-ui/react";
import { getExamById } from "../services/examService";
import { submitResult } from "../services/resultServices";

function ExamDetails() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [examId, setExamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const toast = useToast();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await getExamById(id);
        if (response) {
          setExam(response);
          setExamId(response._id);
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

    // Handle copy attempt
    const handleCopyAttempt = (e) => {
      e.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Copy Dilarang!",
        text: "Anda tidak diperbolehkan menyalin teks selama ujian.",
        confirmButtonText: "Oke",
      });
      navigator.clipboard.writeText(""); // Kosongkan clipboard
    };

    // Blokir selection agar tidak bisa menyalin teks melalui selection
    document.body.style.userSelect = "none";

    // Handle PrintScreen
    const handlePrintScreen = (e) => {
      if (e.key === "PrintScreen") {
        Swal.fire({
          icon: "warning",
          title: "Screenshot Dilarang!",
          text: "Anda tidak diperbolehkan mengambil screenshot selama ujian.",
          confirmButtonText: "Mengerti",
        });
        navigator.clipboard.writeText(""); // Kosongkan clipboard
      }
    };

    // Handle right-click
    const handleRightClick = (e) => {
      e.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Klik Kanan Dilarang!",
        text: "Anda tidak diperbolehkan menggunakan klik kanan selama ujian.",
        confirmButtonText: "Oke",
      });
    };

    // Handle key combinations for copy/paste
    const handleKeyCombination = (e) => {
      if (
        e.ctrlKey &&
        (e.key === "c" ||
          e.key === "v" ||
          e.key === "x" ||
          e.key === "s" ||
          e.key === "p")
      ) {
        e.preventDefault();
        Swal.fire({
          icon: "error",
          title: "Aksi Dilarang!",
          text: "Fungsi ini dinonaktifkan selama ujian.",
          confirmButtonText: "Oke",
        });
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handlePrintScreen);
    document.addEventListener("keydown", handleKeyCombination);
    document.addEventListener("copy", handleCopyAttempt);
    document.addEventListener("contextmenu", handleRightClick);

    // Cleanup on unmount
    return () => {
      document.body.style.userSelect = "auto"; // Kembalikan user-select normal
      document.removeEventListener("keydown", handlePrintScreen);
      document.removeEventListener("keydown", handleKeyCombination);
      document.removeEventListener("copy", handleCopyAttempt);
      document.removeEventListener("contextmenu", handleRightClick);
    };
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
      const studentId = localStorage.getItem("studentId");
      const payload = {
        examId,
        studentId,
        answers: Object.values(answers),
      };

      if (!examId) {
        throw new Error("Exam ID is missing");
      }

      await submitResult(examId, payload);
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
          <Box key={question._id} p={4} borderWidth="1px" borderRadius="md">
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
