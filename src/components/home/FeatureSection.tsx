import { Camera, ShoppingBag, Calendar, Users } from "lucide-react";

const features = [
  {
    icon: <Camera size={32} className="text-primary-600" />,
    title: "Destinasi Wisata",
    description:
      "Jelajahi keindahan alam Bukittinggi, dari Ngarai Sianok hingga Jam Gadang yang memukau.",
    link: "/wisata",
  },
  {
    icon: <ShoppingBag size={32} className="text-secondary-600" />,
    title: "UMKM & Bisnis Lokal",
    description:
      "Temukan produk dan jasa unggulan dari para pelaku usaha lokal Bukittinggi.",
    link: "/umkm",
  },
  {
    icon: <Calendar size={32} className="text-accent-600" />,
    title: "Agenda & Acara",
    description:
      "Ikuti berbagai festival budaya, pameran, dan kegiatan menarik di Bukittinggi.",
    link: "/acara",
  },
  {
    icon: <Users size={32} className="text-warm-600" />,
    title: "Komunitas",
    description:
      "Bergabung dengan komunitas untuk berbagi informasi dan membangun jejaring.",
    link: "#",
  },
];

const FeatureSection = () => {
  return (
    <section id="content\" className="section bg-neutral-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Jelajahi Bukittinggi</h2>
          <p className="text-gray-600">
            Temukan berbagai informasi dan layanan untuk memaksimalkan
            pengalaman Anda di Bukittinggi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-6 flex flex-col items-center text-center group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 p-3 bg-neutral-100 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <a
                href={feature.link}
                className="text-primary-600 font-medium hover:text-primary-700 transition-colors mt-auto"
              >
                Selengkapnya
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
