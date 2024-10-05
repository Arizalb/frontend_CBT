import {
  Box,
  Heading,
  Text,
  Badge,
  Stack,
  Flex,
  Button,
  useColorModeValue,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner,
  Center,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { getAllExams, deleteExam } from "../services/examService";
import { Link } from "react-router-dom";

function ManageExamExaminer() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const cancelRef = useRef();

  const bgColor = useColorModeValue("white", "gray.700");
  const headingColor = useColorModeValue("orange.400", "yellow.400");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getAllExams();
        setExams(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch exams", error);
      }
    };
    fetchExams();
  }, []);

  const handleDelete = async (examId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam?"
    );
    if (!confirmDelete) return;

    try {
      await deleteExam(examId);
      toast({
        title: "Exam deleted.",
        description: "The exam has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setExams(exams.filter((exam) => exam._id !== examId)); // Remove exam from UI
    } catch (error) {
      console.error("Failed to delete exam:", error);
      toast({
        title: "Error deleting exam.",
        description: "There was an error deleting the exam. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = (exam) => {
    setSelectedExam(exam);
    onOpen();
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {exams.map((exam) => (
          <Box
            key={exam._id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            bg={bgColor}
          >
            <Stack spacing={4}>
              <Heading as="h3" size="md" color={headingColor}>
                {exam.title}
              </Heading>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="sm">
                  Total Marks: <strong>{exam.totalMarks}</strong>
                </Text>
                <Badge colorScheme={exam.isActive ? "green" : "red"}>
                  {exam.isActive ? "Active" : "Inactive"}
                </Badge>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                Exam Date: {new Date(exam.examDate).toLocaleDateString()}
              </Text>

              <Flex justifyContent="flex-end" mt={4}>
                <Button
                  as={Link}
                  to={`/exams/edit/${exam._id}`}
                  colorScheme="blue"
                  size="sm"
                  mr={2}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => confirmDelete(exam)}
                >
                  Delete
                </Button>
              </Flex>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Confirmation Dialog for Deleting */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Exam
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete the exam "{selectedExam?.title}"?
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDelete(selectedExam._id)}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default ManageExamExaminer;
