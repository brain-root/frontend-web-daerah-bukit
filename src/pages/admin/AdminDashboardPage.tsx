import { Map, ShoppingBag, Calendar, Users } from "lucide-react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import StatsCard from "../../components/admin/dashboard/StatsCard";
import OverviewChart from "../../components/admin/dashboard/OverviewChart";
import RecentActivity from "../../components/admin/dashboard/RecentActivity";

const AdminDashboardPage = () => {
  // In a real app, this data would be fetched from an API
  const stats = [
    {
      title: "Destinasi Wisata",
      value: 24,
      icon: <Map size={24} />,
      change: 12,
      iconColor: "bg-primary-100 text-primary-600",
    },
    {
      title: "UMKM",
      value: 52,
      icon: <ShoppingBag size={24} />,
      change: 8,
      iconColor: "bg-secondary-100 text-secondary-600",
    },
    {
      title: "Acara",
      value: 18,
      icon: <Calendar size={24} />,
      change: -5,
      iconColor: "bg-accent-100 text-accent-600",
    },
    {
      title: "Pengguna",
      value: 287,
      icon: <Users size={24} />,
      change: 15,
      iconColor: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <AdminLayout>
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>{" "}
        <p className="mt-1 text-sm text-gray-500">
          Selamat datang di panel administrasi Bukittinggi.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Charts and recent activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <OverviewChart
              title="Statistik Kunjungan Wisata"
              description="6 bulan terakhir"
              type="line"
            />
            <OverviewChart
              title="Pendaftaran UMKM"
              description="6 bulan terakhir"
              type="bar"
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
