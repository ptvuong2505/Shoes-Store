import axiosClient from "@/shared/api/axiosClient";
import type { UpdateProfilePayload } from "@/features/account/types/account.types";
import type { Address } from "@/features/account/types/address.types";
import type { User } from "@/features/auth/types/auth.types";

export const accountApi = {
  getProfile: async (): Promise<User> => {
    return await axiosClient.get("/account/profile");
  },
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    return await axiosClient.post("/account/upload-avatar", formData);
  },
  updateProfile: async (data: UpdateProfilePayload): Promise<User> => {
    return await axiosClient.put("/account/update-profile", data);
  },
  getAddresses: async (): Promise<Address[]> => {
    return await axiosClient.get("/account/addresses");
  },

  setPrimary: async (id: string) => {
    return await axiosClient.put(`/account/addresses/${id}/set-primary`);
  },

  deleteAddress: async (id: string) => {
    return axiosClient.delete(`/account/addresses/${id}`);
  },

  create: async (data: Omit<Address, "id">) => {
    return axiosClient.post("/account/addresses", data);
  },
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return axiosClient.put("/account/change-password", data);
  },
};
