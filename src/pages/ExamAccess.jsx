import { useState } from "react";
import { Box, Button, Input, Heading, Text, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getExamById, validateExamToken } from "../services/examService";

function ExamAccess() {
  const { id } = useParams();
  const [token, setToken] = useState("");
  const toast = useToast();

  const handleAccess = async () => {
    try {
      // Validate the entered token
      const isValid = await validateExamToken(id, token);
      if (isValid) {
        // Navigate to the exam if valid
        window.location.href = `/exams/${id}`;
      } else {
        toast({
          title: "Invalid token",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error accessing exam",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={6} maxW="400px" mx="auto" mt={12}>
      <Heading mb={4}>Enter Exam Token</Heading>
      <Text mb={4}>Please enter the exam token provided by the examiner.</Text>
      <Input
        placeholder="Enter token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        mb={4}
      />
      <Button onClick={handleAccess} colorScheme="teal">
        Access Exam
      </Button>
    </Box>
  );
}

export default ExamAccess;
