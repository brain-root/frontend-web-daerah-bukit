import { useState } from "react";
import { Search, Filter, Map } from "lucide-react";
import { useTourismList } from "../hooks/useTourism";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Categories for filtering
const categories = [
  "Semua",
  "Air Terjun",
  "Pemandangan",
  "Budaya",
  "Alam",
  "Danau",
];

const TourismPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  // Use the hook to fetch tourism data
  const { data, isLoading, error } = useTourismList({
    category: selectedCategory === "Semua" ? undefined : selectedCategory,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 9, // Show 9 destinations per page
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://github.com/brain-root/frontend-web-daerah-bukit/blob/main/public/bukittinggi1.jpg?raw=true"
            alt="Wisata Bukittinggi"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Destinasi Wisata
            </h1>
            <p className="text-xl opacity-90">
              Jelajahi keindahan alam dan kekayaan budaya Bukittinggi yang
              menakjubkan
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
                    setCurrentPage(1); // Reset to first page when changing category
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
      </section>

      {/* Destinations List */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <p className="text-red-600 mb-3">Gagal memuat destinasi wisata</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Coba Lagi
              </button>
            </div>
          ) : data && data.destinations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.destinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="card group overflow-hidden"
                  >
                    <div className="aspect-w-16 aspect-h-9 relative h-60 overflow-hidden">
                      <img
                        src={
                          destination.image_url ||
                          "https://via.placeholder.com/600x400?text=No+Image"
                        }
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {destination.category && (
                        <div className="absolute top-4 left-4 bg-accent-500 text-white text-sm px-3 py-1 rounded-full">
                          {destination.category}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <Map size={16} className="mr-1" />
                        <span className="text-sm">{destination.location}</span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {destination.description}
                      </p>
                      <a
                        href={`/wisata/${destination.id}`}
                        className="text-primary-500 font-medium hover:text-primary-700 transition-colors"
                      >
                        Selengkapnya
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      &laquo; Prev
                    </button>

                    {[...Array(data.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === i + 1
                            ? "bg-primary-500 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
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
                      className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next &raquo;
                    </button>
                  </nav>
                </div>
              )}
            </>
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
                className="mt-4 btn btn-primary"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TourismPage;
