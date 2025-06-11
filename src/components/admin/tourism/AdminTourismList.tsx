import { useState } from "react";
import { useTourismList, useDeleteTourism } from "../../../hooks/useTourism";
import { Search, Filter, Edit, Trash2, MapPin } from "lucide-react";
import LoadingSpinner from "../../ui/LoadingSpinner";
import TourismModal from "./TourismModal";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import Pagination from "../../ui/Pagination";

const AdminTourismList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  // Categories for tourism
  const categories = [
    "all",
    "Air Terjun",
    "Pemandangan",
    "Budaya",
    "Alam",
    "Danau",
  ];

  // Fetch tourism destinations with React Query
  const { data, isLoading, error } = useTourismList({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 8,
  });

  const deleteMutation = useDeleteTourism();

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle edit button click
  const handleEditClick = (destination: any) => {
    setSelectedDestination(destination);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (destination: any) => {
    setSelectedDestination(destination);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (selectedDestination) {
      deleteMutation.mutate(selectedDestination.id);
      setIsDeleteModalOpen(false);
      setSelectedDestination(null);
    }
  };

  // Handle modal close and refresh
  const handleModalClose = (shouldRefresh: boolean = false) => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedDestination(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
          </div>

          {/* Category filter */}
          <div className="flex items-center space-x-2 overflow-x-auto py-2 md:py-0">
            <Filter size={20} className="text-gray-500 mr-1" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category === "all" ? "All Categories" : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tourism List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">Error loading destinations</p>
        </div>
      ) : (
        <div>
          {data?.destinations && data.destinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.destinations.map((destination) => (
                <div
                  key={destination.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9 relative h-48">
                    <img
                      src={
                        destination.image_url ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    {destination.category && (
                      <div className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-md p-1">
                        <div className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-800">
                          {destination.category}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {destination.name}
                    </h3>
                    <div className="flex items-start space-x-2 text-gray-600 mb-2">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {destination.location || "No location specified"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {destination.description || "No description available"}
                    </p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEditClick(destination)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(destination)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 mb-4">No destinations found.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="btn btn-outline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {data?.totalPages && data.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <TourismModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        destination={null}
      />

      {/* Edit Modal */}
      {selectedDestination && (
        <TourismModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          destination={selectedDestination}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Tourism Destination"
        message={`Are you sure you want to delete "${selectedDestination?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminTourismList;
