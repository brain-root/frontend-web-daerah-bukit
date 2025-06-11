import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { X, Upload, Loader2 } from "lucide-react";
import { Business } from "../../../types/business";
import {
  useCreateBusiness,
  useUpdateBusiness,
  useUploadBusinessImage,
} from "../../../hooks/useBusiness";

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  business?: Business;
}

// Form validation schema
const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  contact: z.string().optional(),
});

type FormData = z.infer<typeof businessSchema>;

const BusinessModal = ({
  isOpen,
  onClose,
  onSuccess,
  business,
}: BusinessModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    business?.image_url || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditMode = !!business;

  // Mutations
  const createMutation = useCreateBusiness();
  const updateMutation = useUpdateBusiness();
  const uploadMutation = useUploadBusinessImage();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: business?.name || "",
      description: business?.description || "",
      location: business?.location || "",
      category: business?.category || "",
      contact: business?.contact || "",
    },
  });

  // Reset form when business changes
  useEffect(() => {
    if (business) {
      reset({
        name: business.name || "",
        description: business.description || "",
        location: business.location || "",
        category: business.category || "",
        contact: business.contact || "",
      });
      setImagePreview(business.image_url || null);
    } else {
      reset({
        name: "",
        description: "",
        location: "",
        category: "",
        contact: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [business, reset, isOpen]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submit handler
  const onSubmit = async (data: FormData) => {
    try {
      // First upload image if exists
      let imageUrl = business?.image_url || "";

      if (imageFile) {
        const result = await uploadMutation.mutateAsync(imageFile);
        imageUrl = result.imageUrl;
      }

      // Then create/update the business with image URL
      if (isEditMode && business) {
        await updateMutation.mutateAsync({
          id: business.id,
          data: {
            ...data,
            image_url: imageUrl,
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          image_url: imageUrl,
        });
      }

      toast.success(
        isEditMode
          ? "Business updated successfully!"
          : "New business created successfully!"
      );
      onSuccess();
    } catch (error) {
      console.error("Error saving business:", error);
      toast.error("Failed to save business. Please try again.");
    }
  };

  if (!isOpen) return null;

  // Available categories
  const categories = ["Kerajinan", "Kuliner", "Jasa", "Pertanian"];

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Edit UMKM" : "Tambah UMKM Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar UMKM
              </label>
              <div className="mt-1 flex flex-col items-center space-y-2">
                {imagePreview ? (
                  <div className="relative w-full h-60">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full max-h-60 mx-auto object-contain rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="text-gray-500 mt-2">
                      Klik untuk mengunggah gambar
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF maksimal 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Business name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama UMKM *
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kategori
              </label>
              <select
                id="category"
                {...register("category")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-500"
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact */}
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kontak
              </label>
              <input
                id="contact"
                type="text"
                {...register("contact")}
                placeholder="Nomor telepon, email, atau kontak lainnya"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-500"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lokasi
              </label>
              <input
                id="location"
                type="text"
                {...register("location")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-500"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Deskripsi
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-500"
              ></textarea>
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 flex items-center"
            >
              {isSubmitting && (
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              )}
              {isEditMode ? "Update UMKM" : "Buat UMKM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessModal;
