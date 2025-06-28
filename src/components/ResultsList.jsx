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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const checkAnswer = (selectedAnswer, correctAnswer, options) => {
    const correctIndex = ["A", "B", "C", "D"].indexOf(correctAnswer);
    return (
      selectedAnswer === correctAnswer ||
      options[correctIndex] === selectedAnswer
    );
  };

  const handleGradeChange = (resultId, questionId, grade) => {
    setEssayGrades((prevGrades) => ({
      ...prevGrades,
      [`${resultId}-${questionId}`]: grade,
    }));
  };

  const handleGradeSubmit = async (resultId, questionId) => {
    const grade = essayGrades[`${resultId}-${questionId}`];

    if (!grade) return Swal.fire("Error", "Please enter a grade", "error");

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
      <Box textAlign="center" mt={6}>
        <Spinner size="lg" />
        <Text mt={2}>Memuat Hasil...</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} marginY={6}>
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
      {results.map((result) => (
        <Box
          key={result._id}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          w="100%"
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
            Submitted at: {new Date(result.submittedAt).toLocaleString()}
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
                      <Text>
                        Question {index + 1}: {question.questionText}
                      </Text>

                      {question.type === "multiple_choice" ? (
                        <Text>
                          Selected Answer: {answer.selectedAnswer}{" "}
                          {checkAnswer(
                            answer.selectedAnswer,
                            question.correctAnswer,
                            question.options
                          ) ? (
                            <CheckIcon color="green.500" />
                          ) : (
                            <CloseIcon color="red.500" />
                          )}
                        </Text>
                      ) : (
                        <Box>
                          <Text>Essay Answer: {answer.essayAnswer}</Text>

                          <Input
                            type="number"
                            placeholder="Masukkan nilai"
                            value={
                              essayGrades[`${result._id}-${question._id}`] || ""
                            }
                            onChange={(e) =>
                              handleGradeChange(
                                result._id,
                                question._id,
                                e.target.value
                              )
                            }
                            mb={2}
                          />
                          <Button
                            onClick={() =>
                              handleGradeSubmit(result._id, question._id)
                            }
                            colorScheme="blue"
                            isDisabled={
                              !essayGrades[`${result._id}-${question._id}`]
                            }
                          >
                            Submit Nilai
                          </Button>
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
      ))}
    </VStack>
  );
};

export default ResultsList;
