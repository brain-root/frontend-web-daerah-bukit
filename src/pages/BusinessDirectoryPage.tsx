import { useState } from "react";
import { Search, Filter, MapPin, Phone } from "lucide-react";
import { useBusinessList } from "../hooks/useBusiness";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Pagination from "../components/ui/Pagination";

// Categories for filtering
const categories = ["Semua", "Kerajinan", "Kuliner", "Jasa", "Pertanian"];

const BusinessDirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9; // Items per page

  // Fetch businesses from API with filters
  const { data, isLoading, error } = useBusinessList({
    category: selectedCategory !== "Semua" ? selectedCategory : undefined,
    search: searchTerm || undefined,
    page: currentPage,
    limit,
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Reset filters handler
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Semua");
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="../../public/umkm.jpg"
            alt="UMKM Bukittinggi"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Direktori UMKM
            </h1>
            <p className="text-xl opacity-90">
              Temukan produk dan jasa berkualitas dari para pelaku usaha lokal
              Bukittinggi
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-md sticky top-16 z-30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <form onSubmit={handleSearch}>
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari UMKM atau produk..."
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
                    setCurrentPage(1); // Reset page when changing category
                  }}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-secondary-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business List */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">Gagal memuat data UMKM</p>
              <button onClick={resetFilters} className="btn btn-primary">
                Coba Lagi
              </button>
            </div>
          ) : data?.businesses && data.businesses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.businesses.map((business) => (
                  <div key={business.id} className="card group overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 relative h-60 overflow-hidden">
                      <img
                        src={
                          business.image_url ||
                          "https://via.placeholder.com/640x360?text=No+Image"
                        }
                        alt={business.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {business.category && (
                        <div className="absolute top-4 left-4 bg-secondary-500 text-white text-sm px-3 py-1 rounded-full">
                          {business.category}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {business.name}
                      </h3>
                      {business.location && (
                        <div className="flex items-start space-x-2 text-gray-600 mb-2">
                          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{business.location}</span>
                        </div>
                      )}
                      {business.contact && (
                        <div className="flex items-center text-gray-600 mb-3">
                          <Phone size={16} className="mr-1 flex-shrink-0" />
                          <span className="text-sm">{business.contact}</span>
                        </div>
                      )}
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {business.description}
                      </p>
                      <Link
                        to={`/umkm/${business.id}`}
                        className="text-secondary-500 font-medium hover:text-secondary-700 transition-colors"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="mt-10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={data.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                Tidak ada UMKM yang sesuai dengan pencarian Anda.
              </p>
              <button onClick={resetFilters} className="mt-4 btn btn-secondary">
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BusinessDirectoryPage;
