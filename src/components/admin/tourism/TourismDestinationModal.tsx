import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { X, Upload, Loader2 } from "lucide-react";
import api from "../../../lib/api";
import { TourismDestination } from "../../../pages/admin/AdminTourismPage";

interface TourismDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  destination?: TourismDestination;
}

interface FormData {
  name: string;
  description: string;
  location: string;
  category: string;
}

const TourismDestinationModal = ({
  isOpen,
  onClose,
  onSuccess,
  destination,
}: TourismDestinationModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    destination?.image_url || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isEditMode = !!destination;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: destination?.name || "",
      description: destination?.description || "",
      location: destination?.location || "",
      category: destination?.category || "",
    },
  });

  // Reset form when destination changes
  useEffect(() => {
    if (destination) {
      reset({
        name: destination.name || "",
        description: destination.description || "",
        location: destination.location || "",
        category: destination.category || "",
      });
      setImagePreview(destination.image_url || null);
    } else {
      reset({
        name: "",
        description: "",
        location: "",
        category: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [destination, reset, isOpen]);

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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // First upload image if exists
      let imageUrl = destination?.image_url || null;

      if (imageFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
          const uploadResponse = await api.post("/tourism/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          imageUrl = uploadResponse.data.imageUrl;
        } finally {
          setIsUploading(false);
        }
      }

      // Then create/update the destination with image URL
      if (isEditMode) {
        return api.put(`/tourism/${destination.id}`, {
          ...data,
          image_url: imageUrl,
        });
      } else {
        return api.post("/tourism", {
          ...data,
          image_url: imageUrl,
        });
      }
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Destination updated successfully!"
          : "New destination created successfully!"
      );
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to save destination");
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  if (!isOpen) return null;

  // Available categories
  const categories = ["Air Terjun", "Pemandangan", "Budaya", "Alam", "Danau"];

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode
              ? "Edit Tourism Destination"
              : "Add New Tourism Destination"}
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
                Destination Image
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
                  <div className="w-full border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="text-gray-500 mt-2">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full ${
                    imagePreview ? "hidden" : "opacity-0 absolute"
                  }`}
                  style={{
                    top: 0,
                    left: 0,
                    height: imagePreview ? 0 : "100%",
                  }}
                />
              </div>
            </div>

            {/* Destination name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Destination Name *
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "Destination name is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
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
                Category
              </label>
              <select
                id="category"
                {...register("category")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                {...register("location")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              ></textarea>
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || isUploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 flex items-center"
            >
              {(createMutation.isPending || isUploading) && (
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              )}
              {isEditMode ? "Update Destination" : "Create Destination"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourismDestinationModal;
