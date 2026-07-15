namespace Application.DTOs.Product;

public record ProductDetailDto : ProductDto
{
    public List<string> ImageUrls { get; init; } = [];
    public List<ProductSizeDto> Sizes { get; init; } = [];
    public List<int> Ratings { get; init; } = [0, 0, 0, 0, 0];
    public List<ReviewDto> Reviews { get; init; } = [];
}

public record ProductSizeDto(int Size, int Stock);

public record ReviewDto(Guid Id, string Name, int Rating, string Comment, DateTime CreatedAt);
