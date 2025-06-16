import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Flex,
  Badge,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";
import { getExamById } from "../services/examService";
import { submitResult } from "../services/resultServices";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import { useContext } from "react";

// Custom hook untuk blokir navigasi
function useConfirmExit(when, message) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    navigator.push = (...args) => {
      if (window.confirm(message)) {
        push.apply(navigator, args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [when, message, navigator]);
}

function ExamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [examId, setExamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

  // Hanya aktif jika belum submit
  useConfirmExit(
    !isSubmitted,
    "Apakah Anda yakin ingin keluar dari halaman ujian? Jawaban Anda mungkin tidak tersimpan."
  );

  useEffect(() => {
    // Cek akses
    const allowedExamId = sessionStorage.getItem("examAccess");
    if (allowedExamId !== id) {
      navigate("/exams", { replace: true });
      return;
    }

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
        setError("Gagal mengambil detail ujian. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();

    // Proteksi ujian
    const handleCopyAttempt = (e) => {
      e.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Copy Dilarang!",
        text: "Anda tidak diperbolehkan menyalin teks selama ujian.",
        confirmButtonText: "Oke",
      });
      navigator.clipboard.writeText("");
    };
    document.body.style.userSelect = "none";
    const handlePrintScreen = (e) => {
      if (e.key === "PrintScreen") {
        Swal.fire({
          icon: "warning",
          title: "Screenshot Dilarang!",
          text: "Anda tidak diperbolehkan mengambil screenshot selama ujian.",
          confirmButtonText: "Mengerti",
        });
        navigator.clipboard.writeText("");
      }
    };
    const handleRightClick = (e) => {
      e.preventDefault();
      Swal.fire({
        icon: "error",
        title: "Klik Kanan Dilarang!",
        text: "Anda tidak diperbolehkan menggunakan klik kanan selama ujian.",
        confirmButtonText: "Oke",
      });
    };
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
    document.addEventListener("keydown", handlePrintScreen);
    document.addEventListener("keydown", handleKeyCombination);
    document.addEventListener("copy", handleCopyAttempt);
    document.addEventListener("contextmenu", handleRightClick);

    // Konfirmasi sebelum keluar/refresh/tab close
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.body.style.userSelect = "auto";
      document.removeEventListener("keydown", handlePrintScreen);
      document.removeEventListener("keydown", handleKeyCombination);
      document.removeEventListener("copy", handleCopyAttempt);
      document.removeEventListener("contextmenu", handleRightClick);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id, navigate, isSubmitted]);

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
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

      // Validasi: pastikan semua pertanyaan sudah dijawab
      const unansweredQuestions = exam.questions.filter((question) => {
        const answer = answers[question._id];
        if (question.type === "multiple_choice") {
          return !answer || !answer.selectedAnswer;
        }
        if (question.type === "essay") {
          return !answer || !answer.essayAnswer;
        }
        return false;
      });

      if (unansweredQuestions.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Jawaban Belum Lengkap",
          text: "Anda harus menjawab semua pertanyaan sebelum mengirim.",
          confirmButtonText: "Oke",
        });
        return;
      }

      await submitResult(examId, payload);
      setIsSubmitted(true);
      toast({ title: "Jawaban terkirim!", status: "success" });
      navigate("/my-results");
    } catch (error) {
      toast({
        title: "Gagal mengirim jawaban / Anda sudah submit",
        status: "error",
      });
    }
  };

  // UI
  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("teal.100", "teal.700");
  const accent = useColorModeValue("teal.500", "teal.300");

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

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <Box p={6} maxW="700px" mx="auto" mt={12} minH={"100vh"}>
      <VStack spacing={2} align="start" mb={4}>
        <Badge
          colorScheme="teal"
          fontSize="1em"
          px={3}
          py={1}
          borderRadius="full"
        >
          Ujian Online
        </Badge>
        <Heading fontSize={{ base: "2xl", md: "3xl" }} color={accent}>
          {exam.title}
        </Heading>
        <Text color="gray.500">{exam.description}</Text>
      </VStack>
      <Progress
        value={((currentQuestionIndex + 1) / exam.questions.length) * 100}
        colorScheme="teal"
        size="sm"
        borderRadius="md"
        mb={6}
      />

      <Box
        p={6}
        borderWidth="2px"
        borderRadius="xl"
        borderColor={cardBorder}
        bg={cardBg}
        shadow="md"
        mb={4}
        transition="all 0.2s"
      >
        <Flex align="center" mb={4}>
          <Badge colorScheme="purple" borderRadius="full" px={3} py={1} mr={3}>
            Soal {currentQuestionIndex + 1} / {exam.questions.length}
          </Badge>
          <Text fontWeight="bold" fontSize="lg">
            {currentQuestion.questionText}
          </Text>
        </Flex>

        {currentQuestion.type === "multiple_choice" && (
          <RadioGroup
            onChange={(value) =>
              handleAnswerChange(
                currentQuestion._id,
                value,
                currentQuestion.type
              )
            }
            value={answers[currentQuestion._id]?.selectedAnswer || ""}
          >
            <Stack spacing={3} direction="column">
              {currentQuestion.options.map((option, idx) => (
                <Radio
                  key={idx}
                  value={option}
                  colorScheme="teal"
                  borderColor={accent}
                  fontWeight="medium"
                >
                  {option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        )}

        {currentQuestion.type === "essay" && (
          <Textarea
            placeholder="Tulis jawaban esai Anda..."
            value={answers[currentQuestion._id]?.essayAnswer || ""}
            onChange={(e) =>
              handleAnswerChange(
                currentQuestion._id,
                e.target.value,
                currentQuestion.type
              )
            }
            bg={useColorModeValue("gray.50", "gray.800")}
            borderColor={accent}
            mt={2}
          />
        )}
      </Box>

      <Flex justifyContent="space-between" mt={6}>
        <Button
          onClick={handlePreviousQuestion}
          isDisabled={currentQuestionIndex === 0}
          variant="outline"
          colorScheme="teal"
        >
          Sebelumnya
        </Button>
        {currentQuestionIndex === exam.questions.length - 1 ? (
          <Button colorScheme="teal" onClick={handleSubmit} fontWeight="bold">
            Kirim Jawaban
          </Button>
        ) : (
          <Button
            colorScheme="teal"
            onClick={handleNextQuestion}
            fontWeight="bold"
          >
            Berikutnya
          </Button>
        )}
      </Flex>
    </Box>
  );
}

export default ExamDetails;
