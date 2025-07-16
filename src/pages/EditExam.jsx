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
  Grid, // Tambahkan Grid untuk layout yang konsisten
  GridItem, // Tambahkan GridItem
} from "@chakra-ui/react";
// set dari react-hook-form tidak diperlukan di sini, bisa dihapus jika tidak digunakan

function EditExam() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Mengganti 'duration' dengan 'deadline' dan menginisialisasi dengan string kosong
  const [deadline, setDeadline] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [token, setToken] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await getExamById(id);
        setTitle(data.title);
        setDescription(data.description);
        // Mengonversi ISO string dari backend ke format yang diterima oleh input datetime-local (YYYY-MM-DDTHH:mm)
        if (data.deadline) {
          const date = new Date(data.deadline);
          // Format menjadi YYYY-MM-DDTHH:mm
          const formattedDate = date.toISOString().slice(0, 16);
          setDeadline(formattedDate);
        }
        setTotalMarks(data.totalMarks);
        setToken(data.token);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
        toast({
          title: "Error fetching exam data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false); // Pastikan loading dihentikan bahkan saat error
      }
    };
    fetchExam();
  }, [id, toast]);

  const handleUpdate = async () => {
    // Validasi dasar, bisa diperluas sesuai kebutuhan
    if (!title || !description || !deadline || !totalMarks || !token) {
      toast({
        title: "Semua field wajib diisi.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const updatedExamData = {
      title,
      description,
      // Mengirim deadline sebagai ISO string
      deadline: new Date(deadline).toISOString(),
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

  if (loading) {
    return (
      <Box p={6} maxW="1000px" mx="auto" textAlign="center">
        <p>Loading exam data...</p>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1000px" mx="auto" minH={"100vh"}>
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

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <GridItem>
            <FormControl>
              <FormLabel>Batas Waktu (Deadline)</FormLabel>
              <Input
                type="datetime-local" // Menggunakan tipe datetime-local
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Total Marks</FormLabel>
              <Input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Token Akses Ujian */}
        <FormControl mt={4}>
          {" "}
          {/* Tambahkan margin atas untuk konsistensi */}
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
