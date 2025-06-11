import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, Phone, MapPin } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import BusinessModal from "../../components/admin/business/BusinessModal";
import DeleteConfirmationModal from "../../components/admin/common/DeleteConfirmationModal";
import { useBusinessList, useDeleteBusiness } from "../../hooks/useBusiness";
import { Business } from "../../types/business";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Pagination from "../../components/ui/Pagination";
import { toast } from "sonner";

const AdminBusinessPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );

  // Fetch businesses from API
  const { data, isLoading, error, refetch } = useBusinessList({
    search: searchTerm || undefined,
    page: currentPage,
    limit: 10,
  });

  // Delete mutation
  const deleteMutation = useDeleteBusiness();

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle add business button click
  const handleAddBusiness = () => {
    setIsCreateModalOpen(true);
  };

  // Handle edit button click
  const handleEditClick = (business: Business) => {
    setSelectedBusiness(business);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (business: Business) => {
    setSelectedBusiness(business);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedBusiness) {
      try {
        await deleteMutation.mutateAsync(selectedBusiness.id);
        setIsDeleteModalOpen(false);
        setSelectedBusiness(null);
        refetch(); // Refresh the data
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete business");
      }
    }
  };

  // Handle modal close and refresh
  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedBusiness(null);
    refetch(); // Refresh the data
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Manajemen UMKM
          </h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Search and Add Section */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-xs w-full">
              <form onSubmit={handleSearch}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Cari UMKM..."
                />
              </form>
            </div>

            <button
              onClick={handleAddBusiness}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus size={16} className="mr-2" />
              Tambah UMKM
            </button>
          </div>

          {/* Business List */}
          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner size="large" />
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md my-4">
                <p className="text-red-500">Error loading businesses</p>
              </div>
            ) : (
              <div className="overflow-hidden shadow-sm border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        UMKM
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Kategori
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Lokasi & Kontak
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.businesses && data.businesses.length > 0 ? (
                      data.businesses.map((business) => (
                        <tr key={business.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={
                                    business.image_url ||
                                    "https://via.placeholder.com/100?text=No+Image"
                                  }
                                  alt={business.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {business.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {business.category ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-100 text-secondary-800">
                                {business.category}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                Tidak ada kategori
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {business.location && (
                              <div className="text-sm text-gray-900 flex items-center">
                                <MapPin size={16} className="flex-shrink-0" />
                                <span className="ml-1">
                                  {business.location}
                                </span>
                              </div>
                            )}
                            {business.contact && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Phone size={16} className="flex-shrink-0" />
                                <span className="ml-1">{business.contact}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditClick(business)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(business)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No businesses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {data?.totalPages && data.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BusinessModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {selectedBusiness && (
        <>
          <BusinessModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleSuccess}
            business={selectedBusiness}
          />

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete Business"
            message={`Are you sure you want to delete "${selectedBusiness.name}"? This action cannot be undone.`}
          />
        </>
      )}
    </AdminLayout>
  );
};

export default AdminBusinessPage;
