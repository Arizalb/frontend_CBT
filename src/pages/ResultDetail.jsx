import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Divider, Badge } from "@chakra-ui/react";
import { getResultById } from "../services/resultServices";
import { getExamById } from "../services/examService";

function ResultDetail() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getResultById(resultId);
        setResult(res);
        const examData = await getExamById(res.examId);
        setExam(examData);
      } catch (err) {
        console.error("Error fetching result detail:", err);
        setResult(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [resultId]);

  if (!loading && result === null) {
    return (
      <Box textAlign="center" mt={10}>
        <Text color="red.400">
          Hasil ujian tidak ditemukan atau terjadi kesalahan.
        </Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box
      maxW="700px"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
    >
      <Heading size="lg" mb={4}>
        Detail Hasil Ujian
      </Heading>
      <Text fontWeight="bold" mb={2}>
        Ujian: {exam.title}
      </Text>
      <Text mb={2}>Nama Siswa: {result.studentName || result.studentId}</Text>
      <Text mb={2}>
        Tanggal Submit: {new Date(result.submittedAt).toLocaleString()}
      </Text>
      <Divider my={4} />
      {result.answers.map((answer, idx) => {
        const question = exam.questions.find(
          (q) => q._id === answer.questionId
        );
        if (!question) return null;
        return (
          <Box
            key={answer.questionId}
            mb={4}
            p={3}
            borderWidth="1px"
            borderRadius="md"
          >
            <Text fontWeight="bold">
              {idx + 1}. {question.questionText}
            </Text>
            {answer.type === "multiple_choice" ? (
              <>
                <Text>
                  Jawaban Siswa:{" "}
                  <Badge
                    colorScheme={
                      answer.selectedAnswer === question.correctAnswer
                        ? "green"
                        : "red"
                    }
                  >
                    {answer.selectedAnswer}
                  </Badge>
                </Text>
                <Text>
                  Jawaban Benar:{" "}
                  <Badge colorScheme="green">{question.correctAnswer}</Badge>
                </Text>
              </>
            ) : (
              <>
                <Text>Jawaban Essay: {answer.essayAnswer}</Text>
                <Text>
                  Nilai:{" "}
                  <Badge colorScheme="blue">
                    {answer.marksObtained ?? "-"}
                  </Badge>
                </Text>
              </>
            )}
          </Box>
        );
      })}
      <Divider my={4} />
      <Text fontWeight="bold" color="teal.500">
        Total Nilai: {result.totalMarksObtained}
      </Text>
    </Box>
  );
}

export default ResultDetail;
