import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import ManageExamExaminer from "../components/ManageExamExaminer";
import { Link } from "react-router-dom";
import GradeExam from "../components/GradeExam";
import ResultsList from "../components/ResultsList";

function ManageForExaminer() {
  return (
    <Box p={6} maxW="1000px" mx="auto" mt={12}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading
          as="h2"
          size="lg"
          color={useColorModeValue("teal.500", "teal.300")}
        >
          Manage Exams
        </Heading>
        <Button as={Link} to="/create-exam" colorScheme="teal">
          Create New Exam
        </Button>
      </Flex>

      <Text
        mb={4}
        fontSize="lg"
        color={useColorModeValue("gray.600", "gray.400")}
      >
        Below are the exams you have created. You can update or delete them as
        needed.
      </Text>

      <ManageExamExaminer />
      <Heading
        as="h2"
        size="lg"
        marginY={"8"}
        pt={"2"}
        textAlign={"center"}
        color={useColorModeValue("teal.500", "teal.300")}
      >
        Daftar Hasil Ujian
      </Heading>
      <ResultsList />
    </Box>
  );
}

export default ManageForExaminer;
