import React, { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs";
import { useForumCategories } from "../../hooks/useForum";
import { useReportedContent } from "../../hooks/useForumAdmin";
import ForumCategoriesManagement from "../../components/admin/forum/ForumCategoriesManagement";
import ReportedContentList from "../../components/admin/forum/ReportedContentList";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const AdminForumPage = () => {
  const [activeTab, setActiveTab] = useState("categories");

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useForumCategories();

  // Fetch reported content
  const {
    data: reports,
    isLoading: reportsLoading,
    error: reportsError,
  } = useReportedContent();

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Forum Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage forum categories and moderate reported content
          </p>
        </div>

        <Tabs
          defaultValue="categories"
          onValueChange={setActiveTab}
          value={activeTab}
          className="w-full"
        >
          <TabsList className="mb-8">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="reports">Reported Content</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            {categoriesLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : categoriesError ? (
              <div className="bg-red-50 p-6 rounded-lg text-center">
                <p className="text-red-600 mb-3">Failed to load categories</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <ForumCategoriesManagement categories={categories || []} />
            )}
          </TabsContent>

          <TabsContent value="reports">
            {reportsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : reportsError ? (
              <div className="bg-red-50 p-6 rounded-lg text-center">
                <p className="text-red-600 mb-3">Failed to load reports</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <ReportedContentList reports={reports || []} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminForumPage;
