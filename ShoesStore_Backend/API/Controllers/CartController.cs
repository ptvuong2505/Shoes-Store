using Application.DTOs.Cart;
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
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
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

            var cartItems = await _context.CartItems
                .Where(ci => ci.UserId.ToString() == userId)
                .Include(ci => ci.Product)
                    .ThenInclude(p => p.Images)
                .Include(ci => ci.Size)
                .ToListAsync();

            var productIds = cartItems.Select(ci => ci.ProductId).Distinct().ToList();
            var sizeIds = cartItems.Select(ci => ci.SizeId).Distinct().ToList();

            var inventoryLookup = await _context.ProductInventories
                .Where(pi => productIds.Contains(pi.ProductId) && sizeIds.Contains(pi.SizeId))
                .ToDictionaryAsync(pi => new { pi.ProductId, pi.SizeId }, pi => pi.Quantity);

            var items = cartItems.Select(ci =>
            {
                var key = new { ci.ProductId, ci.SizeId };
                var availableQuantity = inventoryLookup.TryGetValue(key, out var qty) ? qty : 0;
                var unitPrice = ci.Product.DiscountPrice ?? ci.Product.Price;

                return new CartItemDto
                {
                    Id = ci.Id.ToString(),
                    ProductId = ci.ProductId.ToString(),
                    ProductName = ci.Product.Name,
                    VariantLabel = $"Size {ci.Size.Value}",
                    Color = null,
                    Size = ci.Size.Value.ToString(),
                    Quantity = ci.Quantity,
                    UnitPrice = unitPrice,
                    ImageUrl = ci.Product.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                        ?? ci.Product.Images.FirstOrDefault()?.ImageUrl
                        ?? string.Empty,
                    IsAvailable = availableQuantity >= ci.Quantity,
                    Selected = true
                };
            }).ToList();

            var selectedSubtotal = items.Sum(i => i.UnitPrice * i.Quantity);
            var shippingFee = 0m;
            var estimatedTax = 0m;

            var response = new CartResponseDto
            {
                Items = items,
                Summary = new CartSummaryDto
                {
                    SelectedItems = items.Count,
                    SelectedSubtotal = selectedSubtotal,
                    ShippingFee = shippingFee,
                    EstimatedTax = estimatedTax,
                    TotalPrice = selectedSubtotal + shippingFee + estimatedTax
                }
            };

            return Ok(response);
        }
    }
}
