import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Spinner,
  Divider,
  Input,
  Button,
  Badge,
  useColorModeValue,
  Center, // Added Center for spinner
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  getResults,
  gradeEssayAnswers,
  finalizeGrades,
} from "../services/resultServices";
import { getExamById } from "../services/examService";
import { getUserById } from "../services/userService";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [essayGrades, setEssayGrades] = useState({});
  const [finalizedResultId, setFinalizedResultId] = useState(null);

  // Fetch results
  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await getResults();

      const resultsWithNames = await Promise.all(
        data.map(async (result) => {
          try {
            const exam = await getExamById(result.examId);
            const student = await getUserById(result.studentId);

            return {
              ...result,
              examName: exam.title,
              studentName: student.name,
              questions: exam.questions,
            };
          } catch (error) {
            // Jika exam tidak ditemukan (404), tampilkan placeholder
            console.error(
              `Error fetching exam for result ${result._id}:`,
              error
            );
            return {
              ...result,
              examName: "Exam tidak ditemukan",
              studentName: result.studentName || "Unknown",
              questions: [],
            };
          }
        })
      );

      setResults(resultsWithNames);
    } catch (error) {
      console.error("Error fetching results:", error);
      // Anda bisa menambahkan toast di sini juga jika diperlukan
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const checkAnswer = (selectedAnswer, correctAnswer, options) => {
    // Memastikan correctAnswer adalah huruf (A, B, C, D)
    if (
      typeof correctAnswer === "string" &&
      correctAnswer.length === 1 &&
      ["A", "B", "C", "D"].includes(correctAnswer.toUpperCase())
    ) {
      const correctIndex = ["A", "B", "C", "D"].indexOf(
        correctAnswer.toUpperCase()
      );
      // Jika selectedAnswer adalah nilai opsi itu sendiri, bandingkan langsung
      // Jika selectedAnswer adalah huruf (A, B, C, D), bandingkan dengan correctAnswer
      return (
        selectedAnswer === correctAnswer ||
        options[correctIndex] === selectedAnswer
      );
    }
    // Fallback jika correctAnswer bukan A,B,C,D (misal untuk kasus essay yang tidak ada options)
    return selectedAnswer === correctAnswer;
  };

  const handleGradeChange = (resultId, questionId, grade) => {
    setEssayGrades((prevGrades) => ({
      ...prevGrades,
      [`${resultId}-${questionId}`]: grade,
    }));
  };

  const handleGradeSubmit = async (resultId, questionId) => {
    const grade = essayGrades[`${resultId}-${questionId}`];

    if (!grade || isNaN(Number(grade))) {
      // Pastikan grade adalah angka
      Swal.fire("Error", "Please enter a valid number for the grade", "error");
      return;
    }

    // Temukan index dari answer yang sesuai questionId
    const resultIndex = results.findIndex((r) => r._id === resultId);
    const result = results[resultIndex];
    const answerIndex = result.answers.findIndex(
      (ans) => ans.questionId === questionId
    );

    if (answerIndex === -1) {
      Swal.fire("Error", "Question not found in answers", "error");
      return;
    }

    try {
      await gradeEssayAnswers(resultId, {
        questionIndex: answerIndex,
        grade: Number(grade),
      });

      // Update marksObtained di state lokal agar tombol finalisasi aktif
      setResults((prevResults) => {
        const updated = [...prevResults];
        const updatedResult = { ...updated[resultIndex] };
        updatedResult.answers = [...updatedResult.answers];
        updatedResult.answers[answerIndex] = {
          ...updatedResult.answers[answerIndex],
          marksObtained: Number(grade),
        };
        // Perbarui totalMarksObtained secara dinamis setelah grading
        updatedResult.totalMarksObtained = updatedResult.answers.reduce(
          (sum, ans) => {
            const q = updatedResult.questions.find(
              (qItem) => qItem._id === ans.questionId
            );
            if (q && q.type === "multiple_choice") {
              // Untuk pilihan ganda, nilai sudah ditentukan oleh backend
              return sum + (ans.marksObtained || 0);
            } else if (q && q.type === "essay") {
              // Untuk essay, gunakan marksObtained dari grading
              return sum + (ans.marksObtained || 0);
            }
            return sum;
          },
          0
        );

        updated[resultIndex] = updatedResult;
        return updated;
      });

      Swal.fire("Success", "Essay graded successfully!", "success");
    } catch (error) {
      console.error("Error grading essay:", error);
      Swal.fire("Error", "Failed to submit the grade.", "error");
    }
  };

  const handleFinalize = async (resultId) => {
    try {
      await finalizeGrades(resultId);
      Swal.fire(
        "Success",
        "Finalization complete! Grades are now locked.",
        "success"
      );
      setFinalizedResultId(resultId); // Tandai sudah finalisasi
      fetchResults(); // Update data dari backend
    } catch (error) {
      console.error("Error finalizing grades:", error);
      Swal.fire(
        "Error",
        "Failed to finalize grades. Pastikan semua essay sudah dinilai.",
        "error"
      );
    }
  };

  const isAllEssayGraded = (result) => {
    if (!result.answers || !result.questions) return true;
    return result.answers.every((answer) => {
      const question = result.questions.find(
        (q) => q._id === answer.questionId
      );
      if (!question) return true;
      if (question.type === "essay") {
        // Cek marksObtained harus ada dan angka
        return typeof answer.marksObtained === "number";
      }
      return true;
    });
  };

  if (loading) {
    return (
      <Center h="100vh">
        {" "}
        {/* Use Center for full height centering */}
        <Spinner size="lg" />
        <Text mt={2}>Memuat Hasil...</Text>
      </Center>
    );
  }

  return (
    <VStack spacing={6} marginY={6} px={4} maxW="1000px" mx="auto">
      {" "}
      {/* Added padding and max width */}
      <Button
        leftIcon={<RepeatIcon />}
        colorScheme="teal"
        variant="outline"
        alignSelf="flex-end"
        onClick={fetchResults}
        mb={2}
        size="sm"
      >
        Reload Data
      </Button>
      {results.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No results found.
        </Text>
      ) : (
        results.map((result) => (
          <Box
            key={result._id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            w="100%"
            bg={useColorModeValue("white", "gray.700")} // Dynamic background
            shadow="md"
          >
            <Text
              fontSize="lg"
              fontWeight="bold"
              as={Link}
              to={`/results/${result._id}`}
              _hover={{
                boxShadow: "lg",
                cursor: "pointer",
                bg: useColorModeValue("gray.50", "gray.800"),
              }}
              transition="all 0.2s"
            >
              {result.examName}
            </Text>
            <Text>Student: {result.studentName}</Text>
            <Text>
              Submitted at:{" "}
              {new Date(result.submittedAt).toLocaleDateString() +
                " " +
                new Date(result.submittedAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
            </Text>
            <Divider my={3} />

            {/* Status Finalisasi */}
            {result.isChecked || finalizedResultId === result._id ? (
              <Badge colorScheme="green" mb={2}>
                Sudah Finalisasi
              </Badge>
            ) : null}

            {/* Tampilkan hasil dan nilai jika sudah difinalisasi */}
            {result.isChecked ? (
              <Text fontWeight="bold" color="green.500">
                Total Nilai: {result.totalMarksObtained}
              </Text>
            ) : (
              // Tampilkan form penilaian jika belum difinalisasi
              <>
                {result.answers &&
                  result.answers.map((answer, index) => {
                    const question = result.questions.find(
                      (q) => q._id === answer.questionId
                    );

                    if (!question) return null;

                    return (
                      <Box key={question._id} mb={2}>
                        <Text fontWeight="semibold">
                          Question {index + 1}: {question.questionText}
                        </Text>

                        {question.type === "multiple_choice" ? (
                          <Box pl={2}>
                            <Text>
                              Selected Answer: {answer.selectedAnswer}
                            </Text>
                            <Text>
                              Correct Answer: {question.correctAnswer}
                            </Text>
                            <Flex align="center">
                              Status:{" "}
                              {checkAnswer(
                                answer.selectedAnswer,
                                question.correctAnswer,
                                question.options
                              ) ? (
                                <Badge ml={1} colorScheme="green">
                                  Correct <CheckIcon />
                                </Badge>
                              ) : (
                                <Badge ml={1} colorScheme="red">
                                  Incorrect <CloseIcon />
                                </Badge>
                              )}
                            </Flex>
                          </Box>
                        ) : (
                          <Box pl={2}>
                            <Text>Essay Answer: {answer.essayAnswer}</Text>
                            <Text mt={1}>
                              Marks Obtained:{" "}
                              {answer.marksObtained !== undefined
                                ? answer.marksObtained
                                : "Belum dinilai"}
                            </Text>
                            <Flex mt={2} align="center">
                              <Input
                                type="number"
                                placeholder="Masukkan nilai"
                                value={
                                  essayGrades[
                                    `${result._id}-${question._id}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleGradeChange(
                                    result._id,
                                    question._id,
                                    e.target.value
                                  )
                                }
                                mr={2}
                                w="120px"
                              />
                              <Button
                                onClick={() =>
                                  handleGradeSubmit(result._id, question._id)
                                }
                                colorScheme="blue"
                                isDisabled={
                                  !essayGrades[
                                    `${result._id}-${question._id}`
                                  ] ||
                                  isNaN(
                                    Number(
                                      essayGrades[
                                        `${result._id}-${question._id}`
                                      ]
                                    )
                                  )
                                }
                              >
                                Submit Nilai
                              </Button>
                            </Flex>
                          </Box>
                        )}
                      </Box>
                    );
                  })}

                {/* Tombol finalisasi nilai */}
                <Button
                  onClick={() => handleFinalize(result._id)}
                  colorScheme="green"
                  mt={4}
                  isDisabled={!isAllEssayGraded(result)}
                >
                  Finalisasi Nilai
                </Button>
                {!isAllEssayGraded(result) && (
                  <Text fontSize="sm" color="orange.400" mt={2}>
                    Semua essay harus dinilai sebelum finalisasi.
                  </Text>
                )}
              </>
            )}
          </Box>
        ))
      )}
    </VStack>
  );
};

export default ResultsList;
