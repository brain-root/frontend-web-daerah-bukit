import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreVertical,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import PostForm from "./PostForm";
import ReportModal from "./ReportModal";
import {
  useUpdatePost,
  useDeletePost,
  usePostReactions,
} from "../../hooks/useForum";
import { ForumPost } from "../../services/forumService";

interface PostProps {
  post: ForumPost;
  threadId: number;
  onPostDeleted?: () => void;
}

const Post: React.FC<PostProps> = ({ post, threadId, onPostDeleted }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Update post mutation
  const updatePostMutation = useUpdatePost();

  // Delete post mutation
  const deletePostMutation = useDeletePost();

  // Like/dislike mutations
  const { likePost, dislikePost, removeReaction } = usePostReactions();

  // Check if current user is the author
  const isAuthor = user && user.id === post.user_id;

  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus balasan ini?")) {
      deletePostMutation.mutate(post.id, {
        onSuccess: () => {
          toast.success("Balasan berhasil dihapus");
          if (onPostDeleted) {
            onPostDeleted();
          }
        },
        onError: () => {
          toast.error("Gagal menghapus balasan");
        },
      });
    }
    setShowDropdown(false);
  };

  const handleReport = () => {
    setIsReportModalOpen(true);
    setShowDropdown(false);
  };

  const handleUpdateSubmit = (content: string) => {
    updatePostMutation.mutate(
      {
        postId: post.id,
        content,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Balasan berhasil diperbarui");
          if (onPostDeleted) {
            onPostDeleted(); // Refresh data
          }
        },
        onError: () => {
          toast.error("Gagal memperbarui balasan");
        },
      }
    );
  };

  const handleReaction = (type: "like" | "dislike") => {
    if (!user) {
      toast.error("Anda harus login untuk memberikan reaksi");
      return;
    }

    if (post.user_reaction === type) {
      removeReaction.mutate(
        { postId: post.id, threadId },
        {
          onSuccess: onPostDeleted,
        }
      );
    } else if (type === "like") {
      likePost.mutate(
        { postId: post.id, threadId },
        {
          onSuccess: onPostDeleted,
        }
      );
    } else {
      dislikePost.mutate(
        { postId: post.id, threadId },
        {
          onSuccess: onPostDeleted,
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Post header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium">{post.author_name}</h4>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
                locale: id,
              })}
              {post.updated_at !== post.created_at && " (diedit)"}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <MoreVertical size={16} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg z-10 py-1">
              {isAuthor && (
                <>
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Hapus
                  </button>
                </>
              )}
              <button
                onClick={handleReport}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Flag size={14} className="mr-2" />
                Laporkan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      {isEditing ? (
        <PostForm
          initialValue={post.content}
          onSubmit={handleUpdateSubmit}
          isSubmitting={updatePostMutation.isPending}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Post actions */}
      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end space-x-4">
        <button
          onClick={() => handleReaction("like")}
          className={`flex items-center ${
            post.user_reaction === "like"
              ? "text-primary-600"
              : "text-gray-500 hover:text-primary-600"
          }`}
          disabled={
            likePost.isPending ||
            dislikePost.isPending ||
            removeReaction.isPending
          }
        >
          {post.user_reaction === "like" ? (
            <ThumbsUp size={16} className="mr-1 fill-current" />
          ) : (
            <ThumbsUp size={16} className="mr-1" />
          )}
          <span>{post.like_count || 0}</span>
        </button>

        <button
          onClick={() => handleReaction("dislike")}
          className={`flex items-center ${
            post.user_reaction === "dislike"
              ? "text-red-600"
              : "text-gray-500 hover:text-red-600"
          }`}
          disabled={
            likePost.isPending ||
            dislikePost.isPending ||
            removeReaction.isPending
          }
        >
          {post.user_reaction === "dislike" ? (
            <ThumbsDown size={16} className="mr-1 fill-current" />
          ) : (
            <ThumbsDown size={16} className="mr-1" />
          )}
          <span>{post.dislike_count || 0}</span>
        </button>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contentType="post"
        contentId={post.id}
      />
    </div>
  );
};

export default Post;
