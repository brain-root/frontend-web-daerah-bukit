import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash } from "lucide-react";
import { useTourismList, useDeleteTourism } from "../../hooks/useTourism";
import AdminLayout from "../../components/admin/layout/AdminLayout"; // Fix the path to AdminLayout
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import TourismForm from "../../components/admin/tourism/TourismForm";
import { TourismDestination } from "../../types/tourism";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService"; // Correct import for authService

const AdminTourismPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<TourismDestination | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [destinationToDelete, setDestinationToDelete] =
    useState<TourismDestination | null>(null);

  const { refreshAuth } = useAuth(); // Get refreshAuth function from AuthContext
  const navigate = useNavigate();

  // Categories for filtering
  const categories = [
    "Semua",
    "Air Terjun",
    "Pemandangan",
    "Budaya",
    "Alam",
    "Danau",
  ];

  // Fetch tourism destinations
  const { data, isLoading, error, refetch } = useTourismList({
    category: selectedCategory === "Semua" ? undefined : selectedCategory,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 10,
  });

  // Delete mutation
  const deleteMutation = useDeleteTourism();

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Handle edit button click with auth verification
  const handleEdit = (destination: TourismDestination) => {
    setEditingDestination(destination);
    setIsModalOpen(true);
  };

  // Handle add new button click with auth verification
  const handleAddNew = () => {
    setEditingDestination(null);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (destination: TourismDestination) => {
    setDestinationToDelete(destination);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion with token check
  const confirmDelete = async () => {
    if (!destinationToDelete) return;

    try {
      // Don't use authService.getCurrentUser() here - it's causing an unnecessary check
      // that may be failing with different auth headers than the actual delete request

      await deleteMutation.mutateAsync(destinationToDelete.id);
      toast.success("Destinasi wisata berhasil dihapus");
      setIsDeleteModalOpen(false);
      setDestinationToDelete(null);
      refetch(); // Refresh the list
    } catch (error: any) {
      // Log the complete error for debugging
      console.error("Delete error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 401) {
        toast.error("Sesi login Anda telah habis. Silakan login kembali.");
      } else if (error.response?.status === 403) {
        toast.error(
          "Anda tidak memiliki izin untuk menghapus destinasi wisata ini"
        );
      } else {
        toast.error("Gagal menghapus destinasi wisata. Silakan coba lagi.");
      }

      // Don't automatically redirect - let the user handle it
    }
  };

  // Close the form modal and refresh data if needed
  const handleCloseModal = (refreshData = false) => {
    setIsModalOpen(false);
    if (refreshData) {
      refetch();
    }
  };

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Kelola Destinasi Wisata
          </h1>
          <button
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={16} className="mr-2" />
            Tambah Destinasi Baru
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <form onSubmit={handleSearch}>
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari destinasi wisata..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </form>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto py-2 md:py-0">
              <Filter size={20} className="text-gray-500 mr-1" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Destinations Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <p className="text-red-600 mb-3">
                Gagal memuat data destinasi wisata
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Coba Lagi
              </button>
            </div>
          ) : data?.destinations && data.destinations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nama Destinasi
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
                      Lokasi
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Featured
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
                  {data.destinations.map((destination) => (
                    <tr key={destination.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={
                                destination.image_url ||
                                "https://via.placeholder.com/100x100?text=No+Image"
                              }
                              alt={destination.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {destination.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {destination.category || "Tidak ada kategori"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {destination.location || "Tidak ada lokasi"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {destination.featured ? (
                          <span className="text-green-600">Ya</span>
                        ) : (
                          <span className="text-gray-400">Tidak</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(destination)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(destination)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Menampilkan{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * 10 + 1}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * 10, data.totalCount)}
                        </span>{" "}
                        dari{" "}
                        <span className="font-medium">{data.totalCount}</span>{" "}
                        hasil
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          &laquo; Prev
                        </button>

                        {[...Array(data.totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === i + 1
                                ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            } text-sm font-medium`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, data.totalPages)
                            )
                          }
                          disabled={currentPage === data.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next &raquo;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                Tidak ada destinasi wisata yang sesuai dengan pencarian Anda.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Semua");
                  setCurrentPage(1);
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <TourismForm
          destination={editingDestination}
          onClose={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && destinationToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Hapus Destinasi Wisata
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin menghapus destinasi wisata{" "}
                        <span className="font-semibold">
                          {destinationToDelete.name}
                        </span>
                        ? Tindakan ini tidak dapat dibatalkan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Hapus
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTourismPage;
