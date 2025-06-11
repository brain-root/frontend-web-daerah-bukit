import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { authService } from "../services/authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create a custom axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh token calls
let isRefreshing = false;
// Store pending requests
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}[] = [];

// Process failed requests queue
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Helper to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    return true; // If error parsing token, assume it's expired
  }
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Always get a fresh token from localStorage rather than cached values
    const token = localStorage.getItem("token");

    if (token) {
      // Add Authorization header if token exists
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;

      // Add more specific debug for different endpoints
      const isAdminEndpoint =
        config.url?.includes("/tourism/") &&
        (config.method === "delete" ||
          config.method === "put" ||
          config.method === "post");

      if (isAdminEndpoint) {
        console.log(
          `[Admin API Request] ${config.method?.toUpperCase()} ${
            config.url
          } - Token: ${token.substring(0, 15)}...`
        );

        // Log the decoded token payload for admin endpoints
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log(
            "[Admin API Request] Token payload:",
            JSON.stringify(payload)
          );
        } catch (e) {
          console.error("[Admin API Request] Could not decode token:", e);
        }
      }
    } else {
      console.warn(
        `[API Warning] ${config.method?.toUpperCase()} ${
          config.url || ""
        } - No auth token available`
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Success] ${
          response.status
        } ${response.config.method?.toUpperCase()} ${response.config.url}`
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Log detailed error information for debugging
    console.error(`[API Error] ${error.message}`, {
      url: originalRequest?.url,
      method: originalRequest?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: originalRequest?.headers,
    });

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("[Auth Debug] Attempting token refresh...");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.error("[Auth Debug] No refresh token available");
          throw new Error("No refresh token available");
        }

        // Try to refresh token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        console.log("[Auth Debug] Token refreshed successfully");

        // Update auth header and retry
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Use axios directly for the retry instead of the api instance
        // This avoids potential infinite loops
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("[Auth Debug] Token refresh failed:", refreshError);

        // Don't automatically redirect - just reject with the error
        processQueue(refreshError, null);
        return Promise.reject(error);
      }
    }

    // Pass through the original error
    return Promise.reject(error);
  }
);

export default api;
