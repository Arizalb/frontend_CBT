import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Spinner,
  Divider,
  Input,
  Button,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  getResults,
  gradeEssayAnswers,
  finalizeGrades,
} from "../services/resultServices";
import { getExamById } from "../services/examService";
import { getUserById } from "../services/userService";
import Swal from "sweetalert2";

const ResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [essayGrades, setEssayGrades] = useState({}); // Untuk menyimpan nilai esai

  useEffect(() => {
    const fetchResults = async () => {
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
              console.error(
                `Exam with ID ${result.examId} not found, skipping...`
              );
              return {
                ...result,
                examName: "Exam tidak ditemukan",
                studentName: result.studentName,
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

    fetchResults();
  }, []);

  const checkAnswer = (selectedAnswer, correctAnswer, options) => {
    const correctIndex = ["A", "B", "C", "D"].indexOf(correctAnswer);
    return (
      selectedAnswer === correctAnswer ||
      options[correctIndex] === selectedAnswer
    );
  };

  const handleGradeChange = (resultId, questionIndex, grade) => {
    setEssayGrades((prevGrades) => ({
      ...prevGrades,
      [`${resultId}-${questionIndex}`]: grade,
    }));
  };

  const handleGradeSubmit = async (resultId, questionIndex) => {
    const grade = essayGrades[`${resultId}-${questionIndex}`];

    if (!grade) return Swal.fire("Error", "Please enter a grade", "error");

    try {
      await gradeEssayAnswers(resultId, {
        questionIndex: questionIndex,
        grade: Number(grade),
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
    } catch (error) {
      console.error("Error finalizing grades:", error);
      Swal.fire("Error", "Failed to finalize grades.", "error");
    }
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
      {results.map((result) => (
        <Box
          key={result._id}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          w="100%"
        >
          <Text fontSize="lg" fontWeight="bold">
            {result.examName}
          </Text>
          <Text>Student: {result.studentName}</Text>
          <Text>
            Submitted at: {new Date(result.submittedAt).toLocaleString()}
          </Text>
          <Divider my={3} />

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
                                index,
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
              >
                Finalisasi Nilai
              </Button>
            </>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default ResultsList;
