import { useQuery, useMutation } from "@tanstack/react-query";
import { businessService } from "../services/businessService";
import { Business, BusinessInput } from "../types/business";
import { queryClient, queryKeys } from "../lib/react-query";
import { toast } from "sonner";

export function useBusinessList(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [queryKeys.business.all, params],
    queryFn: () => businessService.getAll(params),
  });
}

export function useBusiness(id: number) {
  return useQuery({
    queryKey: queryKeys.business.byId(id),
    queryFn: () => businessService.getById(id),
    enabled: !!id, // Only run query if id is provided
  });
}

export function useFeaturedBusinesses(limit?: number) {
  return useQuery({
    queryKey: [queryKeys.business.featured, limit],
    queryFn: () => businessService.getFeatured(limit),
  });
}

export function useBusinessesByCategory(category: string, limit?: number) {
  return useQuery({
    queryKey: [...queryKeys.business.byCategory(category), limit],
    queryFn: () => businessService.getByCategory(category, limit),
    enabled: !!category, // Only run query if category is provided
  });
}

export function useCreateBusiness() {
  return useMutation({
    mutationFn: (data: BusinessInput) => businessService.create(data),
    onSuccess: () => {
      // Invalidate and refetch business lists
      queryClient.invalidateQueries({ queryKey: queryKeys.business.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.business.featured });
      toast.success("Business created successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to create business");
    },
  });
}

export function useUpdateBusiness() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BusinessInput> }) =>
      businessService.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific business and all lists
      queryClient.invalidateQueries({ queryKey: queryKeys.business.byId(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.business.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.business.featured });
      toast.success("Business updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to update business");
    },
  });
}

export function useDeleteBusiness() {
  return useMutation({
    mutationFn: (id: number) => businessService.delete(id),
    onSuccess: () => {
      // Invalidate and refetch business lists
      queryClient.invalidateQueries({ queryKey: queryKeys.business.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.business.featured });
      toast.success("Business deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to delete business");
    },
  });
}

export function useUploadBusinessImage() {
  return useMutation({
    mutationFn: (file: File) => businessService.uploadImage(file),
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to upload image");
    },
  });
}
