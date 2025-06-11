import { MapPin, Users, Award, Heart, Clock, Landmark } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/67/Jam_Gadang_Okt_2020_2.jpg"
            alt="Pemandangan Bukittinggi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>

        <div className="container-custom relative z-10 text-center text-white px-6">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
              <MapPin size={16} />
              Kota Wisata Sumatera Barat
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Bukittinggi
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
              Kota wisata yang menawan dengan pesona alam dan kekayaan budaya
              Minangkabau
            </p>
          </div>
        </div>
      </section>

      {/* Modern Statistics Section */}
      <section className="py-20">
        <div className="container-custom px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-warm-100 rounded-2xl flex items-center justify-center group-hover:bg-warm-200 transition-colors">
                <MapPin size={24} className="text-warm-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">25.24</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                km²
              </div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Users size={24} className="text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">124K</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Penduduk
              </div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-2xl flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                <Landmark size={24} className="text-secondary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Kecamatan
              </div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent-100 rounded-2xl flex items-center justify-center group-hover:bg-accent-200 transition-colors">
                <Award size={24} className="text-accent-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Kelurahan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 bg-warm-50">
        <div className="container-custom px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pesona Bukittinggi
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Jelajahi keindahan alam dan kekayaan budaya yang memukau
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Enhanced Photo Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 h-[500px] md:h-[600px]">
              {/* Large featured photo - spans 3 columns and 2 rows on desktop */}
              <div className="col-span-2 md:col-span-3 md:row-span-2 relative overflow-hidden rounded-3xl group shadow-lg">
                <img
                  src="https://getlost.id/wp-content/uploads/2021/11/@kiddrock85.jpg"
                  alt="Jam Gadang Bukittinggi"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-2xl font-bold mb-2">Jam Gadang</h3>
                  <p className="text-sm opacity-90">
                    Ikon legendaris Kota Bukittinggi yang menjadi saksi sejarah
                  </p>
                </div>
              </div>

              {/* Top right photos */}
              <div className="md:col-span-3 grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-2xl group shadow-md">
                  <img
                    src="https://www.bigworldsmallpockets.com/wp-content/uploads/2018/11/Indonesia-Bukittinggi-Canyon-Views.jpg"
                    alt="Ngarai Sianok"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <h4 className="font-semibold text-sm">Ngarai Sianok</h4>
                    <p className="text-xs opacity-90">
                      Lembah hijau yang memukau
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl group shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1696416751908-5b068e1cba1a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Pasar Tradisional"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <h4 className="font-semibold text-sm">Pasar Atas</h4>
                    <p className="text-xs opacity-90">
                      Pusat perdagangan tradisional
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom right photos */}
              <div className="md:col-span-3 grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-2xl group shadow-md">
                  <img
                    src="https://sumbarfokus.com/wp-content/uploads/2024/01/EVERGREEN.png"
                    alt="Rumah Gadang"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <h4 className="font-semibold text-sm">Rumah Gadang</h4>
                    <p className="text-xs opacity-90">
                      Arsitektur khas Minangkabau
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl group shadow-md">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/49/Benteng_Fort_de_Kock.jpg"
                    alt="Fort de Kock"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <h4 className="font-semibold text-sm">Fort de Kock</h4>
                    <p className="text-xs opacity-90">Peninggalan bersejarah</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Overview Section */}
      <section className="py-20 bg-white">
        <div className="container-custom px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sekilas Tentang Bukittinggi
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Kota wisata yang menawan di jantung Sumatera Barat
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow border border-warm-100">
              <div className="w-12 h-12 bg-warm-100 rounded-2xl flex items-center justify-center mb-6">
                <MapPin size={24} className="text-warm-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Lokasi Strategis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Terletak di dataran tinggi 930 meter di atas permukaan laut
                dengan udara sejuk dan pemandangan menawan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow border border-warm-100">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Landmark size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Warisan Budaya
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Pusat kebudayaan Minangkabau dengan landmark ikonik seperti Jam
                Gadang dan Ngarai Sianok.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow border border-warm-100">
              <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center mb-6">
                <Users size={24} className="text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Komunitas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Masyarakat yang ramah dengan tradisi dan adat istiadat
                Minangkabau yang masih kental.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Visi & Misi
            </h2>
            <p className="text-gray-600 text-lg">
              Arah dan tujuan pengembangan Bukittinggi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-primary-50 to-warm-50 p-8 rounded-3xl border border-primary-100">
              <h3 className="text-2xl font-bold text-primary-900 mb-6">Visi</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                "Terwujudnya Bukittinggi sebagai Kota Wisata yang Maju,
                Sejahtera, dan Berbudaya dengan Tata Kelola Pemerintahan yang
                Baik"
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-warm-50 p-8 rounded-3xl border border-secondary-100">
              <h3 className="text-2xl font-bold text-secondary-900 mb-6">
                Misi
              </h3>
              <ul className="text-gray-700 space-y-3">
                <li className="flex items-start">
                  <Heart
                    size={18}
                    className="text-secondary-600 mt-1 mr-3 flex-shrink-0"
                  />
                  <span>Mengembangkan destinasi wisata yang berkelanjutan</span>
                </li>
                <li className="flex items-start">
                  <Heart
                    size={18}
                    className="text-secondary-600 mt-1 mr-3 flex-shrink-0"
                  />
                  <span>
                    Mewujudkan tata kelola pemerintahan yang baik dan transparan
                  </span>
                </li>
                <li className="flex items-start">
                  <Heart
                    size={18}
                    className="text-emerald-600 mt-1 mr-3 flex-shrink-0"
                  />
                  <span>
                    Meningkatkan kualitas infrastruktur dan fasilitas publik
                  </span>
                </li>
                <li className="flex items-start">
                  <Heart
                    size={18}
                    className="text-emerald-600 mt-1 mr-3 flex-shrink-0"
                  />
                  <span>
                    Mengembangkan ekonomi kreatif dan UMKM berbasis wisata
                  </span>
                </li>
                <li className="flex items-start">
                  <Heart
                    size={18}
                    className="text-emerald-600 mt-1 mr-3 flex-shrink-0"
                  />
                  <span>Melestarikan budaya dan tradisi Minangkabau</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container-custom px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Sejarah Singkat
              </h2>
              <p className="text-gray-600 text-lg">
                Perjalanan sejarah Bukittinggi dari masa ke masa
              </p>
            </div>

            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Abad ke-14
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bukittinggi mulai dikenal sebagai pusat perdagangan di
                    Minangkabau. Lokasi strategis di dataran tinggi membuatnya
                    menjadi tempat persinggahan pedagang dan pelancong dari
                    berbagai daerah.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Clock size={20} className="text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    1825 - 1949
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Masa kolonial Belanda dengan pembangunan Benteng Fort de
                    Kock dan Jam Gadang. Bukittinggi menjadi pusat administrasi
                    dan militer Belanda di Sumatera Barat. Pada masa pendudukan
                    Jepang, dibangun terowongan bawah tanah (Lubang Jepang).
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock size={20} className="text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    1950 - 1990
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Era kemerdekaan Indonesia dengan perkembangan sebagai kota
                    wisata dan pendidikan. Bukittinggi menjadi pusat kebudayaan
                    Minangkabau dan destinasi wisata utama di Sumatera Barat
                    dengan landmark ikoniknya.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock size={20} className="text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    1990 - Sekarang
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Modernisasi dan pengembangan pariwisata berkelanjutan.
                    Bukittinggi semakin dikenal sebagai destinasi wisata
                    nasional dan internasional. Pengembangan ekonomi kreatif,
                    UMKM, dan pelestarian budaya menjadi fokus utama pembangunan
                    kota.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
