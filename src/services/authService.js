import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

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
<<<<<<< HEAD
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("studentId", response.data._id);

      // 🔥 Trigger event agar Navbar langsung update
      window.dispatchEvent(new Event("storage"));

=======
      localStorage.setItem("role", response.data.role); // Simpan role
      localStorage.setItem("name", response.data.name); // Simpan nama pengguna
      localStorage.setItem("studentId", response.data._id);

>>>>>>> 21ad59143b0bee86c15ba39af2432a18e75688b6
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
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("studentId");
};
