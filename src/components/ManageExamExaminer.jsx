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
  const [deleting, setDeleting] = useState(false);

  const bgColor = useColorModeValue("white", "gray.700");
  const headingColor = useColorModeValue("orange.400", "yellow.400");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getAllExams();
        setExams(data);
      } catch (error) {
        toast({
          title: "Failed to fetch exams.",
          description: error.message || "Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [toast]);

  const handleDelete = async () => {
    if (!selectedExam) return;
    setDeleting(true);
    try {
      await deleteExam(selectedExam._id);
      setExams((prev) => prev.filter((exam) => exam._id !== selectedExam._id));
      toast({
        title: "Exam deleted.",
        description: `Exam "${selectedExam.title}" has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setSelectedExam(null);
    } catch (error) {
      toast({
        title: "Error deleting exam.",
        description: error.message || "There was an error deleting the exam.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
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
                {exam.isActive && <Badge colorScheme="green">Active</Badge>}
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
        onClose={() => {
          setSelectedExam(null);
          onClose();
        }}
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
              <Button ref={cancelRef} onClick={onClose} isDisabled={deleting}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={deleting}
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
