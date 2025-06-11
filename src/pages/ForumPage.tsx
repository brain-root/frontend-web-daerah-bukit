import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Users } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ForumCategoryList from "../components/forum/ForumCategoryList";
import RecentThreads from "../components/forum/RecentThreads";
import PopularThreads from "../components/forum/PopularThreads";
import ForumStats from "../components/forum/ForumStats";
import {
  useForumCategories,
  useRecentThreads,
  useForumStats,
} from "../hooks/useForum";
import { useAuth } from "../contexts/AuthContext";

const ForumPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories with React Query
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useForumCategories();

  // Fetch recent threads
  const {
    data: recentThreads,
    isLoading: recentThreadsLoading,
    error: recentThreadsError,
  } = useRecentThreads(5);

  // Fetch forum stats
  const {
    data: forumStats,
    isLoading: statsLoading,
    error: statsError,
  } = useForumStats();

  const isLoading = categoriesLoading || recentThreadsLoading || statsLoading;
  const hasError = categoriesError || recentThreadsError || statsError;

  // If there's an error loading data
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md max-w-md w-full">
          <h2 className="text-lg font-semibold mb-2">Error Loading Forum</h2>
          <p>Failed to load forum data. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          {" "}
          <img
            src="../../public/dis.jpeg"
            alt="Forum Diskusi Bukittinggi"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Forum Diskusi
            </h1>{" "}
            <p className="text-xl opacity-90">
              Berpartisipasilah dalam diskusi dengan warga dan pengunjung
              Bukittinggi
            </p>
          </div>
        </div>
      </section>

      {/* Main Forum Content */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (Categories) */}
            <div className="lg:col-span-2">
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Kategori Diskusi
                </h2>
                {user ? (
                  <div className="text-sm text-gray-600">
                    Pilih kategori untuk memulai diskusi baru
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Login untuk Berdiskusi
                  </Link>
                )}
              </div>

              {categoriesLoading ? (
                <div className="p-12 flex justify-center">
                  <LoadingSpinner size="large" />
                </div>
              ) : (
                <ForumCategoryList categories={categories || []} />
              )}
            </div>

            {/* Sidebar */}
            <div>
              {/* Forum Stats */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Statistik Forum
                </h3>
                {statsLoading ? (
                  <div className="p-6 flex justify-center">
                    <LoadingSpinner size="small" />
                  </div>
                ) : (
                  <ForumStats
                    stats={
                      forumStats || {
                        thread_count: 0,
                        post_count: 0,
                        user_count: 0,
                        newest_user: "No users yet",
                      }
                    }
                  />
                )}
              </div>

              {/* Recent Threads */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Diskusi Terbaru
                </h3>
                {recentThreadsLoading ? (
                  <div className="p-6 flex justify-center">
                    <LoadingSpinner size="small" />
                  </div>
                ) : (
                  <RecentThreads threads={recentThreads || []} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Panduan Komunitas
            </h2>
            <p className="text-gray-600 mb-6">
              Kami mendorong diskusi yang positif dan saling menghargai. Mohon
              ikuti panduan komunitas kami untuk menciptakan lingkungan forum
              yang ramah dan bermanfaat bagi semua.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Saling Menghormati
                </h3>
                <p className="text-gray-600">
                  Hargai pendapat orang lain meskipun berbeda dengan pendapat
                  Anda.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Konten Berkualitas
                </h3>
                <p className="text-gray-600">
                  Berikan informasi yang akurat dan bermanfaat bagi anggota
                  forum.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Jaga Privasi
                </h3>
                <p className="text-gray-600">
                  Jangan membagikan informasi pribadi Anda atau orang lain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForumPage;
