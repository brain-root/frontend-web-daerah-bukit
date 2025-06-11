import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Loader2, Calendar, Clock } from "lucide-react";
import {
  useCreateEvent,
  useUpdateEvent,
  useUploadEventImage,
} from "../../../hooks/useEvents";
import { Event } from "../../../types/event";
import { toast } from "sonner";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: Event;
}

// Form validation schema
const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
});

type FormData = z.infer<typeof eventSchema>;

const EventModal = ({ isOpen, onClose, onSuccess, event }: EventModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.image_url || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditMode = !!event;

  // Mutations
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const uploadMutation = useUploadEventImage();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name || "",
      description: event?.description || "",
      location: event?.location || "",
      date: event?.date || "",
      time: event?.time || "",
    },
  });

  // Reset form when event changes
  useEffect(() => {
    if (event) {
      reset({
        name: event.name || "",
        description: event.description || "",
        location: event.location || "",
        date: event.date || "",
        time: event.time || "",
      });
      setImagePreview(event.image_url || null);
    } else {
      reset({
        name: "",
        description: "",
        location: "",
        date: "",
        time: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [event, reset, isOpen]);

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
      let imageUrl = event?.image_url || "";

      if (imageFile) {
        const result = await uploadMutation.mutateAsync(imageFile);
        imageUrl = result.imageUrl;
      }

      // Then create/update the event with image URL
      if (isEditMode && event) {
        await updateMutation.mutateAsync({
          id: event.id,
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
        isEditMode ? "Acara berhasil diperbarui" : "Acara baru berhasil dibuat"
      );
      onSuccess();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Gagal menyimpan acara. Silakan coba lagi.");
    }
  };

  if (!isOpen) return null;

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Edit Acara" : "Tambah Acara Baru"}
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
                Gambar Acara
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

            {/* Event name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Acara *
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tanggal
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-accent-500">
                  <Calendar size={18} />
                </span>
                <input
                  id="date"
                  type="text"
                  {...register("date")}
                  placeholder="contoh: 15 - 20 Agustus 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Waktu
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-accent-500">
                  <Clock size={18} />
                </span>
                <input
                  id="time"
                  type="text"
                  {...register("time")}
                  placeholder="contoh: 09:00 - 17:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 flex items-center"
            >
              {isSubmitting && (
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              )}
              {isEditMode ? "Perbarui Acara" : "Buat Acara"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
