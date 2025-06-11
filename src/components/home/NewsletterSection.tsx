import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Terima kasih telah berlangganan newsletter kami!");
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-primary-200" />
          <h2 className="text-3xl font-bold mb-4">
            Dapatkan Informasi Terbaru
          </h2>
          <p className="text-primary-100 mb-8">
            Berlangganan newsletter kami untuk mendapatkan informasi terkini
            tentang wisata, acara, dan perkembangan terbaru di Bukittinggi.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Alamat email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="btn bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-md transition-colors disabled:opacity-70"
              >
                {isLoading ? "Mendaftar..." : "Berlangganan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
