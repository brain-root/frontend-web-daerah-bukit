import { Link } from "react-router-dom";
import { useFeaturedBusinesses } from "../../hooks/useBusiness";
import LoadingSpinner from "../ui/LoadingSpinner";

const BusinessHighlights = () => {
  // Fetch featured businesses from API (limit to 3)
  const { data: businesses, isLoading, error } = useFeaturedBusinesses(3);

  if (isLoading) {
    return (
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">UMKM Unggulan</h2>
              <p className="text-gray-600">
                Temukan produk dan jasa berkualitas dari para pelaku usaha lokal
                Bukittinggi
              </p>
            </div>
          </div>
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !businesses || businesses.length === 0) {
    return null; // Don't show section if there's an error or no data
  }

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">UMKM Unggulan</h2>
            <p className="text-gray-600">
              Temukan produk dan jasa berkualitas dari para pelaku usaha lokal
              Bukittinggi
            </p>
          </div>
          <Link
            to="/umkm"
            className="mt-4 md:mt-0 text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Lihat Semua UMKM
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {businesses.map((business) => (
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
                  <div className="absolute top-4 left-4 bg-secondary-600 text-white text-sm px-3 py-1 rounded-full">
                    {business.category}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {business.description}
                </p>
                <Link
                  to={`/umkm/${business.id}`}
                  className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessHighlights;
