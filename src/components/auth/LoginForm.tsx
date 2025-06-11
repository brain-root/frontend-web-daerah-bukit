import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { FormInput } from "../common/FormInput";
import { toast } from "sonner";

// Define form schema with zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redirect path from location state or default to homepage
  const from = (location.state as any)?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Direct form submission handler without using useFormSubmit hook
  const onSubmit = async (data: LoginFormValues) => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success("Login berhasil!");
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific API error responses
      if (error.response?.data?.error === "Invalid email or password") {
        setError("password", {
          type: "manual",
          message: "Email atau password salah",
        });
      } else {
        toast.error(
          "Login gagal: " + (error.response?.data?.error || "Terjadi kesalahan")
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          autoComplete="current-password"
        />

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            to="/lupa-password"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Lupa password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn btn-primary flex justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Logging in...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Create account link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Belum punya akun?{" "}
        <Link
          to="/daftar"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
