import { useEffect, useState } from "react";
import { getAllExams, deleteExam } from "../services/examService";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Center,
  useToast,
  VStack,
  TableContainer,
} from "@chakra-ui/react";

function ManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getAllExams();
        setExams(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast({
          title: "Error",
          description: "Failed to load exams",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchExams();
  }, []);

  const handleDeleteExam = async (examId) => {
    try {
      await deleteExam(examId);
      setExams(exams.filter((exam) => exam._id !== examId));
      toast({
        title: "Success",
        description: "Exam deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete exam:", error);
      toast({
        title: "Error",
        description: "Failed to delete exam",
        status: "error",
        duration: 5000,
        isClosable: true,
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

  return (
    <Box p={6} maxW="1000px" mx="auto" mt={12}>
      <Heading as="h2" mb={6}>
        Manage Exams
      </Heading>
      <VStack spacing={4}>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Total Marks</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {exams.map((exam) => (
                <Tr key={exam._id}>
                  <Td>{exam.title}</Td>
                  <Td>{exam.totalMarks}</Td>
                  <Td>{new Date(exam.examDate).toLocaleDateString()}</Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteExam(exam._id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
}

export default ManageExams;
