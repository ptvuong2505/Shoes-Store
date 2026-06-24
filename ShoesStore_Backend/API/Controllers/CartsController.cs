using Application.Common.Errors;
using Application.Common.Exceptions;
using Application.Common.Responses;
using Application.DTOs.Cart;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartsController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartsController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            var userId = GetCurrentUserId();

            await _cartService.AddToCartAsync(userId, request);

            return Ok(ApiResponse<object?>.Ok(
                null,
                "Added to cart successfully."));
        }

        [HttpGet]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = GetCurrentUserId();

            var items = await _cartService.GetAll(userId);

            return Ok(ApiResponse<List<CartItemDto>>.Ok(
                items,
                "Cart retrieved successfully."));
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(
                    ErrorCodes.Unauthorized,
                    "User ID claim not found.");
        }
    }
}
