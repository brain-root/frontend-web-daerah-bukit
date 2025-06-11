import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RegisterForm from "../../components/auth/RegisterForm";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const RegisterPage: React.FC = () => {
  const { loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Daftar Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Atau{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            masuk ke akun Anda
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size="medium" />
            </div>
          ) : (
            <RegisterForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
