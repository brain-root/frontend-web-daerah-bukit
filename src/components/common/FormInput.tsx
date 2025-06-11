import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface FormInputProps {
  id: string;
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  name,
  register,
  error,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  autoComplete = "",
  className = "",
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <input
          id={id}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          } ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
          {...register(name)}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
