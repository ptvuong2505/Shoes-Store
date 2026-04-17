export interface DashboardSummary {
  totalSales: number;
  totalSalesGrowthPercent: number;
  totalOrders: number;
  totalOrdersGrowthPercent: number;
  newCustomers: number;
  newCustomersGrowthPercent: number;
  activeUsers: number;
  activeUsersGrowthPercent: number;
}

export interface RevenueByMonthPoint {
  month: number;
  revenue: number;
}

export interface RecentOrder {
  orderId: string;
  customerName: string;
  status: string;
  totalAmount: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  imageUrl?: string | null;
  unitsSold: number;
  unitPrice: number;
}

export interface AdminDashboardResponse {
  summary: DashboardSummary;
  revenueByMonth: RevenueByMonthPoint[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}
