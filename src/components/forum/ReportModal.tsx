import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, Loader2, Flag } from "lucide-react";
import { forumService } from "../../services/forumService";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: "thread" | "post";
  contentId: number;
}

const reportReasons = [
  "Konten tidak pantas",
  "Spam atau promosi",
  "Pelecehan atau perundungan",
  "Informasi palsu",
  "Melanggar aturan forum",
  "Lainnya",
];

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  contentType,
  contentId,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");

  const reportMutation = useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      if (contentType === "thread") {
        return forumService.reportThread(contentId, reason);
      } else {
        return forumService.reportPost(contentId, reason);
      }
    },
    onSuccess: () => {
      toast.success("Laporan terkirim. Terima kasih atas masukan Anda.");
      onClose();
      // Reset form
      setSelectedReason("");
      setOtherReason("");
    },
    onError: () => {
      toast.error("Gagal mengirim laporan. Silakan coba lagi nanti.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!selectedReason) {
      toast.error("Silakan pilih alasan pelaporan");
      return;
    }

    if (selectedReason === "Lainnya" && !otherReason.trim()) {
      toast.error("Silakan masukkan alasan pelaporan");
      return;
    }

    // Submit report
    const finalReason =
      selectedReason === "Lainnya" ? otherReason : selectedReason;
    reportMutation.mutate({ reason: finalReason });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Flag className="w-5 h-5 mr-2 text-red-500" />
            Laporkan Konten
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="mb-4 text-gray-600">
            Silakan pilih alasan mengapa konten ini tidak pantas atau melanggar
            aturan forum.
          </p>

          <div className="space-y-2 mb-4">
            {reportReasons.map((reason) => (
              <label
                key={reason}
                className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md"
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === "Lainnya" && (
            <div className="mt-4">
              <label
                htmlFor="otherReason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Alasan lainnya
              </label>
              <textarea
                id="otherReason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Jelaskan mengapa Anda melaporkan konten ini..."
              ></textarea>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={
                reportMutation.isPending ||
                !selectedReason ||
                (selectedReason === "Lainnya" && !otherReason.trim())
              }
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
            >
              {reportMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Mengirim...
                </>
              ) : (
                "Kirim Laporan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
