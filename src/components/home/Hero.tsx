import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToContent = () => {
    const contentSection = document.getElementById("content");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://github.com/brain-root/frontend-web-daerah-bukit/blob/main/public/jamgadang.jpg?raw=true"
          alt="Pemandangan Alam Bukittinggi"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/30"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-white">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Jelajahi Pesona{" "}
            <span className="text-primary-400">Bukittinggi</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Temukan keindahan alam, kekayaan budaya, dan potensi bisnis di kota
            wisata Sumatera Barat yang menawan
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/wisata" className="btn btn-primary text-base px-6 py-3">
              Jelajahi Wisata
            </Link>
            <Link
              to="/umkm"
              className="btn btn-outline border-white text-white hover:bg-white/10 text-base px-6 py-3"
            >
              Direktori UMKM
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-10"
        aria-label="Scroll to content"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default Hero;
