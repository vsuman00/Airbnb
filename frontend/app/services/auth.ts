import axios from "axios";
import { LoginCredentials, SignupData, AuthResponse, User } from "../types";

const API_URL = "http://localhost:8000/api";

const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to save token to localStorage
const saveToken = (token: string) => {
  localStorage.setItem("airbnb_token", token);
};

// Helper to get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("airbnb_token");
  }
  return null;
};

// Helper to get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("airbnb_user");
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
};

// Add token to axios requests
export const setupAuthHeader = () => {
  const token = getToken();
  if (token) {
    authAPI.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete authAPI.defaults.headers.common["Authorization"];
  }
};

// Login user
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await authAPI.post("/auth/login/", credentials);
    const { token, user } = response.data;

    // Save auth data
    saveToken(token);
    localStorage.setItem("airbnb_user", JSON.stringify(user));

    // Setup auth header for future requests
    setupAuthHeader();

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register new user
export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await authAPI.post("/auth/register/", userData);
    const { token, user } = response.data;

    // Save auth data
    saveToken(token);
    localStorage.setItem("airbnb_user", JSON.stringify(user));

    // Setup auth header for future requests
    setupAuthHeader();

    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("airbnb_token");
  localStorage.removeItem("airbnb_user");
  delete authAPI.defaults.headers.common["Authorization"];

  // Refresh page to clear any state
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export default authAPI;
