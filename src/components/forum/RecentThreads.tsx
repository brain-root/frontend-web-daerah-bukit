import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface ThreadSummary {
  id: number;
  title: string;
  categoryId: number;
  categoryName: string;
  author: string;
  createdAt: string;
  replyCount: number;
}

interface RecentThreadsProps {
  threads: ThreadSummary[];
}

const RecentThreads: React.FC<RecentThreadsProps> = ({ threads }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: id,
      });
    } catch (e) {
      return "Unknown time";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {threads.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link
                to={`/forum/thread/${thread.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {thread.title}
                </h4>

                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs font-medium text-primary-600">
                    {thread.categoryName}
                  </span>

                  <div className="flex items-center text-xs text-gray-500">
                    <MessageSquare size={12} className="mr-1" />
                    <span>{thread.replyCount}</span>
                  </div>
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  <span>{thread.author}</span>
                  <span className="mx-1">·</span>
                  <span>{formatDate(thread.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">
          Belum ada diskusi
        </div>
      )}
    </div>
  );
};

export default RecentThreads;
