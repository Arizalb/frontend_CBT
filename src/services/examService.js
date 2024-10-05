import axios from "axios";

const API_URL = "https://backend-cbt.vercel.app/api/exams"; // Adjust accordingly

// Get all exams
export const getAllExams = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get exam by ID
export const getExamById = async (examId) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.get(`${API_URL}/${examId}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create exam
export const createExam = async (examData) => {
  const token = localStorage.getItem("token"); // Ambil token dari local storage
  const response = await axios.post(`${API_URL}`, examData, {
    headers: {
      Authorization: `Bearer ${token}`, // Menambahkan header Authorization
    },
  });
  return response.data;
};

// Submit exam answers
export const submitExam = async (examId, answers) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(
    `${API_URL}/submit/${examId}`,
    answers,
    config
  );
  return response.data;
};

export const deleteExam = async (examId) => {
  const token = localStorage.getItem("token"); // Ambil token dari localStorage
  const config = {
    headers: { Authorization: `Bearer ${token}` }, // Sertakan token dalam header
  };

  try {
    const response = await axios.delete(`${API_URL}/${examId}`, config);
    return response.data;
  } catch (error) {
    console.error("Failed to delete exam:", error);
    throw error;
  }
};

// Edit Exam
export const updateExam = async (examId, updatedExamData) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.put(
      `${API_URL}/${examId}`,
      updatedExamData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update exam:", error);
    throw error;
  }
};
/*
export const getExamResults = async (examId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`/api/exams/${examId}/results`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const gradeExam = async (resultId, gradeData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `/api/results/${resultId}/grade`,
    gradeData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
*/
// Validate exam token
export const validateExamToken = async (examId, token) => {
  const response = await axios.post(`${API_URL}/validate-token`, {
    id: examId,
    token,
  });
  return response.data.isValid;
};
