import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { FormInput } from "../common/FormInput";
import { FormTextarea } from "../common/FormTextarea";
import { FormSelect } from "../common/FormSelect";
import { useFormSubmit } from "../../hooks/useFormSubmit";

// Define form schema with zod
const contactSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  subject: z.string().min(1, "Silakan pilih subjek"),
  message: z.string().min(10, "Pesan harus minimal 10 karakter"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Mock API call for contact form submission
const submitContactForm = async (
  data: ContactFormValues
): Promise<{ success: boolean }> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

const subjectOptions = [
  { value: "", label: "Pilih Subjek" },
  { value: "Informasi Wisata", label: "Informasi Wisata" },
  { value: "Bisnis & UMKM", label: "Bisnis & UMKM" },
  { value: "Acara & Kegiatan", label: "Acara & Kegiatan" },
  { value: "Pertanyaan Umum", label: "Pertanyaan Umum" },
  { value: "Lainnya", label: "Lainnya" },
];

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { handleSubmit: handleFormSubmit, isSubmitting } =
    useFormSubmit<ContactFormValues>(
      async (data) => {
        await submitContactForm(data);
        reset();
      },
      {
        successMessage:
          "Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.",
      }
    );

  return (
    <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-6">
      {/* Name */}
      <FormInput
        id="name"
        label="Nama Lengkap"
        register={register}
        name="name"
        error={errors.name}
        required
        placeholder="Masukkan nama lengkap"
      />

      {/* Email */}
      <FormInput
        id="email"
        label="Email"
        register={register}
        name="email"
        error={errors.email}
        required
        type="email"
        placeholder="Masukkan alamat email"
      />

      {/* Subject */}
      <FormSelect
        id="subject"
        label="Subjek"
        register={register}
        name="subject"
        options={subjectOptions}
        error={errors.subject}
        required
      />

      {/* Message */}
      <FormTextarea
        id="message"
        label="Pesan"
        register={register}
        name="message"
        error={errors.message}
        required
        rows={5}
        placeholder="Tulis pesan Anda di sini..."
      />

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary flex items-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="mr-2 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send size={18} className="mr-2" />
            Kirim Pesan
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
