import axiosClient from "@/api/axiosClient";
import type { User } from "@/types/auth.types";

export const accountApi = {
  getProfile: async (): Promise<User> => {
    return await axiosClient.get("/account/profile");
  },
  upLoadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    return await axiosClient.post("/account/upload-avatar", formData);
  },
};
