import { useQuery, useMutation } from "@tanstack/react-query";
import { moderationService } from "../services/moderationService";
import { queryClient, queryKeys } from "../lib/react-query";
import { toast } from "sonner";

export function useReportSummary() {
  return useQuery({
    queryKey: ["reportSummary"],
    queryFn: moderationService.getReportSummary,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useReportedContent(
  status: "pending" | "approved" | "rejected" | "all" = "pending"
) {
  return useQuery({
    queryKey: queryKeys.admin.reports(status),
    queryFn: () => moderationService.getReports(status),
  });
}

export function useProcessReport() {
  return useMutation({
    mutationFn: ({
      reportId,
      action,
      moderatorNote,
    }: {
      reportId: number;
      action: "approve" | "reject";
      moderatorNote?: string;
    }) => moderationService.processReport(reportId, action, moderatorNote),
    onSuccess: () => {
      // Invalidate all report statuses
      queryClient.invalidateQueries({ queryKey: ["reportSummary"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports() });
      toast.success("Report processed successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to process report");
    },
  });
}

export function useUserAction() {
  return useMutation({
    mutationFn: ({
      userId,
      actionType,
      reason,
    }: {
      userId: string;
      actionType: "warn" | "temporary_ban" | "permanent_ban";
      reason: string;
    }) => moderationService.takeUserAction(userId, actionType, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportSummary"] });
      toast.success("User action taken successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to take action on user");
    },
  });
}

export function useBlockedUsers() {
  return useQuery({
    queryKey: ["blockedUsers"],
    queryFn: moderationService.getBlockedUsers,
  });
}

export function useUnblockUser() {
  return useMutation({
    mutationFn: (userId: string) => moderationService.unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["reportSummary"] });
      toast.success("User unblocked successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to unblock user");
    },
  });
}

export function useUserModerationHistory(userId: string) {
  return useQuery({
    queryKey: ["userModerationHistory", userId],
    queryFn: () => moderationService.getUserModerationHistory(userId),
    enabled: !!userId,
  });
}
