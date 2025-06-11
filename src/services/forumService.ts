import api from "../lib/api";

// Types for forum data
export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  thread_count?: number;
  post_count?: number;
}

export interface ForumThread {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  user_id: string;
  author_name: string;
  category_id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
  reply_count?: number;
  like_count?: number;
  dislike_count?: number;
  user_reaction?: "like" | "dislike" | null;
  posts?: ForumPost[];
}

export interface ForumPost {
  id: number;
  content: string;
  user_id: string;
  author_name: string;
  thread_id: number;
  created_at: string;
  updated_at: string;
  like_count: number;
  dislike_count: number;
  user_reaction?: "like" | "dislike" | null;
}

export interface ForumStats {
  thread_count: number;
  post_count: number;
  user_count: number;
  newest_user: string;
}

export const forumService = {
  /**
   * Get all forum categories
   */
  async getCategories(): Promise<ForumCategory[]> {
    const response = await api.get("/forum/categories");
    return response.data;
  },

  /**
   * Get a specific forum category by ID
   */
  async getCategoryById(categoryId: number): Promise<ForumCategory> {
    const response = await api.get(`/forum/categories/${categoryId}`);
    return response.data;
  },

  /**
   * Get threads in a specific category
   */
  async getThreadsByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10,
    sortBy: string = "newest"
  ): Promise<{
    threads: ForumThread[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    const response = await api.get(`/forum/categories/${categoryId}/threads`, {
      params: { page, limit, sort: sortBy },
    });
    return response.data;
  },

  /**
   * Get thread by ID with posts
   */
  async getThreadById(threadId: number): Promise<ForumThread> {
    console.log(`forumService.getThreadById called with ID: ${threadId}`);

    try {
      // Basic validation
      if (!threadId || isNaN(threadId) || threadId <= 0) {
        throw new Error("Invalid thread ID provided");
      }

      const response = await api.get(`/forum/threads/${threadId}`);
      console.log(`API response for thread ${threadId}:`, {
        status: response.status,
        hasData: !!response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
      });

      if (!response.data) {
        throw new Error("Empty response received from server");
      }

      return response.data;
    } catch (error: any) {
      console.error(`Error in getThreadById for ID ${threadId}:`, error);

      if (error.response?.status === 404) {
        throw new Error(`Thread with ID ${threadId} not found`);
      }

      // Throw a more specific error with additional details
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          `Failed to load thread #${threadId}`
      );
    }
  },

  /**
   * Create a new thread
   */
  async createThread(
    categoryId: number,
    title: string,
    content: string
  ): Promise<ForumThread> {
    try {
      console.log(`Creating new thread in category ${categoryId}`);
      const response = await api.post(
        `/forum/categories/${categoryId}/threads`,
        {
          title,
          content,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error creating thread:`, error);
      // Rethrow with more specific message
      throw new Error(error.response?.data?.error || "Failed to create thread");
    }
  },

  /**
   * Create a post (reply) in a thread
   */
  async createPost(threadId: number, content: string): Promise<ForumPost> {
    try {
      const response = await api.post(`/forum/threads/${threadId}/posts`, {
        content,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error creating post in thread ${threadId}:`, error);
      throw new Error(error.response?.data?.error || "Failed to create reply");
    }
  },

  /**
   * Update a thread
   */
  async updateThread(
    threadId: number,
    title: string,
    content: string
  ): Promise<ForumThread> {
    const response = await api.put(`/forum/threads/${threadId}`, {
      title,
      content,
    });
    return response.data;
  },

  /**
   * Update a post
   */
  async updatePost(postId: number, content: string): Promise<ForumPost> {
    const response = await api.put(`/forum/posts/${postId}`, { content });
    return response.data;
  },

  /**
   * Delete a thread
   */
  async deleteThread(threadId: number): Promise<void> {
    await api.delete(`/forum/threads/${threadId}`);
  },

  /**
   * Delete a post
   */
  async deletePost(postId: number): Promise<void> {
    await api.delete(`/forum/posts/${postId}`);
  },

  /**
   * Get recent threads
   */
  async getRecentThreads(limit: number = 5): Promise<ForumThread[]> {
    const response = await api.get("/forum/threads/recent", {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get forum statistics
   */
  async getForumStats(): Promise<ForumStats> {
    const response = await api.get("/forum/stats");
    return response.data;
  },

  /**
   * Report a thread
   */
  async reportThread(threadId: number, reason: string): Promise<void> {
    await api.post(`/forum/threads/${threadId}/report`, { reason });
  },

  /**
   * Report a post
   */
  async reportPost(postId: number, reason: string): Promise<void> {
    await api.post(`/forum/posts/${postId}/report`, { reason });
  },

  /**
   * Search threads
   */
  async searchThreads(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    threads: ForumThread[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    const response = await api.get(`/forum/search`, {
      params: { query, page, limit },
    });
    return response.data;
  },
};

// Admin-specific functions
export const forumAdminService = {
  /**
   * Create a new forum category
   */
  async createCategory(
    name: string,
    description: string
  ): Promise<ForumCategory> {
    const response = await api.post("/forum/admin/categories", {
      name,
      description,
    });
    return response.data;
  },

  /**
   * Update a forum category
   */
  async updateCategory(
    id: number,
    data: { name?: string; description?: string }
  ): Promise<ForumCategory> {
    const response = await api.put(`/forum/admin/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a forum category
   */
  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/forum/admin/categories/${id}`);
  },

  /**
   * Get reported content
   */
  async getReportedContent(status?: string): Promise<any[]> {
    const response = await api.get("/forum/admin/reports", {
      params: { status },
    });
    return response.data.reports;
  },
};
