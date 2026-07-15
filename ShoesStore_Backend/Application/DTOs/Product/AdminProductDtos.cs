using Application.DTOs.Paging;

namespace Application.DTOs.Product;

public class AdminProductFilter
{
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public record AdminProductListDto(
    AdminProductSummaryDto Summary,
    PagedResult<AdminProductItemDto> Data);

public record AdminProductSummaryDto(
    int TotalProducts,
    int OutOfStockProducts,
    string TopSellingProductName,
    int TopSellingUnits,
    double AverageMarginPercent);

public record AdminProductItemDto
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Sku { get; init; }
    public required string Brand { get; init; }
    public decimal Price { get; init; }
    public string? MainImageUrl { get; init; }
    public int TotalStock { get; init; }
    public required string StockStatus { get; init; }
}

public record AdminUpsertProductRequest(
    string Name,
    string Brand,
    decimal Price,
    decimal? DiscountPrice,
    int TotalStock,
    int Size = 42,
    string? MainImageUrl = null,
    string? Description = null,
    string? Gender = null);
