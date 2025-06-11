import { Link } from "react-router-dom";
import { useUpcomingEvents } from "../../hooks/useEvents";
import LoadingSpinner from "../ui/LoadingSpinner";

const EventsPreview = () => {
  // Fetch upcoming events - limit to 4
  const { data: events, isLoading, error } = useUpcomingEvents(4);

  if (isLoading) {
    return (
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Acara Mendatang</h2>
              <p className="text-gray-600">
                Jadwal acara dan kegiatan menarik yang akan diselenggarakan di
                Solok Selatan
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

  if (error || !events || events.length === 0) {
    return null; // Don't show section if there's an error or no events
  }

  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Acara Mendatang</h2>
            <p className="text-gray-600">
              Jadwal acara dan kegiatan menarik yang akan diselenggarakan di
              Solok Selatan
            </p>
          </div>
          <Link
            to="/acara"
            className="mt-4 md:mt-0 text-primary-500 font-medium hover:text-primary-700 transition-colors"
          >
            Lihat Semua Acara
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card group overflow-hidden">
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
              <div className="p-4">
                <div className="text-sm text-accent-600 font-medium mb-1">
                  {event.date}
                </div>
                <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                  {event.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{event.location}</p>
                <Link
                  to={`/acara/${event.id}`}
                  className="text-primary-500 text-sm font-medium hover:text-primary-700 transition-colors"
                >
                  Detail Acara
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
