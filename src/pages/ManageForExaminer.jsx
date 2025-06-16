import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useColorModeValue,
  Divider,
  Stack,
} from "@chakra-ui/react";
import ManageExamExaminer from "../components/ManageExamExaminer";
import { Link } from "react-router-dom";
import ResultsList from "../components/ResultsList";
import { useRef } from "react";

function ManageForExaminer() {
  const examResultsRef = useRef(null);

  const handleScrollToResults = () => {
    examResultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box p={{ base: 2, md: 6 }} maxW="1000px" mx="auto" mt={12}>
      {/* Section: Manage Exams */}
      <Box
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="xl"
        boxShadow="md"
        p={{ base: 4, md: 8 }}
        mb={10}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ base: "stretch", md: "center" }}
          mb={6}
          gap={4}
        >
          <Heading
            as="h2"
            size="lg"
            color={useColorModeValue("teal.500", "teal.300")}
          >
            Manage Exams
          </Heading>
          <Button
            as={Link}
            to="/create-exam"
            colorScheme="teal"
            size="md"
            fontWeight="bold"
            boxShadow="sm"
            w={{ base: "100%", md: "auto" }}
          >
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

        <Divider my={8} />
        <Button
          colorScheme="teal"
          variant="outline"
          size="sm"
          onClick={handleScrollToResults}
          w={{ base: "100%", md: "auto" }}
        >
          Lihat Daftar Hasil Ujian
        </Button>
      </Box>

      {/* Section: Exam Results */}
      <Box
        ref={examResultsRef}
        bg={useColorModeValue("gray.50", "gray.700")}
        borderRadius="xl"
        boxShadow="sm"
        p={{ base: 4, md: 8 }}
        mb={4}
      >
        <Heading
          as="h2"
          size="lg"
          mb={6}
          textAlign="center"
          color={useColorModeValue("teal.500", "teal.300")}
        >
          Daftar Hasil Ujian
        </Heading>
        <ResultsList />
      </Box>
    </Box>
  );
}

export default ManageForExaminer;
