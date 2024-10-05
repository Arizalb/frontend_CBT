import { useState } from "react";
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
} from "@chakra-ui/react";
import { createExam } from "../services/examService";

function CreateExam() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [questions, setQuestions] = useState([]);
  const [token, setToken] = useState(""); // Tambahkan state untuk token
  const toast = useToast();

  // Handle dynamic questions (both multiple choice and essay)
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

    setQuestions([...questions, newQuestion]);
  };

  // Update the text of a specific question dynamically
  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Update the options for multiple-choice questions
  const updateOption = (qIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!token) {
      toast({
        title: "Token wajib diisi.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const examData = {
      title,
      description,
      duration,
      totalMarks,
      questions,
      token,
    };

    try {
      await createExam(examData);
      toast({
        title: "Ujian berhasil dibuat!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
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

        <FormControl>
          <FormLabel>Durasi (menit)</FormLabel>
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

        {/* Section for dynamic questions */}
        {questions.map((question, index) => (
          <Box key={index} borderWidth="1px" borderRadius="lg" p={4} mb={4}>
            {question.type === "multiple_choice" ? (
              <>
                <Heading size="md" mb={4}>
                  Pertanyaan Pilihan Ganda
                </Heading>
                <FormControl>
                  <FormLabel>Teks Pertanyaan</FormLabel>
                  <Input
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
                      value={question.options[idx]}
                      onChange={(e) => updateOption(index, idx, e.target.value)}
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
                <Heading size="md" mb={4}>
                  Pertanyaan Essay
                </Heading>
                <FormControl>
                  <FormLabel>Teks Pertanyaan</FormLabel>
                  <Textarea
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

        {/* Buttons to add new questions */}
        <Button
          colorScheme="yellow"
          size="md"
          onClick={() => addQuestionField("multiple_choice")}
        >
          + Pilihan Ganda
        </Button>
        <Button
          colorScheme="yellow"
          size="md"
          mt={2}
          onClick={() => addQuestionField("essay")}
        >
          + Essay
        </Button>

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
