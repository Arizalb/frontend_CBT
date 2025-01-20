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
  IconButton,
} from "@chakra-ui/react";
import { DownloadIcon } from "lucide-react";
import Swal from "sweetalert2";

function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Gunakan state manual untuk modal

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

  const handleDownload = (exam) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan mengunduh file kisi-kisi-informatika-fase-e.pdf",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, unduh!",
    }).then((result) => {
      if (result.isConfirmed) {
        const link = document.createElement("a");
        link.href = "/kisi-kisi/kisi-kisi-informatika-fase-e.pdf";
        link.download = "kisi-kisi-informatika-fase-e.pdf";
        link.click();
        Swal.fire(
          "Terunduh!",
          "File kisi-kisi-informatika-fase-e.pdf telah diunduh.",
          "success"
        );
      }
    });
  };

  const handleOpenModal = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true); // Atur modal terbuka
  };

  const handleCloseModal = () => {
    setSelectedExam(null);
    setIsModalOpen(false); // Atur modal tertutup
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
        {" "}
        {exams.map((exam) => (
          <Box
            key={exam._id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            bg={useColorModeValue("white", "gray.700")}
          >
            {" "}
            <Stack spacing={4}>
              {" "}
              <Heading
                as="h3"
                size="md"
                color={useColorModeValue("orange.400", "yellow.400")}
              >
                {" "}
                <Button
                  onClick={() => handleOpenModal(exam)}
                  variant="link"
                  colorScheme="teal"
                >
                  {" "}
                  {exam.title}{" "}
                </Button>{" "}
              </Heading>{" "}
              <Flex justifyContent="space-between" alignItems="center">
                {" "}
                <Text fontSize="sm">
                  {" "}
                  Total Marks: <strong>{exam.totalMarks}</strong>{" "}
                </Text>{" "}
                <Badge colorScheme={exam.isActive ? "green" : "red"}>
                  {" "}
                  {exam.isActive ? "Aktif" : "Non-Aktif"}{" "}
                </Badge>{" "}
                <IconButton
                  icon={<DownloadIcon />}
                  onClick={() => handleDownload(exam)}
                  colorScheme="teal"
                  aria-label="Unduh"
                />{" "}
              </Flex>{" "}
              <Text fontSize="sm" color="gray.500">
                {" "}
                Tanggal Ujian: {new Date(
                  exam.examDate
                ).toLocaleDateString()}{" "}
              </Text>{" "}
            </Stack>{" "}
          </Box>
        ))}{" "}
      </SimpleGrid>

      {/* Modal for entering token */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
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
            <Button onClick={handleCloseModal} ml={3}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Exams;
