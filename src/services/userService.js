import axios from "axios";

// Base API URL
const API_URL = "https://backend-cbt.vercel.app/api/users";

// Get all users
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL, config);
    console.log(response.data); // Log response untuk melihat datanya
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error); // Log error jika terjadi masalah
    throw error;
  }
};

// Get a single user by ID
// getUserById.js
export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Pastikan URL endpoint benar
    const response = await axios.get(`${API_URL}/${userId}`, { headers });

    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID: ${userId}`, error);
    throw error;
  }
};

// Delete a user by ID (with token authentication)
export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`${API_URL}/${userId}`, config);
  return response.data;
};
