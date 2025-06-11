import axios from "axios";
import api from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "admin";
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  token: string;
  refreshToken: string;
  message: string;
};

/**
 * Register a new user
 */
export const register = async (
  email: string,
  password: string,
  fullName: string
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    fullName,
  });

  // Store tokens in localStorage
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("refreshToken", response.data.refreshToken);

  return response.data;
};

/**
 * Login user
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  // Store tokens in localStorage
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("refreshToken", response.data.refreshToken);

  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && refreshToken) {
      // Send logout request to invalidate refresh token on server
      await api.post(
        `/auth/logout`,
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always clear tokens from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User> => {
  // Use our API client with token refresh handling
  const response = await api.get(`/auth/me`);
  return response.data.user;
};

/**
 * Refresh the access token using refresh token
 */
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const response = await axios.post(`${API_URL}/auth/refresh-token`, {
    refreshToken,
  });

  const newToken = response.data.token;

  // Store new token in localStorage
  localStorage.setItem("token", newToken);

  // If a new refresh token was returned, update it too
  if (response.data.refreshToken) {
    localStorage.setItem("refreshToken", response.data.refreshToken);
  }

  return newToken;
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("token");
};

/**
 * Get authentication token
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    return true; // If error parsing token, assume it's expired
  }
};
