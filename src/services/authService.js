import axios from "axios";

const API_URL = "https://backend-cbt.vercel.app/api/auth"; // Ubah sesuai backend kamu

// Register user
export const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

/// Login user
export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);

    if (response.data.token) {
      // Simpan token, role, dan name di localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role); // Simpan role
      localStorage.setItem("name", response.data.name); // Simpan nama pengguna
      localStorage.setItem("studentId", response.data._id);

      return { success: true, message: "Login successful" };
    } else {
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    }
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, message: "Login failed" };
  }
};

// Get user profile
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/profile`, profileData);
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
};
