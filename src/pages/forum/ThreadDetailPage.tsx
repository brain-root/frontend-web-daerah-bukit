import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, AlertTriangle } from "lucide-react";
import { useThread } from "../../hooks/useForum";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ThreadDetailPage = () => {
  // Get the thread ID from URL params
  const { threadId } = useParams<{ threadId: string }>();
  console.log(`ThreadDetailPage - threadId from params: ${threadId}`);

  // Basic thread data fetching with proper error handling
  const {
    data: thread,
    isLoading,
    error,
  } = useThread(threadId ? parseInt(threadId, 10) : 0);

  console.log("Thread data state:", {
    threadExists: !!thread,
    isLoading,
    hasError: !!error,
    errorMessage: error ? String(error) : null,
  });

  // Simplified view that focuses on showing the thread exists
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="large" />
            <span className="ml-3">Loading thread...</span>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 p-6 rounded-lg shadow text-center max-w-lg mx-auto">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Error Loading Thread
            </h2>
            <p className="text-red-600 mb-4">
              {error instanceof Error
                ? error.message
                : "Failed to load thread data"}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded"
              >
                Try Again
              </button>
              <Link
                to="/forum"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
              >
                Back to Forum
              </Link>
            </div>
            <div className="mt-4 p-4 border border-red-200 bg-white rounded text-xs text-left overflow-auto">
              <p className="font-semibold">Debug information:</p>
              <p>Thread ID: {threadId || "Not provided"}</p>
              <p>
                Error type:{" "}
                {error instanceof Error ? error.constructor.name : "Unknown"}
              </p>
            </div>
          </div>
        )}

        {/* Success state - minimalist version to debug */}
        {!isLoading && !error && thread && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <Link
                to="/forum"
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                <ArrowLeft size={16} className="mr-1" />
                <span>Back to Forum</span>
              </Link>
            </div>

            <h1 className="text-2xl font-bold mb-4">
              {thread.title || "Untitled Thread"}
            </h1>

            <div className="prose max-w-none mb-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: thread.content || "No content",
                }}
              />
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-medium mb-2 flex items-center">
                <MessageSquare size={18} className="mr-2" />
                Replies ({thread.posts?.length || 0})
              </h2>

              {thread.posts && thread.posts.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {thread.posts.map((post) => (
                    <div key={post.id} className="bg-gray-50 p-4 rounded">
                      <p className="text-sm font-medium">{post.author_name}</p>
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No replies yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Not found state */}
        {!isLoading && !error && !thread && (
          <div className="bg-yellow-50 p-6 rounded-lg shadow text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-yellow-700 mb-2">
              Thread Not Found
            </h2>
            <p className="text-yellow-600 mb-4">
              The thread you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/forum"
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded"
            >
              Back to Forum
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadDetailPage;
