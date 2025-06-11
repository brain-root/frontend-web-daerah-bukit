import api from "../lib/api";
import { Business, BusinessInput } from "../types/business";

export interface BusinessResponse {
  businesses: Business[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const businessService = {
  /**
   * Get all businesses with optional filtering
   */
  async getAll(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<BusinessResponse> {
    try {
      const response = await api.get("/business", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching businesses:", error);
      throw error;
    }
  },

  /**
   * Get a business by ID
   */
  async getById(id: number): Promise<Business> {
    try {
      const response = await api.get(`/business/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching business with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new business
   */
  async create(data: BusinessInput): Promise<Business> {
    try {
      const response = await api.post("/business", data);
      return response.data;
    } catch (error) {
      console.error("Error creating business:", error);
      throw error;
    }
  },

  /**
   * Update an existing business
   */
  async update(id: number, data: Partial<BusinessInput>): Promise<Business> {
    try {
      const response = await api.put(`/business/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating business with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a business
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/business/${id}`);
    } catch (error) {
      console.error(`Error deleting business with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload an image for a business
   */
  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/business/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading business image:", error);
      throw error;
    }
  },

  /**
   * Get featured businesses
   */
  async getFeatured(limit: number = 3): Promise<Business[]> {
    try {
      const response = await api.get("/business/featured", {
        params: { limit },
      });
      return response.data.businesses;
    } catch (error) {
      console.error("Error fetching featured businesses:", error);
      throw error;
    }
  },

  /**
   * Get businesses by category
   */
  async getByCategory(category: string, limit?: number): Promise<Business[]> {
    try {
      const response = await api.get("/business/category", {
        params: { category, limit },
      });
      return response.data.businesses;
    } catch (error) {
      console.error(
        `Error fetching businesses in category ${category}:`,
        error
      );
      throw error;
    }
  },
};
