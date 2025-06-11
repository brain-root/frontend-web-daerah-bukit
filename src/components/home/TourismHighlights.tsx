import { Link } from "react-router-dom";
import { useFeaturedTourism } from "../../hooks/useTourism";
import LoadingSpinner from "../ui/LoadingSpinner";

const TourismHighlights = () => {
  // Fetch featured tourism destinations - limit to 3
  const { data: destinations, isLoading, error } = useFeaturedTourism(3);

  if (isLoading) {
    return (
      <section className="section bg-neutral-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Destinasi Populer</h2>
              <p className="text-gray-600">
                Jelajahi keindahan alam dan kekayaan budaya Solok Selatan yang
                memukau
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

  if (error || !destinations || destinations.length === 0) {
    // Don't render the section if there's an error or no data
    return null;
  }

  return (
    <section className="section bg-neutral-100">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Destinasi Populer</h2>
            <p className="text-gray-600">
              Jelajahi keindahan alam dan kekayaan budaya Bukittinggi yang
              memukau
            </p>
          </div>
          <Link
            to="/wisata"
            className="mt-4 md:mt-0 text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Lihat Semua Destinasi
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div key={destination.id} className="card group overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 relative h-60 overflow-hidden">
                <img
                  src={
                    destination.image_url ||
                    "https://via.placeholder.com/640x360?text=No+Image"
                  }
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {destination.category && (
                  <div className="absolute top-4 left-4 bg-accent-600 text-white text-sm px-3 py-1 rounded-full">
                    {destination.category}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {destination.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {destination.description}
                </p>
                <Link
                  to={`/wisata/${destination.id}`}
                  className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  Jelajahi
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourismHighlights;
