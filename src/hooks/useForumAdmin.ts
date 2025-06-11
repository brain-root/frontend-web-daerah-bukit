import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forumAdminService } from "../services/forumService";
import { queryKeys } from "../lib/react-query";
import { toast } from "sonner";

export function useCreateForumCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => forumAdminService.createCategory(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.categories });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      console.error("Create category error:", error);
      toast.error(error.response?.data?.error || "Failed to create category");
    },
  });
}

export function useUpdateForumCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; description?: string };
    }) => forumAdminService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.categories });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update category");
    },
  });
}

export function useDeleteForumCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => forumAdminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.categories });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete category");
    },
  });
}

export function useReportedContent(status?: string) {
  return useQuery({
    queryKey: [...queryKeys.admin.reports(status)],
    queryFn: () => forumAdminService.getReportedContent(status),
  });
}
