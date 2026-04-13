using Application.DTOs.Paging;

namespace Application.DTOs.Product
{
    public class AdminProductFilter
    {
        public string? Search { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class AdminProductListDto
    {
        public AdminProductSummaryDto Summary { get; set; } = new();
        public PagedResult<AdminProductItemDto> Data { get; set; } = new();
    }

    public class AdminProductSummaryDto
    {
        public int TotalProducts { get; set; }
        public int OutOfStockProducts { get; set; }
        public string TopSellingProductName { get; set; } = string.Empty;
        public int TopSellingUnits { get; set; }
        public double AverageMarginPercent { get; set; }
    }

    public class AdminProductItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? MainImageUrl { get; set; }
        public int TotalStock { get; set; }
        public string StockStatus { get; set; } = string.Empty;
    }

    public class AdminUpsertProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int TotalStock { get; set; }
        public int Size { get; set; } = 42;
        public string? MainImageUrl { get; set; }
        public string? Description { get; set; }
        public string? Gender { get; set; }
    }
}