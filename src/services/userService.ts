import api from "../lib/api";
import { User } from "../lib/auth";

export interface UserProfile extends User {
  profileImage?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UserUpdateInput {
  fullName?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UsersResponse {
  users: UserProfile[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const userService = {
  /**
   * Get all users (admin only)
   */
  async getAll(params?: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<UsersResponse> {
    try {
      const response = await api.get("/users", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<UserProfile> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get current user's profile
   */
  async getCurrentUserProfile(): Promise<UserProfile> {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user profile:", error);
      throw error;
    }
  },

  /**
   * Update user
   */
  async update(id: string, data: UserUpdateInput): Promise<UserProfile> {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update current user's profile
   */
  async updateProfile(data: UserUpdateInput): Promise<UserProfile> {
    try {
      const response = await api.put("/users/profile", data);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  /**
   * Change user password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await api.post("/users/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  /**
   * Delete user (admin only)
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload user profile image
   */
  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/users/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  },

  /**
   * Change user role (admin only)
   */
  async changeRole(userId: string, role: "user" | "admin"): Promise<void> {
    try {
      await api.post(`/users/${userId}/change-role`, { role });
    } catch (error) {
      console.error(`Error changing role for user ${userId}:`, error);
      throw error;
    }
  },
};
