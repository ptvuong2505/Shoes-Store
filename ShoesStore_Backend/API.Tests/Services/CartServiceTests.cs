using Application.Common.Errors;
using Application.Common.Exceptions;
using Application.DTOs.Cart;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace API.Tests.Services;

public class CartServiceTests
{
    [Fact]
    public async Task AddToCartAsync_ThrowsUnauthorizedException_ForInvalidUserId()
    {
        await using var context = CreateContext();
        var service = new CartService(context);

        var exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            service.AddToCartAsync(
                "invalid-user-id",
                new AddToCartRequest
                {
                    ProductId = Guid.NewGuid().ToString(),
                    Size = 42,
                    Quantity = 1
                }));

        Assert.Equal(ErrorCodes.Unauthorized, exception.ErrorCode);
    }

    [Fact]
    public async Task AddToCartAsync_ThrowsValidationException_ForInvalidProductId()
    {
        await using var context = CreateContext();
        var service = new CartService(context);

        var exception = await Assert.ThrowsAsync<RequestValidationException>(() =>
            service.AddToCartAsync(
                Guid.NewGuid().ToString(),
                new AddToCartRequest
                {
                    ProductId = "invalid-product-id",
                    Size = 42,
                    Quantity = 1
                }));

        Assert.Equal(ErrorCodes.ValidationError, exception.ErrorCode);
        Assert.Equal(
            ["Invalid productId format."],
            exception.Errors["productId"]);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>().Options;
        return new AppDbContext(options);
    }
}
