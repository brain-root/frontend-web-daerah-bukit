import api from "../lib/api";

/**
 * Utility for testing authentication functionality directly from the browser console
 * Run window.testAuth() to check if auth is working
 */
export const setupDebugHelpers = () => {
  // Make the function available in the global scope
  (window as any).testAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return { success: false, error: "No token found" };
      }

      console.log(
        "Testing authentication with token:",
        token.substring(0, 15) + "..."
      );

      const response = await api.get("/auth/me");
      console.log("Auth successful:", response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Auth test failed:", error);
      return {
        success: false,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      };
    }
  };

  (window as any).deleteDestination = async (id: number) => {
    try {
      if (!id) {
        console.error("Please provide a destination ID");
        return { success: false, error: "No ID provided" };
      }

      console.log(`Attempting to delete destination with ID: ${id}`);
      const response = await api.delete(`/tourism/${id}`);
      console.log("Delete successful:", response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Delete failed:", error);
      return {
        success: false,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      };
    }
  };

  console.log(
    "Debug helpers loaded. Use window.testAuth() or window.deleteDestination(id) to test."
  );
};
