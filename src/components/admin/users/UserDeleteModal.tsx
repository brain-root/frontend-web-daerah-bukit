import { AlertTriangle } from "lucide-react";

type User = {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "user";
};

type UserDeleteModalProps = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

const UserDeleteModal = ({
  user,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: UserDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-50">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-center text-gray-900">
          Delete User
        </h3>
        <p className="mb-6 text-center text-gray-600">
          Are you sure you want to delete user <strong>{user.fullName}</strong>?
          This action cannot be undone.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
