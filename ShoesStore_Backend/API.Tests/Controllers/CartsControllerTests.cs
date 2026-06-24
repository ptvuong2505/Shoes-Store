using System.Security.Claims;
using API.Controllers;
using Application.Common.Responses;
using Application.DTOs.Cart;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace API.Tests.Controllers;

public class CartsControllerTests
{
    [Fact]
    public async Task AddToCart_ReturnsSuccessfulApiResponse()
    {
        var service = new FakeCartService();
        var controller = CreateController(service);
        var request = new AddToCartRequest
        {
            ProductId = Guid.NewGuid().ToString(),
            Size = 42,
            Quantity = 1
        };

        var result = await controller.AddToCart(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ApiResponse<object?>>(okResult.Value);
        Assert.True(response.Success);
        Assert.Equal(StatusCodes.Status200OK, response.StatusCode);
        Assert.Equal("Added to cart successfully.", response.Message);
        Assert.Null(response.Data);
        Assert.Null(response.Error);
        Assert.Same(request, service.AddedRequest);
    }

    [Fact]
    public async Task GetMyCart_ReturnsItemsInsideApiResponse()
    {
        List<CartItemDto> items =
        [
            new CartItemDto
            {
                Id = "cart-item-1",
                ProductId = "product-1",
                ProductName = "Test shoe"
            }
        ];

        var controller = CreateController(new FakeCartService(items));

        var result = await controller.GetMyCart();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ApiResponse<List<CartItemDto>>>(okResult.Value);
        Assert.True(response.Success);
        Assert.Same(items, response.Data);
        Assert.Equal("Cart retrieved successfully.", response.Message);
    }

    private static CartsController CreateController(ICartService service)
    {
        var userId = Guid.NewGuid().ToString();
        var identity = new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, userId)],
            "Test");

        return new CartsController(service)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(identity)
                }
            }
        };
    }

    private sealed class FakeCartService : ICartService
    {
        private readonly List<CartItemDto> _items;

        public FakeCartService(List<CartItemDto>? items = null)
        {
            _items = items ?? [];
        }

        public AddToCartRequest? AddedRequest { get; private set; }

        public Task AddToCartAsync(string userId, AddToCartRequest request)
        {
            AddedRequest = request;
            return Task.CompletedTask;
        }

        public Task<List<CartItemDto>> GetAll(string userId)
        {
            return Task.FromResult(_items);
        }
    }
}
