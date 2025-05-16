import axios from "axios";
import { getExamById } from "./examService";
import { getUserById } from "./userService";

const API_URL = import.meta.env.VITE_API_URL + "/results";

// getResults.js
// getResults.js
export const getResults = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Kirim request GET ke endpoint API /results
    const { data } = await axios.get(`${API_URL}`, { headers });

    // Padukan data dengan nama user dan nama exam
    const resultsWithNames = await Promise.all(
      data.map(async (result) => {
        try {
          // Periksa ketersediaan exam
          const exam = await getExamById(result.examId);
          const student = await getUserById(result.studentId);

          return {
            ...result,
            examName: exam.name,
            studentName: student.name,
          };
        } catch (error) {
          return null; // Lewati exam yang sudah dihapus
        }
      })
    );

    // Filter hasil yang tidak null
    const filteredResults = resultsWithNames.filter(Boolean);

    return filteredResults; // Kembalikan data hasil ujian yang telah dipadukan dan terfilter
  } catch (error) {
    console.error("Gagal mendapatkan hasil ujian", error);
    return []; // Kembalikan array kosong jika ada error
  }
};

export const getResultByStudent = async (examId) => {
  // Ambil token dari localStorage
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/student/${examId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Sertakan token JWT
    },
  });
  return response.data;
};

export const submitResult = async (examId, { studentId, answers }) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/submit/${examId}`,
    {
      examId,
      studentId,
      answers,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Ubah status exam menjadi tidak aktif setelah jawaban di-submit
  try {
    await axios.patch(`${API_URL}/exam/${examId}`, {
      isActive: false,
    });
  } catch (error) {
    console.error("Error updating exam status:", error);
  }

  return response.data;
};

// Ambil daftar examId dari ujian yang sudah diselesaikan oleh student
export const getCompletedExams = async () => {
  try {
    const token = localStorage.getItem("token"); // Ambil token dari local storage
    if (!token) {
      // Jika token tidak ada, kembalikan array kosong
      return [];
    }

    const headers = {
      Authorization: `Bearer ${token}`, // Tambahkan header autentikasi bearer token
    };

    const { data } = await axios.get(`${API_URL}/completed-exams`, { headers }); // Kirim request dengan header autentikasi
    const uniqueExamIds = [...new Set(data)]; // Hapus duplikasi examId
    return uniqueExamIds; // Mengembalikan daftar examId yang unik
  } catch (error) {
    console.error("Gagal mendapatkan ujian yang sudah diselesaikan", error);
    return [];
  }
};

export const getResultsByExam = async (examId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/exam/${examId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const gradeEssayAnswers = async (resultId, { questionIndex, grade }) => {
  try {
    const token = localStorage.getItem("token");

    // Log untuk debugging
    console.log("Result ID:", resultId);
    console.log(`Grading question index: ${questionIndex}, grade: ${grade}`);

    // Format payload sesuai dengan API
    const formattedGrade = {
      questionIndex: Number(questionIndex), // Pastikan index adalah angka
      grade: Number(grade), // Pastikan grade juga berupa angka
    };

    const response = await axios.put(
      `${API_URL}/grade/${resultId}`,
      formattedGrade, // Mengirim payload untuk satu questionIndex
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw new Error("Failed to grade essay answer. Please try again later.");
  }
};

export const finalizeGrades = async (resultId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/grade/${resultId}/finalize`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error finalizing grades:", error.message);
    throw new Error("Failed to finalize grades. Please try again later.");
  }
};
