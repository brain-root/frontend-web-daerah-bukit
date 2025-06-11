import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Calendar, Share2 } from "lucide-react";
import { useEvent } from "../hooks/useEvents";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { formatDate } from "../utils/formatters";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEvent(parseInt(id || "0"));

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Acara Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-6">
              Maaf, acara yang Anda cari tidak dapat ditemukan atau telah
              dihapus.
            </p>
            <Link
              to="/acara"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft size={16} className="mr-1" /> Kembali ke Daftar Acara
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
            event.image_url ||
            "https://via.placeholder.com/1200x800?text=No+Image"
          }
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Back Button - Floating */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/acara"
            className="flex items-center px-3 py-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
        </div>

        {/* Title Area - Floating at bottom of hero image */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {event.name}
            </h1>
            {event.date && (
              <div className="flex items-center text-white/90">
                <Calendar size={16} className="mr-1" />
                <span>{event.date}</span>
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
              <h2 className="text-xl font-semibold mb-4">Tentang Acara</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">
                  {event.description || "Tidak ada deskripsi tersedia."}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Informasi Acara</h3>
              <div className="space-y-4">
                {event.date && (
                  <div className="flex items-center">
                    <Calendar size={18} className="text-accent-600 mr-3" />
                    <div>
                      <span className="block font-medium">Tanggal</span>
                      <span className="text-gray-600">{event.date}</span>
                    </div>
                  </div>
                )}
                {event.time && (
                  <div className="flex items-center">
                    <Clock size={18} className="text-accent-600 mr-3" />
                    <div>
                      <span className="block font-medium">Waktu</span>
                      <span className="text-gray-600">{event.time}</span>
                    </div>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center">
                    <MapPin size={18} className="text-accent-600 mr-3" />
                    <div>
                      <span className="block font-medium">Lokasi</span>
                      <span className="text-gray-600">{event.location}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center pt-2">
                  <span className="text-gray-500 text-sm">
                    Ditambahkan pada {formatDate(event.created_at)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
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

export default EventDetailPage;
