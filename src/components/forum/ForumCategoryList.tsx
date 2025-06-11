import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { ForumCategory } from "../../services/forumService";

interface ForumCategoryListProps {
  categories: ForumCategory[];
}

const ForumCategoryList: React.FC<ForumCategoryListProps> = ({
  categories,
}) => {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex-grow">
              <Link
                to={`/forum/category/${category.id}`}
                className="text-xl font-semibold text-primary-600 hover:text-primary-800 mb-2 block transition-colors"
              >
                {category.name}
              </Link>
              <p className="text-gray-600">
                {category.description || "No description"}
              </p>
            </div>
            <div className="flex flex-col items-end justify-center">
              <div className="flex items-center text-gray-500 mb-1">
                <MessageSquare size={16} className="mr-1" />
                <span>{category.thread_count || 0} diskusi</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {categories.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">Tidak ada kategori yang ditemukan.</p>
        </div>
      )}
    </div>
  );
};

export default ForumCategoryList;
