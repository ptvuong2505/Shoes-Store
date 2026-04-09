using Application.DTOs.Cart;
using Application.Interface;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ICartService _cartService;

        public CartsController(AppDbContext context, ICartService cartService)
        {
            _context = context;
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

            if (!Guid.TryParse(userId, out var parsedUserId))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(request.ProductId, out var parsedProductId))
            {
                return BadRequest(new { Message = "Invalid productId format." });
            }

            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == parsedProductId);
            if (product == null)
            {
                return NotFound(new { Message = "Product not found." });
            }

            var size = await _context.Sizes
                .FirstOrDefaultAsync(s => s.Value == request.Size);
            if (size == null)
            {
                return BadRequest(new { Message = "Size not found." });
            }

            var inventory = await _context.ProductInventories
                .FirstOrDefaultAsync(pi => pi.ProductId == parsedProductId && pi.SizeId == size.Id);

            if (inventory == null)
            {
                return BadRequest(new { Message = "Product inventory not found for selected size." });
            }

            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci =>
                    ci.UserId == parsedUserId &&
                    ci.ProductId == parsedProductId &&
                    ci.SizeId == size.Id);

            var nextQuantity = (existingItem?.Quantity ?? 0) + request.Quantity;
            if (inventory.Quantity < nextQuantity)
            {
                return BadRequest(new { Message = "Not enough inventory." });
            }

            if (existingItem == null)
            {
                var cartItem = new CartItem
                {
                    Id = Guid.NewGuid(),
                    UserId = parsedUserId,
                    ProductId = parsedProductId,
                    SizeId = size.Id,
                    Quantity = request.Quantity,
                };

                await _context.CartItems.AddAsync(cartItem);
            }
            else
            {
                existingItem.Quantity = nextQuantity;
                _context.CartItems.Update(existingItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Added to cart successfully." });
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
