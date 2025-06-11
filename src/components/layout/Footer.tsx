import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Logo and About */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <MapPin className="h-6 w-6 text-primary-400" />
              <span className="text-xl font-heading font-bold text-white">
                Bukittinggi
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
              Portal resmi Bukittinggi. Menyediakan informasi lengkap tentang
              pariwisata, bisnis lokal, dan budaya khas daerah.
            </p>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start justify-center md:justify-start">
                <MapPin
                  size={16}
                  className="text-primary-400 mt-1 mr-2 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm">
                  Jl. Sudirman No. 1, Bukittinggi, Sumatera Barat
                </span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone
                  size={16}
                  className="text-primary-400 mr-2 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm">(0752) 21234</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Mail
                  size={16}
                  className="text-primary-400 mr-2 flex-shrink-0"
                />
                <span className="text-gray-400 text-sm">
                  info@bukittinggi.go.id
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/wisata"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                >
                  Destinasi Wisata
                </Link>
              </li>
              <li>
                <Link
                  to="/umkm"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                >
                  Direktori UMKM
                </Link>
              </li>
              <li>
                <Link
                  to="/acara"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                >
                  Agenda & Acara
                </Link>
              </li>
              <li>
                <Link
                  to="/tentang"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Ikuti Kami</h4>
            <div className="flex justify-center space-x-4 mb-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Developer Credits and Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                &copy; {currentYear} Bukittinggi. Hak Cipta Dilindungi.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">
                Dikembangkan oleh{" "}
                <a
                  href="https://github.com/athalbudi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Athallah Budiman Devia Putra
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
