import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, MapPin, Clock } from "lucide-react";
import { useEventsList } from "../hooks/useEvents";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Pagination from "../components/ui/Pagination";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9; // Events per page

  // Fetch events with pagination and search
  const { data, isLoading, error } = useEventsList({
    search: searchTerm || undefined,
    page: currentPage,
    limit,
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Group events by month
  const groupEventsByMonth = (events: any[] = []) => {
    return events.reduce((groups: Record<string, any[]>, event) => {
      // Extract month from date string - assuming format like "15 Agustus 2025"
      const parts = event.date.split(" ");
      let month = parts.length > 1 ? parts[1] : "Unknown";

      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(event);
      return groups;
    }, {});
  };

  const groupedEvents = data ? groupEventsByMonth(data.events) : {};

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://github.com/brain-root/frontend-web-daerah-bukit/blob/main/public/event.jpg?raw=true"
            alt="Acara Solok Selatan"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Agenda & Acara
            </h1>
            <p className="text-xl opacity-90">
              Jadwal acara dan kegiatan menarik yang akan diselenggarakan di
              Bukittinggi
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-md sticky top-16 z-30">
        <div className="container-custom">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari acara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">Gagal memuat data acara</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="btn btn-primary"
              >
                Coba Lagi
              </button>
            </div>
          ) : data?.events && data.events.length > 0 ? (
            <>
              {Object.keys(groupedEvents).length > 0 ? (
                Object.entries(groupedEvents).map(([month, monthEvents]) => (
                  <div key={month} className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
                      {month} {new Date().getFullYear()}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {monthEvents.map((event: any) => (
                        <div
                          key={event.id}
                          className="card group overflow-hidden"
                        >
                          <div className="aspect-w-16 aspect-h-9 relative h-48 overflow-hidden">
                            <img
                              src={
                                event.image_url ||
                                "https://via.placeholder.com/640x360?text=No+Image"
                              }
                              alt={event.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center space-x-2 text-accent-600 font-medium mb-2">
                              <Calendar size={16} />
                              <span className="text-sm">{event.date}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                              {event.name}
                            </h3>
                            {event.location && (
                              <div className="flex items-start space-x-2 text-gray-600 mb-2">
                                <MapPin
                                  size={16}
                                  className="mt-0.5 flex-shrink-0"
                                />
                                <span className="text-sm">
                                  {event.location}
                                </span>
                              </div>
                            )}
                            {event.time && (
                              <div className="flex items-center text-gray-600 mb-3">
                                <Clock
                                  size={16}
                                  className="mr-1 flex-shrink-0"
                                />
                                <span className="text-sm">{event.time}</span>
                              </div>
                            )}
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            <Link
                              to={`/acara/${event.id}`}
                              className="text-accent-500 font-medium hover:text-accent-700 transition-colors"
                            >
                              Detail Acara
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600">
                    Acara tidak ditemukan berdasarkan filter yang dipilih.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="mt-8">
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
                Tidak ada acara yang sesuai dengan pencarian Anda.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 btn btn-accent"
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

export default EventsPage;
