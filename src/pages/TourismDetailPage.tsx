import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Share2 } from "lucide-react";
import { useTourismDetail } from "../hooks/useTourism";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { formatDate } from "../utils/formatters";

const TourismDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const {
    data: destination,
    isLoading,
    error,
  } = useTourismDetail(parseInt(id || "0"));

  // Reset active image index when destination changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Destinasi Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-6">
              Maaf, destinasi wisata yang Anda cari tidak dapat ditemukan atau
              telah dihapus.
            </p>
            <Link
              to="/wisata"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft size={16} className="mr-1" /> Kembali ke Daftar Wisata
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract images array from the destination
  let imageList = destination?.images || [];

  // Debug the images we received
  console.log("Tourism images:", imageList);

  // If there are no images array but there's an image_url, use that for backward compatibility
  if (imageList.length === 0 && destination?.image_url) {
    imageList = [
      {
        id: 0,
        tourism_id: destination.id,
        image_url: destination.image_url,
        is_primary: true,
        display_order: 0,
        created_at: destination.created_at,
      },
    ];
  }

  // Ensure we have a valid index
  const validIndex = Math.min(
    activeImageIndex,
    Math.max(0, imageList.length - 1)
  );
  if (validIndex !== activeImageIndex) {
    setActiveImageIndex(validIndex);
  }

  // Get active image URL with fallback
  const activeImageUrl =
    imageList.length > 0
      ? imageList[validIndex]?.image_url
      : "https://via.placeholder.com/1200x800?text=No+Image";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image - using active image */}
      <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src={activeImageUrl}
          alt={destination?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Back Button - Floating */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/wisata"
            className="flex items-center px-3 py-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
        </div>

        {/* Category Badge */}
        {destination?.category && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-block bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {destination.category}
            </span>
          </div>
        )}

        {/* Title Area - Floating at bottom of hero image */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {destination?.name}
            </h1>
            {destination?.location && (
              <div className="flex items-center text-white/90">
                <MapPin size={16} className="mr-1" />
                <span>{destination.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Tentang Destinasi</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">{destination?.description}</p>
              </div>
            </div>

            {/* Photo Gallery - Show all images */}
            {imageList.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Galeri Foto</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageList.map((image, index) => (
                    <div
                      key={image.id || index}
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer ${
                        activeImageIndex === index
                          ? "ring-2 ring-primary-500"
                          : ""
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={image.image_url}
                        alt={`Gallery photo ${index + 1}`}
                        className="h-full w-full object-cover hover:opacity-90 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Informasi</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kategori</span>
                  <span className="font-medium">
                    {destination?.category || "Umum"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lokasi</span>{" "}
                  <span className="font-medium">
                    {destination?.location || "Bukittinggi"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ditambahkan</span>
                  <span className="font-medium">
                    {destination?.created_at
                      ? formatDate(destination.created_at)
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button className="btn btn-primary w-full mb-3">
                  Petunjuk Arah
                </button>
                <button className="flex items-center justify-center w-full text-gray-700 hover:text-primary-600 transition-colors">
                  <Share2 size={16} className="mr-1" /> Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourismDetailPage;
