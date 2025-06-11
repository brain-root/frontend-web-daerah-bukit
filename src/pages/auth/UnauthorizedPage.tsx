import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-16">
      <div className="text-center">
        <AlertTriangle size={60} className="text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Home className="mr-2 -ml-1 h-5 w-5" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
