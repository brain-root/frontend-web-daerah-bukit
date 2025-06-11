import api from "../lib/api";

type ReportStatus = "pending" | "approved" | "rejected" | "all";

interface ReportSummary {
  pendingReports: number;
  totalThreads: number;
  totalPosts: number;
  blockedUsers: number;
}

interface Report {
  id: number;
  content_type: "thread" | "post";
  content_id: number;
  thread_id?: number;
  reason: string;
  reporter_id: string;
  reporter_name: string;
  author_id: string;
  author_name: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  content_preview: string;
  moderator_id?: string;
  moderator_name?: string;
  moderator_note?: string;
  action_taken?: string;
}

export const moderationService = {
  /**
   * Get forum moderation statistics
   */
  async getReportSummary(): Promise<ReportSummary> {
    const response = await api.get("/forum/moderation/summary");
    return response.data;
  },

  /**
   * Get reported content
   */
  async getReports(status: ReportStatus = "pending"): Promise<Report[]> {
    const response = await api.get(`/forum/moderation/reports`, {
      params: { status },
    });
    return response.data;
  },

  /**
   * Process a report
   */
  async processReport(
    reportId: number,
    action: "approve" | "reject",
    moderatorNote?: string
  ): Promise<void> {
    await api.post(`/forum/moderation/reports/${reportId}/process`, {
      action,
      moderatorNote,
    });
  },

  /**
   * Take action against a user
   */
  async takeUserAction(
    userId: string,
    actionType: "warn" | "temporary_ban" | "permanent_ban",
    reason: string
  ): Promise<void> {
    await api.post(`/forum/moderation/users/${userId}/action`, {
      actionType,
      reason,
    });
  },

  /**
   * Get user moderation history
   */
  async getUserModerationHistory(userId: string): Promise<any[]> {
    const response = await api.get(`/forum/moderation/users/${userId}/history`);
    return response.data;
  },

  /**
   * Get blocked users
   */
  async getBlockedUsers(): Promise<any[]> {
    const response = await api.get(`/forum/moderation/users/blocked`);
    return response.data;
  },

  /**
   * Unblock a user
   */
  async unblockUser(userId: string): Promise<void> {
    await api.post(`/forum/moderation/users/${userId}/unblock`);
  },
};
