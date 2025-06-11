import React, { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface FormImageUploadProps {
  label: string;
  imageUrl: string | null;
  onImageChange: (file: File | null) => Promise<void>;
  isUploading: boolean;
  error?: string;
  className?: string;
  required?: boolean;
}

export const FormImageUpload: React.FC<FormImageUploadProps> = ({
  label,
  imageUrl,
  onImageChange,
  isUploading,
  error,
  className = "",
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onImageChange(file);
      } catch (error) {
        console.error("Error handling file change:", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        await onImageChange(file);
      } catch (error) {
        console.error("Error handling dropped file:", error);
      }
    }
  };

  const removeImage = async () => {
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Call onImageChange with null to reset the image
    await onImageChange(null);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {imageUrl ? (
        <div className="relative">
          {isUploading && (
            <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          )}
          <div className="relative bg-gray-100 rounded-md overflow-hidden h-64">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700"
          >
            Change image
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-6 ${
            dragActive ? "border-primary-400 bg-primary-50" : "border-gray-300"
          } ${
            isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={isUploading ? undefined : handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-3" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop your image here or{" "}
                  <span className="text-primary-600 font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
