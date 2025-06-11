import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";
import { User } from "../lib/auth";
import { Pencil, Save, User as UserIcon, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "../components/ui/LoadingSpinner";

interface ExtendedUser extends User {
  profileImage?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          // In a real app, this would fetch more detailed profile info
          // For now, we'll just use the current user info
          setUserProfile(user as ExtendedUser);
          setFormData({
            fullName: user.fullName || "",
            email: user.email || "",
            bio: (user as ExtendedUser).bio || "",
            phoneNumber: (user as ExtendedUser).phoneNumber || "",
            address: (user as ExtendedUser).address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would update the user profile via API
      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state to reflect changes
      setUserProfile((prev) => (prev ? { ...prev, ...formData } : null));

      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-primary-600 px-6 py-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{userProfile?.fullName}</h1>
                <p className="text-primary-100">{userProfile?.email}</p>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center text-white bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-md"
                >
                  <Pencil size={16} className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center text-primary-800 bg-white hover:bg-primary-50 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {!editing ? (
              <div className="space-y-6">
                <div className="flex items-start">
                  <UserIcon className="text-gray-400 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-900">Full Name</h3>
                    <p className="text-gray-700">{userProfile?.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="text-gray-400 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-700">{userProfile?.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="text-gray-400 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-900">Member Since</h3>
                    <p className="text-gray-700">
                      {new Date(
                        userProfile?.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Biography</h3>
                  <p className="text-gray-700">
                    {userProfile?.bio || "No biography provided."}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Contact Information
                  </h3>
                  <p className="text-gray-700 mb-1">
                    <strong>Phone:</strong>{" "}
                    {userProfile?.phoneNumber || "Not provided"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong>{" "}
                    {userProfile?.address || "Not provided"}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Biography
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="pt-5">
                  <button
                    type="submit"
                    className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
