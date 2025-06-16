import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Icon,
  useColorModeValue,
  Spinner,
  Center,
  Badge,
  Stack,
  Button,
} from "@chakra-ui/react";
import { CheckCircleIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  getCompletedExams,
  getResultByStudent,
} from "../services/resultServices";
import { getExamById } from "../services/examService";
import { Link } from "react-router-dom";

function MyResults() {
  const [completedExams, setCompletedExams] = useState([]);
  const [examDetails, setExamDetails] = useState([]);
  const [noToken, setNoToken] = useState(false);
  const [loading, setLoading] = useState(true);

  // Warna dinamis
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.700");
  const accent = useColorModeValue("purple.400", "purple.300");

  // Fetch completed exams, with sessionStorage cache
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNoToken(true);
      setLoading(false);
      return;
    }
    const cachedExamIds = sessionStorage.getItem("completedExamIds");
    if (cachedExamIds) {
      setCompletedExams(JSON.parse(cachedExamIds));
      setLoading(false);
      return;
    }
    const fetchCompletedExams = async () => {
      try {
        const uniqueExamIds = await getCompletedExams();
        setCompletedExams(uniqueExamIds);
        sessionStorage.setItem(
          "completedExamIds",
          JSON.stringify(uniqueExamIds)
        );
      } catch (error) {
        console.error("Error fetching completed exams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedExams();
  }, []);

  // Fetch exam details, with sessionStorage cache
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (completedExams.length === 0) return;

    const cacheKey = "examDetails";
    const cachedDetails = sessionStorage.getItem(cacheKey);
    if (cachedDetails) {
      setExamDetails(JSON.parse(cachedDetails));
      return;
    }

    const fetchExamDetails = async () => {
      try {
        const details = await Promise.all(
          completedExams.map(async (examId) => {
            try {
              const resultData = await getResultByStudent(examId);
              const examData = await getExamById(examId);
              return {
                examId, // ⬅️ Tambahkan ini
                title: examData.title,
                score: resultData.totalMarksObtained || "N/A",
              };
            } catch (error) {
              if (error.response && error.response.status === 404) {
                return { examId, title: "Exam sudah dihapus", score: "N/A" }; // tambahkan examId juga di error
              } else {
                return { examId, title: "Exam Name Not Found", score: "N/A" };
              }
            }
          })
        );
        setExamDetails(details);
        sessionStorage.setItem(cacheKey, JSON.stringify(details));
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };
    fetchExamDetails();
  }, [completedExams]);

  const handleRefresh = () => {
    sessionStorage.removeItem("completedExamIds");
    sessionStorage.removeItem("examDetails");
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setNoToken(true);
      setLoading(false);
      return;
    }
    const fetchCompletedExams = async () => {
      try {
        const uniqueExamIds = await getCompletedExams();
        setCompletedExams(uniqueExamIds);
        sessionStorage.setItem(
          "completedExamIds",
          JSON.stringify(uniqueExamIds)
        );
      } catch (error) {
        console.error("Error fetching completed exams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedExams();
  };

  if (noToken) {
    return (
      <Box p={6} maxW="1000px" mx="auto" mt={12} minH={"100vh"}>
        <Heading as="h2" size="lg" mb={4} color={headingColor}>
          My Completed Exams
        </Heading>
        <Text color={textColor}>
          Tidak ada data. Silakan login terlebih dahulu.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1000px" mx="auto" mt={12} minH={"100vh"}>
      <Box
        w="full"
        maxW="900px"
        mx="auto"
        mb={8}
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
          <Icon as={CheckCircleIcon} color={accent} boxSize={7} />
          <Badge
            colorScheme="teal"
            fontSize="1em"
            px={3}
            py={1}
            borderRadius="full"
          >
            Completed Exams
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
            My Completed Exams
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
          Berikut adalah daftar ujian yang telah kamu selesaikan beserta skor
          akhir.
        </Text>
      </Box>
      {loading && (
        <Center my={8}>
          <Spinner size="xl" />
        </Center>
      )}
      {!loading && (
        <Box minH="200px" maxW="900px" mx="auto">
          {completedExams.length === 0 ? (
            <Text color={textColor}>
              Tidak ada ujian yang sudah diselesaikan.
            </Text>
          ) : (
            <Stack spacing={4}>
              {examDetails.map((examDetail, index) => (
                <Link to={`/result/student/${examDetail.examId}`} key={index}>
                  <Box
                    p={5}
                    borderWidth="1px"
                    borderRadius="xl"
                    bg={cardBg}
                    color={useColorModeValue("gray.800", "gray.100")}
                    shadow="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    transition="all 0.2s"
                    _hover={{
                      shadow: "xl",
                      borderColor: accent,
                      transform: "translateY(-2px) scale(1.01)",
                    }}
                  >
                    <Flex alignItems="center">
                      <Icon
                        as={CheckCircleIcon}
                        color={useColorModeValue("green.500", "green.200")}
                        boxSize={6}
                        mr={3}
                      />
                      <Text fontWeight="bold" fontSize="lg">
                        {examDetail.title}
                      </Text>
                    </Flex>
                    <Badge
                      colorScheme="purple"
                      fontSize="1em"
                      px={4}
                      py={2}
                      borderRadius="xl"
                    >
                      Score: {examDetail.score}
                    </Badge>
                  </Box>
                </Link>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}

export default MyResults;
