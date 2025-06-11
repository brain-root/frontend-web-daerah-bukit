import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface FormTextareaProps {
  id: string;
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  label,
  name,
  register,
  error,
  rows = 3,
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <textarea
          id={id}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          } ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
          {...register(name)}
        ></textarea>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
