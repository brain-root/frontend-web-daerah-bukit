import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Share2 } from "lucide-react";
import { useBusiness } from "../hooks/useBusiness";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { formatDate } from "../utils/formatters";

const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: business, isLoading, error } = useBusiness(parseInt(id || "0"));

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              UMKM Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-6">
              Maaf, UMKM yang Anda cari tidak dapat ditemukan atau telah
              dihapus.
            </p>
            <Link
              to="/umkm"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft size={16} className="mr-1" /> Kembali ke Daftar UMKM
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src={
            business.image_url ||
            "https://via.placeholder.com/1200x800?text=No+Image"
          }
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Back Button - Floating */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/umkm"
            className="flex items-center px-3 py-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
        </div>

        {/* Category Badge */}
        {business.category && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-block bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {business.category}
            </span>
          </div>
        )}

        {/* Title Area - Floating at bottom of hero image */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {business.name}
            </h1>
            {business.location && (
              <div className="flex items-center text-white/90">
                <MapPin size={16} className="mr-1" />
                <span>{business.location}</span>
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Tentang UMKM Ini</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">
                  {business.description || "Tidak ada deskripsi tersedia."}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Informasi Kontak</h3>
              <div className="space-y-4">
                {business.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Kategori</span>
                    <span className="font-medium">{business.category}</span>
                  </div>
                )}
                {business.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lokasi</span>
                    <span className="font-medium">{business.location}</span>
                  </div>
                )}
                {business.contact && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Kontak</span>
                    <span className="font-medium">{business.contact}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Terdaftar Sejak</span>
                  <span className="font-medium">
                    {business.created_at
                      ? formatDate(business.created_at)
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                {business.contact && business.contact.includes("+") && (
                  <a
                    href={`tel:${business.contact}`}
                    className="btn btn-secondary w-full mb-3"
                  >
                    Hubungi
                  </a>
                )}
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

export default BusinessDetailPage;
