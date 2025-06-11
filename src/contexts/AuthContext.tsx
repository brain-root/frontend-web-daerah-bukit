import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { User } from "../lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // Add a processing state to prevent multiple calls
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          console.log(
            "Token found during initialization, attempting to get user data"
          );
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to get user from token", error);
          // Clear invalid tokens
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      } else {
        console.log("No authentication token found during initialization");
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    if (processing) return; // Prevent multiple calls

    setProcessing(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      console.log("User logged in successfully, token stored in localStorage");
    } finally {
      setProcessing(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    if (processing) return; // Prevent multiple calls

    setProcessing(true);
    try {
      const response = await authService.register(email, password, fullName);
      setUser(response.user);
    } finally {
      setProcessing(false);
    }
  };

  const logout = async () => {
    if (processing) return; // Prevent multiple calls

    setProcessing(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setProcessing(false);
    }
  };

  // Add a utility function to force token refresh
  const refreshAuth = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;

      const newToken = await authService.refreshAccessToken();
      console.log("Auth token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Failed to refresh authentication", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshAuth, // Add the new utility function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
