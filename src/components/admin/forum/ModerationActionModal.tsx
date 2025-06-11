import { useState } from "react";
import { X, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

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
  moderator_note?: string;
}

interface ModerationActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report;
  onSubmit: (action: "approve" | "reject", message: string) => void;
  isProcessing: boolean;
}

const ModerationActionModal = ({
  isOpen,
  onClose,
  report,
  onSubmit,
  isProcessing,
}: ModerationActionModalProps) => {
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [message, setMessage] = useState("");
  const [shouldTakeContentAction, setShouldTakeContentAction] = useState(true);
  const [shouldTakeUserAction, setShouldTakeUserAction] = useState(false);
  const [userActionType, setUserActionType] = useState<
    "warn" | "temporary_ban" | "permanent_ban"
  >("warn");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(action, message);
  };

  const isActionApprove = action === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            {isActionApprove ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Approve Report
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-5 w-5 text-red-500" />
                Reject Report
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isProcessing}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <div
                className={`flex-1 py-2 px-3 rounded-l text-center cursor-pointer transition-colors ${
                  action === "approve"
                    ? "bg-green-100 text-green-800 font-medium"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setAction("approve")}
              >
                Approve Report
              </div>
              <div
                className={`flex-1 py-2 px-3 rounded-r text-center cursor-pointer transition-colors ${
                  action === "reject"
                    ? "bg-red-100 text-red-800 font-medium"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setAction("reject")}
              >
                Reject Report
              </div>
            </div>

            {isActionApprove && (
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="content-action"
                    checked={shouldTakeContentAction}
                    onChange={() =>
                      setShouldTakeContentAction(!shouldTakeContentAction)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="content-action" className="text-sm">
                    Take action on reported content
                    {report.content_type === "thread"
                      ? " (delete thread)"
                      : " (delete post)"}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="user-action"
                    checked={shouldTakeUserAction}
                    onChange={() =>
                      setShouldTakeUserAction(!shouldTakeUserAction)
                    }
                    className="mr-2"
                  />
                  <label htmlFor="user-action" className="text-sm">
                    Take action against user
                  </label>
                </div>

                {shouldTakeUserAction && (
                  <div className="pl-6 pt-2">
                    <div className="text-sm font-medium mb-2">Action type:</div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="warn"
                          name="user-action-type"
                          value="warn"
                          checked={userActionType === "warn"}
                          onChange={() => setUserActionType("warn")}
                          className="mr-2"
                        />
                        <label htmlFor="warn" className="text-sm">
                          Warn user
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="temporary-ban"
                          name="user-action-type"
                          value="temporary_ban"
                          checked={userActionType === "temporary_ban"}
                          onChange={() => setUserActionType("temporary_ban")}
                          className="mr-2"
                        />
                        <label htmlFor="temporary-ban" className="text-sm">
                          Temporary ban (7 days)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="permanent-ban"
                          name="user-action-type"
                          value="permanent_ban"
                          checked={userActionType === "permanent_ban"}
                          onChange={() => setUserActionType("permanent_ban")}
                          className="mr-2"
                        />
                        <label htmlFor="permanent-ban" className="text-sm">
                          Permanent ban
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Add a note{" "}
                {isActionApprove
                  ? "(will be visible to reporter and content author)"
                  : "(internal only)"}
              </label>
              <textarea
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Explain the reason for your decision..."
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-sm text-gray-500 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              This action cannot be undone
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm disabled:opacity-50 flex items-center ${
                  isActionApprove
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isProcessing && (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                )}
                {isActionApprove ? "Approve & Take Action" : "Reject Report"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModerationActionModal;
