import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache is kept for 10 minutes
      refetchOnWindowFocus: true, // Refetch when window gains focus
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when reconnecting
      retry: 1, // Only retry failed queries once
    },
    mutations: {
      retry: 1, // Only retry failed mutations once
    },
  },
});

/**
 * Query keys for consistent cache management across the app
 */
export const queryKeys = {
  auth: {
    user: ["auth", "user"],
    profile: ["auth", "profile"],
  },
  tourism: {
    all: ["tourism"],
    byId: (id: number) => ["tourism", id],
    featured: ["tourism", "featured"],
    byCategory: (category: string) => ["tourism", "category", category],
  },
  business: {
    all: ["business"],
    byId: (id: number) => ["business", id],
    featured: ["business", "featured"],
    byCategory: (category: string) => ["business", "category", category],
  },
  events: {
    all: ["events"],
    byId: (id: number) => ["events", id],
    upcoming: ["events", "upcoming"],
  },
  forum: {
    categories: ["forum", "categories"],
    category: (id: number) => ["forum", "category", id],
    threads: (categoryId: number) => ["forum", "threads", categoryId],
    thread: (id: number) => ["forum", "thread", id],
    recentThreads: ["forum", "threads", "recent"],
    popularThreads: ["forum", "threads", "popular"],
    stats: ["forum", "stats"],
  },
  users: {
    all: ["users"],
    byId: (id: string) => ["users", id],
    profile: ["users", "profile"],
  },
  // For admin-specific queries
  admin: {
    dashboard: ["admin", "dashboard"],
    users: ["admin", "users"],
    reports: (status?: string) => ["admin", "reports", status || "all"],
  },
};

/**
 * Reset entire cache
 * Useful for scenarios like logout
 */
export const resetQueryCache = () => {
  queryClient.clear();
};
