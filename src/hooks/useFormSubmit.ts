import { useState } from "react";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";

/**
 * Custom hook for handling form submission with API integration
 *
 * @param submitFn The function to call with the form data on submission
 * @param options Configuration options
 * @returns Object with submission handler, loading state, and error
 */
export function useFormSubmit<T extends FieldValues>(
  submitFn: (data: T) => Promise<any>,
  options: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) {
  const {
    onSuccess,
    onError,
    successMessage = "Successfully submitted!",
    errorMessage = "An error occurred. Please try again.",
  } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (formData: T) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitFn(formData);

      if (successMessage) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err: any) {
      const displayMessage =
        err.displayMessage ||
        err.response?.data?.error ||
        err.message ||
        errorMessage;

      if (errorMessage) {
        toast.error(displayMessage);
      }

      setError(err);

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    error,
  };
}
