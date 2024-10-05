import { useEffect, useState } from "react";
import { getAllExams } from "../services/examService";
import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Stack,
  Badge,
  Flex,
  useColorModeValue,
  Center,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [token, setToken] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getAllExams();
        setExams(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mendapatkan data ujian", error);
      }
    };
    fetchExams();
  }, []);

  const handleOpenModal = (exam) => {
    setSelectedExam(exam);
    onOpen();
  };

  const handleSubmit = () => {
    if (token === selectedExam.token) {
      // Navigasi ke detail ujian jika token benar
      window.location.href = `/exams/${selectedExam._id}`;
    } else {
      alert("Token tidak valid. Silakan coba lagi.");
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
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h2">Daftar Ujian</Heading>
      </Flex>

      {/* List of exams */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {exams.map((exam) => (
          <Box
            key={exam._id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            bg={useColorModeValue("white", "gray.700")}
          >
            <Stack spacing={4}>
              <Heading
                as="h3"
                size="md"
                color={useColorModeValue("orange.400", "yellow.400")}
              >
                <Button
                  onClick={() => handleOpenModal(exam)}
                  variant="link"
                  colorScheme="teal"
                >
                  {exam.title}
                </Button>
              </Heading>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="sm">
                  Total Marks: <strong>{exam.totalMarks}</strong>
                </Text>
                <Badge colorScheme={exam.isActive ? "green" : "red"}>
                  {exam.isActive ? "Aktif" : "Non-Aktif"}
                </Badge>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                Tanggal Ujian: {new Date(exam.examDate).toLocaleDateString()}
              </Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Modal for entering token */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Masukkan Token Ujian</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Masukkan token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Masuk
            </Button>
            <Button onClick={onClose} ml={3}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Exams;
