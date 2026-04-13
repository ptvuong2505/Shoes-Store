namespace Application.DTOs.Order
{
    public class AdminDashboardDto
    {
        public DashboardSummaryDto Summary { get; set; } = new();
        public List<DashboardRevenuePointDto> RevenueByMonth { get; set; } = new();
        public List<DashboardRecentOrderDto> RecentOrders { get; set; } = new();
        public List<DashboardTopProductDto> TopProducts { get; set; } = new();
    }

    public class DashboardSummaryDto
    {
        public decimal TotalSales { get; set; }
        public double TotalSalesGrowthPercent { get; set; }
        public int TotalOrders { get; set; }
        public double TotalOrdersGrowthPercent { get; set; }
        public int NewCustomers { get; set; }
        public double NewCustomersGrowthPercent { get; set; }
        public int ActiveUsers { get; set; }
        public double ActiveUsersGrowthPercent { get; set; }
    }

    public class DashboardRevenuePointDto
    {
        public int Month { get; set; }
        public decimal Revenue { get; set; }
    }

    public class DashboardRecentOrderDto
    {
        public string OrderId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }

    public class DashboardTopProductDto
    {
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int UnitsSold { get; set; }
        public decimal UnitPrice { get; set; }
    }
}