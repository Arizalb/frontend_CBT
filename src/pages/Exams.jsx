import { useEffect, useState } from "react";
import { getAllExams, getExamById } from "../services/examService";
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
  Icon,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { FaClipboardList, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await getAllExams();
      // Simpan hanya metadata yang aman
      const safeExams = data.map(
        ({ _id, title, description, totalMarks, examDate }) => ({
          _id,
          title,
          description,
          totalMarks,
          examDate,
        })
      );
      setExams(safeExams);
      sessionStorage.setItem("allExams", JSON.stringify(safeExams));
    } catch (error) {
      console.error("Gagal mendapatkan data ujian", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedExams = sessionStorage.getItem("allExams");
    if (cachedExams) {
      setExams(JSON.parse(cachedExams));
      setLoading(false);
      return;
    }
    fetchExams();
  }, []);

  const handleRefresh = () => {
    sessionStorage.removeItem("allExams");
    fetchExams();
  };

  const handleOpenModal = (exam) => {
    setSelectedExam({ _id: exam._id, title: exam.title }); // set minimal info
    setIsModalOpen(true);

    // Fetch detail exam di background
    getExamById(exam._id)
      .then((detailExam) => setSelectedExam(detailExam))
      .catch(() => alert("Gagal mengambil detail ujian"));
  };

  const handleCloseModal = () => {
    setSelectedExam(null);
    setIsModalOpen(false);
    setToken("");
  };

  const handleSubmit = () => {
    if (token === selectedExam.token) {
      sessionStorage.setItem("examAccess", selectedExam._id);
      navigate(`/exams/${selectedExam._id}`);
    } else {
      alert("Token tidak valid. Silakan coba lagi.");
    }
  };

  // Warna dinamis
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.700");
  const accent = useColorModeValue("purple.400", "purple.300");

  return (
    <Box p={6} maxW="1000px" mx="auto" mt={12} minH={"100vh"}>
      {/* Section 1: Judul dan refresh */}
      <Box
        w="full"
        maxW="900px"
        mx="auto"
        mb={10}
        px={{ base: 2, md: 6 }}
        textAlign="center"
      >
        <Stack
          direction="row"
          align="center"
          justify="center"
          mb={2}
          spacing={2}
        >
          <Icon as={FaClipboardList} color={accent} boxSize={7} />
          <Badge
            colorScheme="teal"
            fontSize="1em"
            px={3}
            py={1}
            borderRadius="full"
          >
            Exams List
          </Badge>
        </Stack>
        <Flex
          align="center"
          justify="center"
          gap={3}
          direction={{ base: "column", md: "row" }}
        >
          <Heading
            mb={0}
            fontSize={{ base: "2xl", md: "4xl" }}
            color={headingColor}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="shorter"
          >
            Daftar Ujian
          </Heading>
          <Icon
            as={RepeatIcon}
            boxSize={6}
            cursor="pointer"
            color="teal.500"
            title="Refresh"
            onClick={handleRefresh}
            _hover={{ color: "teal.700" }}
            ml={2}
          />
        </Flex>
        <Text fontSize={{ base: "md", md: "lg" }} color={textColor} mt={3}>
          Pilih ujian yang tersedia di bawah ini dan masukkan token untuk mulai
          mengerjakan.
        </Text>
      </Box>

      {/* Spinner tampil di bawah judul */}
      {loading && (
        <Center my={8}>
          <Spinner size="xl" />
        </Center>
      )}

      {/* List of exams */}
      {!loading &&
        (exams.length === 0 ? (
          <Text color={textColor} textAlign="center">
            Tidak ada ujian tersedia.
          </Text>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={8}
            maxW="900px"
            mx="auto"
            mb={12}
          >
            {exams.map((exam) => (
              <Box
                key={exam._id}
                p={6}
                shadow="md"
                borderWidth="1px"
                borderRadius="xl"
                bg={cardBg}
                transition="all 0.2s"
                _hover={{
                  shadow: "xl",
                  borderColor: accent,
                  transform: "translateY(-4px) scale(1.01)",
                }}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
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
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      {exam.title}
                    </Button>
                  </Heading>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="sm" color={textColor}>
                      Total Nilai: <strong>{exam.totalMarks}</strong>
                    </Text>
                    <Badge colorScheme="green">Aktif</Badge>
                  </Flex>
                  <Text fontSize="sm" color={textColor}>
                    Tanggal Ujian:{" "}
                    {new Date(exam.examDate).toLocaleDateString()}
                  </Text>
                </Stack>
                <Button
                  mt={6}
                  colorScheme="teal"
                  leftIcon={<FaCheckCircle />}
                  onClick={() => handleOpenModal(exam)}
                  isFullWidth // ini benar, tetap di sini
                >
                  Kerjakan Ujian
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        ))}

      {/* Modal for entering token */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Masukkan Token Ujian</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Masukkan token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleSubmit}
              isDisabled={!selectedExam || !selectedExam.token}
            >
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
