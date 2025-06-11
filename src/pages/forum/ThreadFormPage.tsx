import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import RichTextEditor from "../../components/forum/RichTextEditor";
import { useForumCategory, useCreateThread } from "../../hooks/useForum";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const threadSchema = z.object({
  title: z
    .string()
    .min(5, "Judul minimal 5 karakter")
    .max(100, "Judul maksimal 100 karakter"),
});

type ThreadFormData = z.infer<typeof threadSchema>;

const ThreadFormPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ThreadFormData>({
    resolver: zodResolver(threadSchema),
  });

  // Get category details
  const {
    data: category,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useForumCategory(Number(categoryId));

  // Create thread mutation
  const createThreadMutation = useCreateThread();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: `/forum/category/${categoryId}` } });
    }
  }, [user, navigate, categoryId]);

  // Handle category loading error
  useEffect(() => {
    if (categoryError) {
      toast.error("Gagal memuat kategori. Silakan coba lagi.");
    }
  }, [categoryError]);

  const onSubmit = async (data: ThreadFormData) => {
    try {
      setSubmitError(null);

      if (!content.trim()) {
        toast.error("Konten diskusi tidak boleh kosong");
        return;
      }

      const createdThread = await createThreadMutation.mutateAsync({
        categoryId: Number(categoryId),
        title: data.title,
        content,
      });

      if (createdThread && createdThread.id) {
        toast.success("Diskusi baru berhasil dibuat");
        navigate(`/forum/thread/${createdThread.id}`);
      } else {
        throw new Error("Tidak mendapat respons yang valid dari server");
      }
    } catch (error: any) {
      console.error("Error creating thread:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Terjadi kesalahan saat membuat diskusi";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isCategoryLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (!category && !isCategoryLoading) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <p className="text-red-600 mb-3">
              Kategori tidak ditemukan atau telah dihapus
            </p>
            <Link to="/forum" className="btn btn-primary">
              Kembali ke Forum
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to={`/forum/category/${categoryId}`}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Kembali ke {category?.name}</span>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Buat Diskusi Baru</h1>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-red-600">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Judul Diskusi*
              </label>
              <input
                id="title"
                {...register("title")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konten Diskusi*
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Tulis konten diskusi Anda di sini..."
              />
              {content === "" && createThreadMutation.isPending && (
                <p className="mt-1 text-sm text-red-600">
                  Konten diskusi tidak boleh kosong
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to={`/forum/category/${categoryId}`}
                className="btn btn-outline mr-3"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={createThreadMutation.isPending}
                className="btn btn-primary flex items-center"
              >
                {createThreadMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Memproses...
                  </>
                ) : (
                  "Buat Diskusi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ThreadFormPage;
