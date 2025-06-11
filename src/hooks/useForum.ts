import { useQuery, useMutation } from "@tanstack/react-query";
import { forumService } from "../services/forumService";
import { queryClient, queryKeys } from "../lib/react-query";
import { toast } from "sonner";

export function useForumCategories() {
  return useQuery({
    queryKey: queryKeys.forum.categories,
    queryFn: forumService.getCategories,
  });
}

export function useForumCategory(categoryId: number) {
  return useQuery({
    queryKey: queryKeys.forum.category(categoryId),
    queryFn: () => forumService.getCategoryById(categoryId),
    enabled: !!categoryId, // Only run query if categoryId is provided
  });
}

export function useThreadsByCategory(
  categoryId: number,
  page: number = 1,
  limit: number = 10,
  sortBy: string = "newest"
) {
  return useQuery({
    queryKey: [...queryKeys.forum.threads(categoryId), page, limit, sortBy],
    queryFn: () =>
      forumService.getThreadsByCategory(categoryId, page, limit, sortBy),
    enabled: !!categoryId, // Only run query if categoryId is provided
  });
}

// Get a specific thread by ID with its posts
export const useThread = (
  threadId: number,
  options?: { onError?: (error: any) => void }
) => {
  return useQuery({
    queryKey: queryKeys.forum.thread(threadId),
    queryFn: async () => {
      console.log(`useThread hook executing for threadId: ${threadId}`);

      // Simple validation
      if (!threadId || isNaN(threadId) || threadId <= 0) {
        throw new Error("Invalid thread ID");
      }

      try {
        console.log(`Making API request to get thread ${threadId}`);
        const data = await forumService.getThreadById(threadId);
        console.log(
          `API request success - received thread with title: ${
            data?.title || "No title"
          }`
        );
        return data;
      } catch (error) {
        console.error(`Error fetching thread ${threadId}:`, error);
        throw error;
      }
    },
    // Only run the query if we have a valid threadId
    enabled: Boolean(threadId && !isNaN(threadId) && threadId > 0),
    // Don't retry too many times
    retry: 1,
    // Show stale data while revalidating
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Don't keep old data in cache forever
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get recent threads
export function useRecentThreads(limit: number = 5) {
  return useQuery({
    queryKey: [...queryKeys.forum.recentThreads, limit],
    queryFn: () => forumService.getRecentThreads(Number(limit)),
  });
}

export function usePopularThreads(limit: number = 5) {
  return useQuery({
    queryKey: [queryKeys.forum.popularThreads, limit],
    queryFn: () => forumService.getPopularThreads(limit),
  });
}

export function useForumStats() {
  return useQuery({
    queryKey: queryKeys.forum.stats,
    queryFn: forumService.getForumStats,
  });
}

// Create a new thread
export function useCreateThread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      title,
      content,
    }: {
      categoryId: number;
      title: string;
      content: string;
    }) => {
      try {
        const result = await forumService.createThread(
          categoryId,
          title,
          content
        );
        return result;
      } catch (error: any) {
        console.error("Thread creation failed:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.forum.threads(variables.categoryId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forum.recentThreads,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.categories });

      // Return the created thread data
      return data;
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to create thread");
    },
  });
}

export function useUpdateThread() {
  return useMutation({
    mutationFn: ({
      threadId,
      title,
      content,
    }: {
      threadId: number;
      title: string;
      content: string;
    }) => forumService.updateThread(threadId, title, content),
    onSuccess: (_, { threadId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.forum.thread(threadId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forum.recentThreads,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forum.popularThreads,
      });
      toast.success("Thread updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to update thread");
    },
  });
}

export function useDeleteThread() {
  return useMutation({
    mutationFn: (threadId: number) => forumService.deleteThread(threadId),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.categories });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forum.recentThreads,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.forum.popularThreads,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.stats });
      toast.success("Thread deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to delete thread");
    },
  });
}

// Create a new post in a thread
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      threadId,
      content,
    }: {
      threadId: number;
      content: string;
    }) => {
      try {
        const result = await forumService.createPost(threadId, content);
        return result;
      } catch (error) {
        console.error("Post creation failed:", error);
        throw error;
      }
    },
    onSuccess: (_data, variables) => {
      // Invalidate the thread query to reload the posts
      queryClient.invalidateQueries({
        queryKey: queryKeys.forum.thread(variables.threadId),
      });
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to post reply");
    },
  });
}

export function useUpdatePost() {
  return useMutation({
    mutationFn: ({ postId, content }: { postId: number; content: string }) =>
      forumService.updatePost(postId, content),
    onSuccess: () => {
      toast.success("Reply updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to update reply");
    },
  });
}

export function useDeletePost() {
  return useMutation({
    mutationFn: (postId: number) => forumService.deletePost(postId),
    onSuccess: () => {
      toast.success("Reply deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to delete reply");
    },
  });
}

export function useReactToPost(
  threadId: number,
  action: "like" | "dislike" | "remove"
) {
  const mutation = useMutation({
    mutationFn: (postId: number) => {
      if (action === "like") return forumService.likePost(postId);
      if (action === "dislike") return forumService.dislikePost(postId);
      return forumService.removePostReaction(postId);
    },
    onSuccess: () => {
      // Invalidate thread to update reaction counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.forum.thread(threadId),
      });
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || `Failed to ${action} post`);
    },
  });

  return mutation;
}

export function useReportContent() {
  return useMutation({
    mutationFn: ({
      type,
      id,
      reason,
    }: {
      type: "thread" | "post";
      id: number;
      reason: string;
    }) => {
      if (type === "thread") return forumService.reportThread(id, reason);
      return forumService.reportPost(id, reason);
    },
    onSuccess: () => {
      toast.success("Content reported successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to report content");
    },
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => forumService.createCategory(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.categories });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: ({
      id,
      name,
      description,
    }: {
      id: number;
      name: string;
      description: string;
    }) => forumService.updateCategory(id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.categories });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: (id: number) => forumService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.categories });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to delete category");
    },
  });
}
