namespace Application.DTOs.Product;

public record ProductDto
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Gender { get; init; }
    public decimal Price { get; init; }
    public decimal? DiscountPrice { get; init; }
    public required string Description { get; init; }
    public required string Brand { get; init; }
    public double AverageRating { get; init; }
    public int TotalRatings { get; init; }
    public required string MainImageUrl { get; init; }
}
