import React from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import ContactForm from "../components/contact/ContactForm";

const ContactPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/5805251/pexels-photo-5805251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Kontak Solok Selatan"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hubungi Kami
            </h1>
            <p className="text-xl opacity-90">
              Kami siap membantu dan menjawab pertanyaan Anda
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Informasi Kontak</h2>
              <p className="text-gray-600 mb-8">
                Jika Anda memiliki pertanyaan atau membutuhkan informasi lebih
                lanjut tentang Bukittinggi, jangan ragu untuk menghubungi kami
                melalui:
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Alamat</h3>
                    <p className="text-gray-600">
                      Jl. Sudirman No. 1, Bukittinggi, Sumatera Barat, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <a
                      href="mailto:info@bukittinggi.go.id"
                      className="text-primary-500 hover:underline"
                    >
                      info@bukittinggi.go.id
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Telepon
                    </h3>
                    <a
                      href="tel:+6275398765"
                      className="text-primary-500 hover:underline"
                    >
                      (0753) 98765
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Jam Operasional
                    </h3>
                    <p className="text-gray-600">
                      Senin - Jumat: 08.00 - 16.00 WIB
                      <br />
                      Sabtu, Minggu & Hari Libur: Tutup
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 bg-gray-100 p-2 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  [Peta Lokasi]
                  <br />
                  <span className="text-sm">
                    Tampilan peta akan muncul di sini
                  </span>
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Kirim Pesan</h2>
              <p className="text-gray-600 mb-8">
                Isi formulir di bawah ini untuk mengirimkan pesan, pertanyaan,
                atau saran Anda. Kami akan merespons secepat mungkin.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Pertanyaan Umum
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Berikut adalah beberapa pertanyaan yang sering ditanyakan oleh
              pengunjung
            </p>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Bagaimana cara menuju ke Bukittinggi?
                </h3>
                <p className="text-gray-600">
                  Bukittinggi dapat diakses melalui jalan darat dari Kota Padang
                  dengan jarak tempuh sekitar 2 jam. Tersedia juga transportasi
                  umum seperti bus dan travel dari Terminal Padang menuju
                  Bukittinggi.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Kapan waktu terbaik untuk mengunjungi Bukittinggi?
                </h3>
                <p className="text-gray-600">
                  Bukittinggi dapat dikunjungi sepanjang tahun karena memiliki
                  udara sejuk di dataran tinggi. Namun, waktu terbaik adalah
                  musim kemarau (Mei-September) untuk aktivitas outdoor dan
                  menikmati pemandangan yang jernih.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Apakah ada akomodasi untuk wisatawan di Bukittinggi?
                </h3>
                <p className="text-gray-600">
                  Ya, tersedia berbagai pilihan akomodasi mulai dari hotel,
                  homestay, hingga penginapan sederhana di berbagai lokasi di
                  Bukittinggi. Untuk pengalaman budaya yang lebih autentik,
                  beberapa homestay juga menyediakan pengalaman menginap di
                  rumah penduduk lokal.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Bagaimana cara mendaftarkan UMKM saya di direktori website?
                </h3>
                <p className="text-gray-600">
                  Untuk mendaftarkan UMKM Anda di direktori website, silakan
                  lengkapi formulir pendaftaran di halaman UMKM atau hubungi
                  kami melalui email/telepon. Tim kami akan memverifikasi
                  informasi bisnis Anda sebelum ditampilkan di website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
