import type { AdminDashboardResponse } from "@/types/admin.types";
import axiosClient from "./axiosClient";

const getDashboard = async (): Promise<AdminDashboardResponse> => {
  return axiosClient.get("/orders/admin/dashboard");
};

export const adminApi = {
  getDashboard,
};
