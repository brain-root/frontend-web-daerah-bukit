import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

interface UseFormSubmitOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

export function useFormSubmit<T>(
  onSubmit: SubmitHandler<T>,
  options: UseFormSubmitOptions = {}
) {
  const { successMessage, errorMessage, onSuccess } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (getValues: () => T): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const values = getValues();
      await onSubmit(values);

      if (successMessage) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Form submission error:", error);

      toast.error(
        errorMessage ||
          error.response?.data?.error ||
          error.message ||
          "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
