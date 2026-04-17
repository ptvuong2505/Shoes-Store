import type { AdminDashboardResponse } from "@/features/admin/types/admin.types";
import axiosClient from "@/shared/api/axiosClient";

const getDashboard = async (): Promise<AdminDashboardResponse> => {
  return axiosClient.get("/orders/admin/dashboard");
};

export const adminApi = {
  getDashboard,
};
