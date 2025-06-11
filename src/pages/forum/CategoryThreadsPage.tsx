import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, MessageCircle, User, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Pagination from "../../components/ui/Pagination";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useAuth } from "../../contexts/AuthContext";
import { useForumCategory, useThreadsByCategory } from "../../hooks/useForum";

const CategoryThreadsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  // Get category details
  const {
    data: category,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useForumCategory(Number(categoryId));

  // Get threads in this category
  const {
    data: threadsData,
    isLoading: isThreadsLoading,
    error: threadsError,
  } = useThreadsByCategory(Number(categoryId), currentPage, 10, sortBy);

  const isLoading = isCategoryLoading || isThreadsLoading;
  const error = categoryError || threadsError;

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">Error loading category or threads.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/forum"
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Kembali ke Forum</span>
          </Link>
        </div>

        {/* Category Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">{category?.name}</h1>
              <p className="text-gray-600">{category?.description}</p>
            </div>
            {user && (
              <Link
                to={`/forum/category/${categoryId}/create`}
                className="btn btn-primary flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Buat Diskusi Baru
              </Link>
            )}
          </div>
        </div>

        {/* Thread List Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Menampilkan {threadsData?.threads?.length || 0} dari{" "}
            {threadsData?.totalCount || 0} diskusi
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setSortBy("newest")}
              className={`px-3 py-1 rounded-md text-sm ${
                sortBy === "newest"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Terbaru
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={`px-3 py-1 rounded-md text-sm ${
                sortBy === "popular"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Terpopuler
            </button>
          </div>
        </div>

        {/* Thread List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {threadsData?.threads && threadsData.threads.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {threadsData.threads.map((thread) => (
                <div
                  key={thread.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <Link to={`/forum/thread/${thread.id}`} className="block">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-primary-600 mb-2">
                        {thread.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(thread.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>

                    {thread.content && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {thread.content.replace(/<[^>]*>?/gm, "")}
                      </p>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex items-center mr-4">
                        <User size={14} className="mr-1" />
                        <span>{thread.author_name}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle size={14} className="mr-1" />
                        <span>{thread.reply_count || 0} balasan</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Belum ada diskusi di kategori ini.
              </p>
              {user && (
                <Link
                  to={`/forum/category/${categoryId}/create`}
                  className="btn btn-primary"
                >
                  Mulai Diskusi Pertama
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {threadsData?.totalPages && threadsData.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={threadsData.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryThreadsPage;
