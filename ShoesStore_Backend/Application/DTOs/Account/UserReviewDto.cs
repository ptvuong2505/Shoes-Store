namespace Application.DTOs.Account
{
    public record UserReviewDto(
        Guid Id,
        Guid ProductId,
        string ProductName,
        string? ProductImageUrl,
        int Rating,
        string Comment,
        DateTime CreatedAt
    );
}
