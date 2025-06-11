import React from "react";
import { MessageSquare, MessageCircle, Users, User } from "lucide-react";

interface ForumStatsProps {
  stats: {
    totalThreads: number;
    totalPosts: number;
    totalUsers: number;
    newestUser: string;
  };
}

const ForumStats: React.FC<ForumStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-blue-50 mr-3">
            <MessageSquare size={16} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Diskusi</p>
            <p className="font-semibold">{stats.totalThreads}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="p-2 rounded-full bg-green-50 mr-3">
            <MessageCircle size={16} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Balasan</p>
            <p className="font-semibold">{stats.totalPosts}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="p-2 rounded-full bg-purple-50 mr-3">
            <Users size={16} className="text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Pengguna</p>
            <p className="font-semibold">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="p-2 rounded-full bg-amber-50 mr-3">
            <User size={16} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pengguna Terbaru</p>
            <p className="font-semibold">{stats.newestUser}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumStats;
