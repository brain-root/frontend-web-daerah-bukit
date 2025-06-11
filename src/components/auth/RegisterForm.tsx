import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { FormInput } from "../common/FormInput";
import { toast } from "sonner";

// Define form schema with zod
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(50, "Nama lengkap maksimal 50 karakter"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf kapital")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Direct form submission handler without using useFormSubmit hook
  const onSubmit = async (data: RegisterFormValues) => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      await registerUser(data.email, data.password, data.fullName);
      toast.success("Pendaftaran berhasil!");
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific API error responses
      if (error.response?.data?.error === "Email already registered") {
        setError("email", {
          type: "manual",
          message: "Email sudah terdaftar",
        });
      } else {
        toast.error(
          "Gagal mendaftar: " +
            (error.response?.data?.error || "Terjadi kesalahan")
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <FormInput
          id="fullName"
          label="Nama Lengkap"
          register={register}
          name="fullName"
          error={errors.fullName}
          required
          autoComplete="name"
        />

        {/* Email */}
        <FormInput
          id="email"
          label="Email"
          register={register}
          name="email"
          error={errors.email}
          type="email"
          required
          autoComplete="email"
        />

        {/* Password */}
        <FormInput
          id="password"
          label="Password"
          register={register}
          name="password"
          error={errors.password}
          type="password"
          required
          autoComplete="new-password"
        />

        {/* Confirm Password */}
        <FormInput
          id="confirmPassword"
          label="Konfirmasi Password"
          register={register}
          name="confirmPassword"
          error={errors.confirmPassword}
          type="password"
          required
          autoComplete="new-password"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn btn-primary flex justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Processing...
            </>
          ) : (
            "Daftar"
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Sudah punya akun?{" "}
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
