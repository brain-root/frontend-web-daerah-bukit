import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, UploadCloud, XCircle, CheckCircle2 } from "lucide-react";
import { FormInput } from "../../common/FormInput";
import { FormTextarea } from "../../common/FormTextarea";
import { FormSelect } from "../../common/FormSelect";
import {
  useCreateTourism,
  useUpdateTourism,
  useUploadTourismImages,
  useDeleteTourismImage,
  useSetImageAsPrimary,
} from "../../../hooks/useTourism";
import { TourismDestination, TourismImage } from "../../../types/tourism";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { toast } from "sonner";
import { useAuth } from "../../../contexts/AuthContext";

// Define API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface TourismFormProps {
  destination: TourismDestination | null;
  onClose: (refreshData?: boolean) => void;
}

// Define schema for form validation
const tourismSchema = z.object({
  name: z
    .string()
    .min(1, "Nama destinasi wajib diisi")
    .max(255, "Nama terlalu panjang"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  featured: z.boolean().optional(),
  image_url: z.string().optional(),
});

type TourismFormValues = z.infer<typeof tourismSchema>;

// TourismForm component
const TourismForm: React.FC<TourismFormProps> = ({ destination, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentImages, setCurrentImages] = useState<TourismImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mutations for API operations
  const createMutation = useCreateTourism();
  const updateMutation = useUpdateTourism();
  const uploadImagesMutation = useUploadTourismImages();
  const deleteImageMutation = useDeleteTourismImage();
  const setPrimaryMutation = useSetImageAsPrimary();
  const { refreshAuth } = useAuth();

  // Initialize form with existing destination data or defaults
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TourismFormValues>({
    resolver: zodResolver(tourismSchema),
    defaultValues: {
      name: destination?.name || "",
      description: destination?.description || "",
      location: destination?.location || "",
      category: destination?.category || "",
      featured: destination?.featured || false,
      image_url: destination?.image_url || "",
    },
  });

  // Load existing images when destination changes
  useEffect(() => {
    if (destination?.id) {
      // Fetch the destination with images
      const fetchDestinationWithImages = async () => {
        try {
          console.log(`Fetching images for destination ${destination.id}`);
          const response = await fetch(
            `${API_URL}/tourism/${destination.id}/images`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Fetched destination with images:", data);

            // Update current images if images array exists
            if (data.images && Array.isArray(data.images)) {
              setCurrentImages(data.images);
            } else {
              // If no images array but there's an image_url, create a pseudo image entry
              if (destination.image_url) {
                setCurrentImages([
                  {
                    id: 0,
                    tourism_id: destination.id,
                    image_url: destination.image_url,
                    is_primary: true,
                    display_order: 0,
                    created_at: destination.created_at,
                  },
                ]);
              } else {
                setCurrentImages([]);
              }
            }
          } else {
            console.error(
              "Failed to fetch destination images:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching destination images:", error);
        }
      };

      fetchDestinationWithImages();
    } else {
      setCurrentImages([]);
    }
  }, [destination]);

  // Convert files to preview URLs
  const createPreviewUrls = useCallback((files: File[]) => {
    return files.map((file) => URL.createObjectURL(file));
  }, []);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const selectedFiles = Array.from(event.target.files);

    // Filter files by type and size
    const validFiles = selectedFiles.filter((file) => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 5MB)`);
        return false;
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error(`File ${file.name} has unsupported format`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Add to current selection
    setNewImages((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...createPreviewUrls(validFiles)]);

    // Reset input value so the same file can be selected again
    event.target.value = "";
  };

  // Remove selected file before upload
  const removeSelectedFile = (index: number) => {
    // Clean up URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove existing image
  const removeExistingImage = async (imageId: number) => {
    try {
      // Use the deleteImageMutation from hooks instead of direct fetch
      const result = await deleteImageMutation.mutateAsync(imageId);

      // Update the currentImages state with the updated list
      if (result && result.images) {
        setCurrentImages(result.images);
        toast.success("Image removed successfully");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  // Set image as primary
  const setImageAsPrimary = async (imageId: number) => {
    try {
      // Use the setPrimaryMutation from hooks
      const result = await setPrimaryMutation.mutateAsync(imageId);

      if (result && result.allImages) {
        setCurrentImages(result.allImages);
        toast.success("Primary image updated");
      }
    } catch (error) {
      console.error("Error setting primary image:", error);
      toast.error("Failed to update primary image");
    }
  };

  // Upload new images for existing destination
  const uploadImagesForDestination = async (tourismId: number) => {
    if (newImages.length === 0) return [];

    try {
      setIsUploading(true);
      const formData = new FormData();
      newImages.forEach((file) => {
        formData.append("images", file);
      });

      const result = await uploadImagesMutation.mutateAsync({
        tourismId,
        files: formData,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      });

      toast.success(`${result.images.length} images uploaded successfully`);
      return result.images;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
      return [];
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Form submission handler
  const onSubmit = async (data: TourismFormValues) => {
    try {
      console.log("Submitting form with data:", data);

      // Verify authentication before submission
      const token = localStorage.getItem("token");
      if (!token) {
        const refreshed = await refreshAuth();
        if (!refreshed) {
          toast.error("Sesi login Anda telah habis. Silakan login kembali.");
          return;
        }
      }

      if (destination) {
        // Update existing destination
        const updateData = {
          id: destination.id,
          data: {
            name: data.name,
            description: data.description,
            location: data.location,
            category: data.category,
            featured: data.featured,
          },
        };

        console.log("Updating destination with data:", updateData);

        try {
          await updateMutation.mutateAsync(updateData);

          // Upload new images if any
          if (newImages.length > 0) {
            await uploadImagesForDestination(destination.id);
          }

          toast.success("Destinasi wisata berhasil diperbarui");
          onClose(true); // Close modal and refresh data
        } catch (error) {
          console.error("Update mutation error:", error);
          toast.error("Gagal memperbarui destinasi wisata");
        }
      } else {
        // Create new destination
        const createData = {
          name: data.name,
          description: data.description,
          location: data.location,
          category: data.category,
          featured: data.featured,
        };

        console.log("Creating new destination with data:", createData);

        try {
          const result = await createMutation.mutateAsync(createData);

          // Upload images for the new destination
          if (newImages.length > 0 && result.id) {
            await uploadImagesForDestination(result.id);
          }

          toast.success("Destinasi wisata berhasil ditambahkan");
          onClose(true); // Close modal and refresh data
        } catch (error) {
          console.error("Create mutation error:", error);
          toast.error("Gagal menambahkan destinasi wisata");
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);

      // Handle authentication errors specifically
      if (
        error.message === "Authentication required" ||
        error.response?.status === 401
      ) {
        toast.error("Sesi login Anda telah habis. Silakan login kembali.");
      } else {
        toast.error("Terjadi kesalahan dalam pengiriman formulir");
      }
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Render the form with current images and new image uploads
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex items-center justify-between px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900">
              {destination
                ? "Edit Destinasi Wisata"
                : "Tambah Destinasi Wisata Baru"}
            </h3>
            <button
              onClick={() => onClose()}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Destinasi
                </label>

                {/* Current Images - Show this section when there are existing images */}
                {currentImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-500 mb-2">
                      Gambar saat ini:
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {currentImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.image_url}
                            alt="Tourism"
                            className={`h-20 w-full object-cover rounded ${
                              image.is_primary ? "ring-2 ring-primary-500" : ""
                            }`}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => removeExistingImage(image.id)}
                              className="p-1 bg-red-500 text-white rounded-full mr-2"
                              title="Remove image"
                            >
                              <XCircle size={16} />
                            </button>
                            {!image.is_primary && (
                              <button
                                type="button"
                                onClick={() => setImageAsPrimary(image.id)}
                                className="p-1 bg-green-500 text-white rounded-full"
                                title="Set as main image"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                          </div>
                          {image.is_primary && (
                            <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-1 py-0.5 rounded-bl">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {previewUrls.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-500 mb-2">Gambar baru:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="h-20 w-full object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(index)}
                              className="p-1 bg-red-500 text-white rounded-full"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                          {currentImages.length === 0 && index === 0 && (
                            <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-1 py-0.5 rounded-bl">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && uploadProgress > 0 && (
                  <div className="my-2">
                    <div className="w-full bg-gray-200 rounded h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                )}

                {/* Upload Button */}
                <label className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <span className="relative rounded-md font-medium text-primary-600 hover:text-primary-500">
                        Upload gambar
                      </span>
                      <p className="pl-1">atau drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF sampai 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Name */}
              <FormInput
                id="name"
                label="Nama Destinasi"
                register={register}
                name="name"
                error={errors.name}
                required
              />

              {/* Category */}
              <FormSelect
                id="category"
                label="Kategori"
                register={register}
                name="category"
                options={[
                  "Air Terjun",
                  "Pemandangan",
                  "Budaya",
                  "Alam",
                  "Danau",
                  "Pantai",
                  "Lainnya",
                ].map((category) => ({
                  value: category,
                  label: category,
                }))}
                error={errors.category}
                required
              />

              {/* Location */}
              <FormInput
                id="location"
                label="Lokasi"
                register={register}
                name="location"
                error={errors.location}
                required
              />

              {/* Description */}
              <FormTextarea
                id="description"
                label="Deskripsi"
                register={register}
                name="description"
                rows={5}
                error={errors.description}
                required
              />

              {/* Featured Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="featured"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    {...register("featured")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="featured"
                    className="font-medium text-gray-700"
                  >
                    Tampilkan di Halaman Utama (Featured)
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => onClose()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:bg-primary-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Menyimpan...</span>
                  </>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourismForm;
