import React, { useState } from "react";
import { Send, Loader2, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

interface PostFormProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  initialValue?: string;
  onCancel?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialValue = "",
  onCancel,
}) => {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    onSubmit(content);

    // Only reset if not editing (no initialValue provided)
    if (!initialValue) {
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Tulis balasan Anda di sini..."
      />

      <div className="mt-3 flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Batal
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-75"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {initialValue ? "Simpan" : "Kirim Balasan"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
