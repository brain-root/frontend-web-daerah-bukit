import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "../services/eventService";
import { EventInput } from "../types/event";
import { toast } from "sonner";

// Define query keys
const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: any) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
  upcoming: ["events", "upcoming"] as const,
};

export function useEventsList(params?: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventService.getAll(params),
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.getById(id),
    enabled: !!id && id > 0,
  });
}

export function useUpcomingEvents(limit?: number) {
  return useQuery({
    queryKey: [...eventKeys.upcoming, limit],
    queryFn: () => eventService.getUpcoming(limit),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventInput) => eventService.create(data),
    onSuccess: () => {
      // Invalidate and refetch events lists
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming });
      toast.success("Acara berhasil dibuat");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Gagal membuat acara");
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EventInput> }) =>
      eventService.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific event and all lists
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming });
      toast.success("Acara berhasil diperbarui");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Gagal memperbarui acara");
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventService.delete(id),
    onSuccess: () => {
      // Invalidate and refetch events lists
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming });
      toast.success("Acara berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Gagal menghapus acara");
    },
  });
}

export function useUploadEventImage() {
  return useMutation({
    mutationFn: (file: File) => eventService.uploadImage(file),
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Gagal mengunggah gambar");
    },
  });
}
