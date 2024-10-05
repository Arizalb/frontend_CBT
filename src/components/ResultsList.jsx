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
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"; // Icons for correct/incorrect
import { getResults, gradeEssayAnswers } from "../services/resultServices"; // Include grading service
import { getExamById } from "../services/examService";
import { getUserById } from "../services/userService";

const ResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [essayGrades, setEssayGrades] = useState({}); // To store essay grades temporarily

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
                questions: exam.questions, // Attach exam questions
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
    if (selectedAnswer === correctAnswer) {
      return true;
    }

    const correctIndex = ["A", "B", "C", "D"].indexOf(correctAnswer);
    if (correctIndex !== -1 && options[correctIndex] === selectedAnswer) {
      return true;
    }

    return false;
  };

  const handleGradeChange = (resultId, questionIndex, grade) => {
    setEssayGrades((prevGrades) => ({
      ...prevGrades,
      [`${resultId}-${questionIndex}`]: grade,
    }));
  };

  const handleGradeSubmit = async (resultId, questionIndex) => {
    const grade = essayGrades[`${resultId}-${questionIndex}`];

    try {
      await gradeEssayAnswers(resultId, questionIndex, grade); // Call API to submit grade
      alert("Essay graded successfully!");
    } catch (error) {
      console.error("Error grading essay:", error);
      alert("Failed to submit the grade.");
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <Spinner size="lg" />
        <Text mt={2}>Loading Results...</Text>
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

          {result.answers &&
            result.answers.map((answer, index) => {
              const question = result.questions
                ? result.questions[index]
                : null;

              if (!question) return null;

              return (
                <Box key={index} mb={2}>
                  <Text>
                    Question {index + 1}: {question.questionText}
                  </Text>

                  {/* For multiple-choice questions */}
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
                    // For essay questions
                    <Box>
                      <Text>Essay Answer: {answer.essayAnswer}</Text>

                      {/* Input for grading essay */}
                      <Input
                        type="number"
                        placeholder="Enter grade"
                        value={essayGrades[`${result._id}-${index}`] || ""}
                        onChange={(e) =>
                          handleGradeChange(result._id, index, e.target.value)
                        }
                        mb={2}
                      />
                      <Button
                        onClick={() => handleGradeSubmit(result._id, index)}
                        colorScheme="blue"
                      >
                        Submit Grade
                      </Button>
                    </Box>
                  )}
                </Box>
              );
            })}
        </Box>
      ))}
    </VStack>
  );
};

export default ResultsList;
