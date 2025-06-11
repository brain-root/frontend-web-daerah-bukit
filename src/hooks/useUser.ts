import { useQuery, useMutation } from "@tanstack/react-query";
import { userService, UserUpdateInput } from "../services/userService";
import { queryClient, queryKeys } from "../lib/react-query";
import { toast } from "sonner";

export function useUsersList(params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [queryKeys.users.all, params],
    queryFn: () => userService.getAll(params),
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.users.profile,
    queryFn: userService.getCurrentUserProfile,
  });
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: queryKeys.users.byId(id),
    queryFn: () => userService.getById(id),
    enabled: !!id, // Only run query if id is provided
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: UserUpdateInput) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to update profile");
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdateInput }) =>
      userService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to update user");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => userService.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to change password");
    },
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to delete user");
    },
  });
}

export function useUploadProfileImage() {
  return useMutation({
    mutationFn: (file: File) => userService.uploadProfileImage(file),
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to upload profile image");
    },
  });
}

export function useChangeUserRole() {
  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: "user" | "admin";
    }) => userService.changeRole(userId, role),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.byId(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User role changed successfully");
    },
    onError: (error: any) => {
      toast.error(error.displayMessage || "Failed to change user role");
    },
  });
}
