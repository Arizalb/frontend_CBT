import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getExamById, updateExam } from "../services/examService";
import {
  Box,
  Button,
  Input,
  FormLabel,
  Heading,
  Textarea,
  Stack,
  useToast,
  FormControl,
} from "@chakra-ui/react";

function EditExam() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [token, setToken] = useState(""); // Tambahkan state untuk token
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await getExamById(id);
        setTitle(data.title);
        setDescription(data.description);
        setDuration(data.duration);
        setTotalMarks(data.totalMarks);
        setToken(data.token); // Pastikan token juga di-fetch
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
        toast({
          title: "Error fetching exam data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchExam();
  }, [id, toast]);

  const handleUpdate = async () => {
    if (!token) {
      toast({
        title: "Token wajib diisi.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const updatedExamData = {
      title,
      description,
      duration,
      totalMarks,
      token,
    };

    try {
      await updateExam(id, updatedExamData);
      toast({
        title: "Ujian berhasil diupdate!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update exam:", error);
      toast({
        title: "Error updating exam.",
        description: error.response
          ? error.response.data.message
          : "Terjadi kesalahan.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Box p={6} maxW="1000px" mx="auto">
      <Heading mb={4}>Edit Ujian</Heading>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Judul Ujian</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul ujian"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Deskripsi Ujian</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi ujian"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Durasi Ujian (menit)</FormLabel>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Total Marks</FormLabel>
          <Input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value))}
          />
        </FormControl>

        {/* Token Akses Ujian */}
        <FormControl>
          <FormLabel>Token Akses Ujian</FormLabel>
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Masukkan token akses ujian"
          />
        </FormControl>

        <Button colorScheme="teal" size="lg" mt={6} onClick={handleUpdate}>
          Update Ujian
        </Button>
      </Stack>
    </Box>
  );
}

export default EditExam;
