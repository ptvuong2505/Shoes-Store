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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            if (request == null || string.IsNullOrWhiteSpace(request.ProductId))
            {
                return BadRequest(new { Message = "productId is required." });
            }

            if (request.Quantity <= 0)
            {
                return BadRequest(new { Message = "quantity must be greater than 0." });
            }

            if (request.Size <= 0)
            {
                return BadRequest(new { Message = "size must be greater than 0." });
            }

            try
            {
                await _cartService.AddToCartAsync(userId, request);
                return Ok(new { Message = "Added to cart successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            var items = await _cartService.GetAll(userId);

            return Ok(items);
        }
    }
}
