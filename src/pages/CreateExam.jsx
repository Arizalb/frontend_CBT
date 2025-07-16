import { useState, useRef } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  Stack,
  Select,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  useToast,
  Flex,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
// Pastikan path ke service Anda benar
import { createExam } from "../services/examService"; // Baris ini sudah diaktifkan

function CreateExam() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Mengganti 'duration' dengan 'deadline'
  const [deadline, setDeadline] = useState(""); // Menggunakan string untuk input datetime-local
  const [totalMarks, setTotalMarks] = useState(100);
  const [questions, setQuestions] = useState([]);
  const [token, setToken] = useState("");
  const toast = useToast();
  const lastQuestionRef = useRef(null);

  // Tambah pertanyaan baru
  const addQuestionField = (type) => {
    const newQuestion =
      type === "multiple_choice"
        ? {
            type: "multiple_choice",
            questionText: "",
            options: ["", "", "", ""],
            correctAnswer: "A",
            marks: 0,
          }
        : {
            type: "essay",
            questionText: "",
            marks: 0,
          };

    setQuestions((prev) => [...prev, newQuestion]);
    setTimeout(() => {
      lastQuestionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Hapus pertanyaan
  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Update pertanyaan
  const updateQuestion = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // Update opsi pilihan ganda
  const updateOption = (qIndex, optionIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].options[optionIndex] = value;
      return updated;
    });
  };

  // Validasi sebelum submit
  const validate = () => {
    // Memeriksa deadline, bukan duration
    if (!title || !description || !deadline || !totalMarks || !token) {
      toast({
        title: "Semua field wajib diisi.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return false;
    }
    if (questions.length === 0) {
      toast({
        title: "Minimal harus ada satu pertanyaan.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return false;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || q.marks === undefined || q.marks < 0) {
        // Menambahkan validasi marks
        toast({
          title: `Pertanyaan ${i + 1} belum lengkap atau nilai tidak valid.`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return false;
      }
      if (
        q.type === "multiple_choice" &&
        (q.options.some((opt) => !opt) || !q.correctAnswer)
      ) {
        toast({
          title: `Pilihan ganda pada pertanyaan ${i + 1} belum lengkap.`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return false;
      }
    }
    return true;
  };

  // Submit ujian
  const handleSubmit = async () => {
    if (!validate()) return;

    const examData = {
      title,
      description,
      // Mengirim deadline sebagai ISO string
      deadline: new Date(deadline).toISOString(),
      totalMarks,
      questions,
      token,
    };

    try {
      // Panggil fungsi createExam dari service
      await createExam(examData); // Baris ini sudah diaktifkan
      toast({
        title: "Ujian berhasil dibuat!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Reset form setelah submit
      setTitle("");
      setDescription("");
      setDeadline(""); // Reset deadline
      setTotalMarks(100);
      setQuestions([]);
      setToken("");
    } catch (error) {
      toast({
        title: "Gagal membuat ujian.",
        description: error.response
          ? error.response.data.message
          : "Terjadi kesalahan.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} maxW="1000px" mx="auto" minH={"100vh"}>
      <Heading mb={4}>Buat Ujian Baru</Heading>
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
          <FormLabel>Deskripsi</FormLabel>
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

        {/* Section for dynamic questions */}
        <Box>
          <Flex mb={2} gap={2}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="yellow"
              size="md"
              onClick={() => addQuestionField("multiple_choice")}
            >
              Tambah Pilihan Ganda
            </Button>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="yellow"
              size="md"
              onClick={() => addQuestionField("essay")}
            >
              Tambah Essay
            </Button>
          </Flex>
          {questions.map((question, index) => (
            <Box
              key={index}
              borderWidth="2px"
              borderColor={
                question.type === "multiple_choice" ? "yellow.300" : "gray.300"
              }
              borderRadius="lg"
              p={4}
              mb={4}
              bg={
                question.type === "multiple_choice"
                  ? useColorModeValue("yellow.100", "yellow.900")
                  : useColorModeValue("gray.100", "gray.700")
              }
              boxShadow="md"
              position="relative"
              ref={index === questions.length - 1 ? lastQuestionRef : null}
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="sm">
                  {question.type === "multiple_choice"
                    ? `Pilihan Ganda #${index + 1}`
                    : `Essay #${index + 1}`}
                </Heading>
                <IconButton
                  aria-label="Hapus pertanyaan"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeQuestion(index)}
                />
              </Flex>
              {question.type === "multiple_choice" ? (
                <>
                  <FormControl>
                    <FormLabel>Teks Pertanyaan</FormLabel>
                    <Input
                      bg={useColorModeValue("white", "gray.800")}
                      color={useColorModeValue("black", "white")}
                      value={question.questionText}
                      onChange={(e) =>
                        updateQuestion(index, "questionText", e.target.value)
                      }
                      placeholder="Teks pertanyaan"
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Opsi Jawaban (A, B, C, D)</FormLabel>
                    {["A", "B", "C", "D"].map((label, idx) => (
                      <Input
                        key={label}
                        bg={useColorModeValue("white", "gray.800")}
                        color={useColorModeValue("black", "white")}
                        value={question.options[idx]}
                        onChange={(e) =>
                          updateOption(index, idx, e.target.value)
                        }
                        placeholder={`Jawaban ${label}`}
                        mb={2}
                      />
                    ))}
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Jawaban Benar</FormLabel>
                    <Select
                      value={question.correctAnswer}
                      onChange={(e) =>
                        updateQuestion(index, "correctAnswer", e.target.value)
                      }
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </Select>
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Nilai Pertanyaan</FormLabel>
                    <Input
                      type="number"
                      value={question.marks}
                      onChange={(e) =>
                        updateQuestion(index, "marks", Number(e.target.value))
                      }
                      placeholder="Nilai"
                    />
                  </FormControl>
                </>
              ) : (
                <>
                  <FormControl>
                    <FormLabel>Teks Pertanyaan</FormLabel>
                    <Textarea
                      bg={useColorModeValue("white", "gray.800")}
                      color={useColorModeValue("black", "white")}
                      value={question.questionText}
                      onChange={(e) =>
                        updateQuestion(index, "questionText", e.target.value)
                      }
                      placeholder="Teks pertanyaan essay"
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Nilai Pertanyaan</FormLabel>
                    <Input
                      type="number"
                      value={question.marks}
                      onChange={(e) =>
                        updateQuestion(index, "marks", Number(e.target.value))
                      }
                      placeholder="Nilai"
                    />
                  </FormControl>
                </>
              )}
            </Box>
          ))}
        </Box>

        {/* Input token */}
        <FormControl mt={6}>
          <FormLabel>Token Akses Ujian</FormLabel>
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Masukkan token akses ujian"
          />
        </FormControl>

        {/* Submit button */}
        <Button colorScheme="teal" size="lg" mt={6} onClick={handleSubmit}>
          Buat Ujian
        </Button>
      </Stack>
    </Box>
  );
}

export default CreateExam;
