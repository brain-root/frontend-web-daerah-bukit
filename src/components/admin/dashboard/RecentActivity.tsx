import { ShoppingBag, Map, Calendar, MessageCircle, User } from "lucide-react";

interface Activity {
  id: number;
  type: "wisata" | "umkm" | "event" | "forum" | "user";
  action: string;
  name: string;
  user: string;
  time: string;
}

// Mock data for recent activities
const recentActivities: Activity[] = [
  {
    id: 1,
    type: "wisata",
    action: "added",
    name: "Air Terjun Bayang Sani",
    user: "Admin",
    time: "30 menit yang lalu",
  },
  {
    id: 2,
    type: "umkm",
    action: "updated",
    name: "Tenun Songket Silungkang",
    user: "Admin",
    time: "2 jam yang lalu",
  },
  {
    id: 3,
    type: "event",
    action: "added",
    name: "Festival Seribu Rumah Gadang",
    user: "Admin",
    time: "3 jam yang lalu",
  },
  {
    id: 4,
    type: "forum",
    action: "deleted",
    name: "Diskusi tentang Pariwisata",
    user: "Moderator",
    time: "5 jam yang lalu",
  },
  {
    id: 5,
    type: "user",
    action: "registered",
    name: "Budi Santoso",
    user: "System",
    time: "1 hari yang lalu",
  },
];

// Get icon based on activity type
const getActivityIcon = (type: string) => {
  switch (type) {
    case "wisata":
      return <Map size={16} className="text-primary-500" />;
    case "umkm":
      return <ShoppingBag size={16} className="text-secondary-500" />;
    case "event":
      return <Calendar size={16} className="text-accent-500" />;
    case "forum":
      return <MessageCircle size={16} className="text-forest-500" />;
    case "user":
      return <User size={16} className="text-gray-500" />;
    default:
      return null;
  }
};

// Get color for activity action
const getActionColor = (action: string) => {
  switch (action) {
    case "added":
      return "text-green-600";
    case "updated":
      return "text-blue-600";
    case "deleted":
      return "text-red-600";
    case "registered":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

const RecentActivity = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">Aktivitas Terbaru</h3>
      <div className="mt-6">
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="py-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    <span className={getActionColor(activity.action)}>
                      {activity.action === "added" && "Menambahkan"}
                      {activity.action === "updated" && "Mengupdate"}
                      {activity.action === "deleted" && "Menghapus"}
                      {activity.action === "registered" && "Mendaftar"}
                    </span>{" "}
                    {activity.name}
                  </p>
                  <div className="mt-1 flex items-center">
                    <p className="text-xs text-gray-500">
                      oleh {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <a
            href="/admin/activities"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Lihat semua aktivitas
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
