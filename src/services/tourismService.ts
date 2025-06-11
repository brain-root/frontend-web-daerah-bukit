import api from "../lib/api";
import { TourismDestination, TourismDestinationInput } from "../types/tourism";

export interface TourismImage {
  id: number;
  tourism_id: number;
  image_url: string;
  caption?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface TourismResponse {
  destinations: TourismDestination[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const tourismService = {
  /**
   * Get all tourism destinations with optional filtering
   */
  async getAll(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<TourismResponse> {
    try {
      console.log("Fetching tourism destinations with params:", params);
      const response = await api.get("/tourism", { params });
      console.log("Tourism API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching tourism destinations:", error);
      throw error;
    }
  },

  /**
   * Get a tourism destination by ID
   */
  async getById(id: number): Promise<TourismDestination> {
    try {
      console.log(`Fetching tourism destination with ID: ${id}`);
      // Use the endpoint that returns images
      const response = await api.get(`/tourism/${id}/images`);
      console.log("Tourism detail response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tourism destination with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new tourism destination
   */
  async create(data: TourismDestinationInput): Promise<TourismDestination> {
    try {
      console.log("Creating tourism destination with data:", data);

      // Verify auth token exists before request
      const token = localStorage.getItem("token");
      if (!token) {
        console.error(
          "No authentication token available when creating destination"
        );
        throw new Error("Authentication required");
      }

      // Pastikan data terformat dengan benar
      const formattedData = {
        name: data.name,
        description: data.description || "",
        location: data.location || "",
        category: data.category || "",
        image_url: data.image_url || "",
        featured: data.featured === true,
      };

      const response = await api.post("/tourism", formattedData);
      console.log("Create tourism response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating tourism destination:", error);
      throw error;
    }
  },

  /**
   * Update an existing tourism destination
   */
  async update(
    id: number,
    data: Partial<TourismDestinationInput>
  ): Promise<TourismDestination> {
    try {
      console.log(`Updating tourism destination ${id} with data:`, data);

      // Verify auth token exists before request
      const token = localStorage.getItem("token");
      if (!token) {
        console.error(
          `No authentication token available when updating destination ${id}`
        );
        throw new Error("Authentication required");
      }

      // Pastikan data valid
      const formattedData = Object.keys(data).reduce((acc, key) => {
        const value = data[key as keyof TourismDestinationInput];
        if (value !== undefined && value !== null) {
          acc[key as keyof TourismDestinationInput] = value;
        }
        return acc;
      }, {} as Partial<TourismDestinationInput>);

      const response = await api.put(`/tourism/${id}`, formattedData);
      console.log("Update tourism response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating tourism destination with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a tourism destination
   */
  async delete(id: number): Promise<void> {
    try {
      console.log(
        `[Debug] Attempting to delete tourism destination with id ${id}`
      );

      // Get fresh token directly
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          "[Debug] No authentication token available for delete operation"
        );
        throw new Error("Authentication required");
      }

      // Use axios directly with explicit headers rather than the api instance
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";

      console.log(`[Debug] Using token: Bearer ${token.substring(0, 15)}...`);

      await axios.delete(`${API_URL}/tourism/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("[Debug] Tourism destination deleted successfully");
    } catch (error) {
      console.error(`[Debug] Error deleting tourism destination:`, error);
      throw error;
    }
  },

  /**
   * Upload an image for a tourism destination
   */
  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      console.log("Uploading image:", file.name, "size:", file.size);

      const response = await api.post("/tourism/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading tourism image:", error);
      throw error;
    }
  },

  /**
   * Upload multiple images for a tourism destination
   */
  async uploadImages(
    tourismId: number,
    files: FormData,
    onProgress?: (progress: number) => void
  ): Promise<{ images: TourismImage[] }> {
    try {
      console.log(`Uploading images for tourism destination ${tourismId}`);

      // Create custom axios instance with progress config
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        },
      };

      const response = await api.post(
        `/tourism/${tourismId}/images`,
        files,
        uploadConfig
      );

      console.log("Upload images response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error uploading images for tourism ${tourismId}:`, error);
      throw error;
    }
  },

  /**
   * Set an image as primary
   */
  async setImageAsPrimary(
    imageId: number
  ): Promise<{ image: TourismImage; allImages: TourismImage[] }> {
    try {
      console.log(`Setting image ${imageId} as primary`);
      const response = await api.put(`/tourism/images/${imageId}/primary`);
      console.log("Set primary response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error setting image ${imageId} as primary:`, error);
      throw error;
    }
  },

  /**
   * Delete a tourism image
   */
  async deleteImage(imageId: number): Promise<{ images: TourismImage[] }> {
    try {
      console.log(`Deleting image ${imageId}`);
      const response = await api.delete(`/tourism/images/${imageId}`);
      console.log("Delete image response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting image ${imageId}:`, error);
      throw error;
    }
  },

  /**
   * Get featured tourism destinations
   */
  async getFeatured(limit: number = 5): Promise<TourismDestination[]> {
    try {
      console.log(
        `Fetching featured tourism destinations with limit: ${limit}`
      );
      const response = await api.get("/tourism/featured", {
        params: { limit },
      });
      console.log("Featured tourism response:", response.data);
      return response.data.destinations;
    } catch (error) {
      console.error("Error fetching featured tourism destinations:", error);
      throw error;
    }
  },
};
