import axios from "axios";
import api from "../lib/api";
import { User } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  message: string;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        fullName,
      });

      // Store tokens in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // Store tokens in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        // Send logout request to invalidate refresh token on server
        await api.post(`/auth/logout`, { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear tokens from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get(`/auth/me`);
      return response.data.user;
    } catch (error) {
      console.error("Error getting current user:", error);
      throw error;
    }
  },

  /**
   * Refresh the access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    try {
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
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post("/auth/reset-password", { token, newPassword });
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  },

  /**
   * Get authentication token
   */
  getToken(): string | null {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token requested but none found in localStorage");
      return null;
    }
    return token;
  },
};
