import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResultByStudent } from "../services/resultServices";
import { Box, Heading, Text, Spinner } from "@chakra-ui/react";

function Result() {
  const { examId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getResultByStudent(examId);
        setResult(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mendapatkan hasil ujian", error);
      }
    };
    fetchResult();
  }, [examId]);

  if (loading) return <Spinner />;

  return (
    <Box p={6} maxW="800px" mx="auto" mt={12}>
      <Heading as="h2" mb={6}>
        Hasil Ujian
      </Heading>
      <Text>Ujian: {result.exam.title}</Text>
      <Text>Total Nilai: {result.totalMarks}</Text>
      <Text>Nilai Anda: {result.studentMarks}</Text>
    </Box>
  );
}

export default Result;
