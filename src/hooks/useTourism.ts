import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tourismService } from "../services/tourismService";
import { TourismDestinationInput } from "../types/tourism";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Hook to get tourism destinations list with filtering
export const useTourismList = (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["tourism", params],
    queryFn: () => tourismService.getAll(params),
  });
};

// Hook to get a single tourism destination by ID
export const useTourismDetail = (id: number) => {
  return useQuery({
    queryKey: ["tourism", id],
    queryFn: async () => {
      // Use the endpoint that includes images
      const data = await tourismService.getById(id);
      console.log("Tourism detail with images:", data);
      return data;
    },
    enabled: !!id && id > 0,
  });
};

// Hook to get featured tourism destinations
export const useFeaturedTourism = (limit: number = 5) => {
  return useQuery({
    queryKey: ["tourism", "featured", limit],
    queryFn: () => tourismService.getFeatured(limit),
  });
};

// Hook to create a tourism destination
export const useCreateTourism = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TourismDestinationInput) => tourismService.create(data),
    onSuccess: () => {
      // Invalidate and refetch tourism list queries
      queryClient.invalidateQueries({ queryKey: ["tourism"] });
      toast.success("Destinasi wisata berhasil ditambahkan");
    },
    onError: (error: any) => {
      console.error("Create tourism error:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Gagal menambahkan destinasi wisata"
      );
    },
  });
};

// Hook to delete a tourism destination
export const useDeleteTourism = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Get fresh token before operation
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Use direct axios call instead of the API client
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      console.log(`[Debug] DELETE ${API_URL}/tourism/${id}`);
      console.log(`[Debug] Using token: ${token.substring(0, 15)}...`);

      const response = await axios.delete(`${API_URL}/tourism/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch tourism list queries
      queryClient.invalidateQueries({ queryKey: ["tourism"] });
    },
    onError: (error: any) => {
      console.error("[Debug] Delete tourism error:", error);
    },
  });
};

// Hook to update a tourism destination
export const useUpdateTourism = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TourismDestinationInput>;
    }) => {
      // Get fresh token before operation
      const token = localStorage.getItem("token");
      console.log("[Debug] Update operation - token available:", !!token);

      // Let the API client handle auth errors - don't throw here
      return tourismService.update(id, data);
    },
    onSuccess: (_, { id }) => {
      // Invalidate specific tourism queries
      queryClient.invalidateQueries({ queryKey: ["tourism", id] });
      queryClient.invalidateQueries({ queryKey: ["tourism"] });
    },
    onError: (error: any) => {
      console.error("[Debug] Update tourism error:", {
        message: error.message,
        data: error.response?.data,
        status: error.response?.status,
      });

      // Don't show toast here - leave error handling to the component
    },
  });
};

// Hook to upload a tourism destination image
export const useUploadTourismImage = () => {
  return useMutation({
    mutationFn: (file: File) => tourismService.uploadImage(file),
    onError: (error: any) => {
      console.error("Upload image error:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Gagal mengunggah gambar"
      );
    },
  });
};

// Hook to upload multiple tourism destination images
export const useUploadTourismImages = () => {
  return useMutation({
    mutationFn: ({
      tourismId,
      files,
      onProgress,
    }: {
      tourismId: number;
      files: FormData;
      onProgress?: (progress: number) => void;
    }) => tourismService.uploadImages(tourismId, files, onProgress),
    onError: (error: any) => {
      console.error("Upload images error:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Gagal mengunggah gambar"
      );
    },
  });
};

// Hook to set a tourism image as primary
export const useSetImageAsPrimary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) => tourismService.setImageAsPrimary(imageId),
    onSuccess: (_, imageId) => {
      queryClient.invalidateQueries({ queryKey: ["tourism"] });
      toast.success("Gambar utama berhasil diubah");
    },
    onError: (error: any) => {
      console.error("Set primary image error:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Gagal mengubah gambar utama"
      );
    },
  });
};

// Hook to delete a tourism image
export const useDeleteTourismImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) => tourismService.deleteImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tourism"] });
      toast.success("Gambar berhasil dihapus");
    },
    onError: (error: any) => {
      console.error("Delete image error:", error);
      toast.error(
        error.response?.data?.error || error.message || "Gagal menghapus gambar"
      );
    },
  });
};
