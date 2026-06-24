using Application.Common.Errors;
using Application.Common.Exceptions;
using Application.DTOs.Cart;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class CartService : ICartService
    {
        private readonly AppDbContext _context;
        public CartService(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddToCartAsync(string userId, AddToCartRequest request)
        {
            if (!Guid.TryParse(userId, out var parsedUserId))
            {
                throw new UnauthorizedException(
                    ErrorCodes.Unauthorized,
                    "Unauthorized.");
            }

            if (!Guid.TryParse(request.ProductId, out var parsedProductId))
            {
                throw new RequestValidationException(
                    new Dictionary<string, string[]>
                    {
                        ["productId"] = ["Invalid productId format."]
                    });
            }

            if (request.Quantity <= 0)
            {
                throw new RequestValidationException(
                    new Dictionary<string, string[]>
                    {
                        ["quantity"] = ["Quantity must be greater than 0."]
                    });
            }

            if (request.Size <= 0)
            {
                throw new RequestValidationException(
                    new Dictionary<string, string[]>
                    {
                        ["size"] = ["Size must be greater than 0."]
                    });
            }

            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == parsedProductId);
            if (product == null)
            {
                throw new NotFoundException(
                    ErrorCodes.ProductNotFound,
                    "Product not found.");
            }

            var size = await _context.Sizes
                .FirstOrDefaultAsync(s => s.Value == request.Size);
            if (size == null)
            {
                throw new NotFoundException(
                    ErrorCodes.SizeNotFound,
                    "Size not found.");
            }

            var inventory = await _context.ProductInventories
                .FirstOrDefaultAsync(pi => pi.ProductId == parsedProductId && pi.SizeId == size.Id);

            if (inventory == null)
            {
                throw new NotFoundException(
                    ErrorCodes.InventoryNotFound,
                    "Product inventory not found for selected size.");
            }

            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci =>
                    ci.UserId == parsedUserId &&
                    ci.ProductId == parsedProductId &&
                    ci.SizeId == size.Id);

            var nextQuantity = (existingItem?.Quantity ?? 0) + request.Quantity;
            if (inventory.Quantity < nextQuantity)
            {
                throw new ConflictException(
                    ErrorCodes.InsufficientInventory,
                    "Not enough inventory.");
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
        }

        public async Task<List<CartItemDto>> GetAll(string userId)
        {
            if (!Guid.TryParse(userId, out var parsedUserId))
            {
                throw new UnauthorizedException(
                    ErrorCodes.Unauthorized,
                    "Unauthorized.");
            }

            var user = await _context.Users.FindAsync(parsedUserId);
            if (user == null)
            {
                throw new NotFoundException(
                    ErrorCodes.UserNotFound,
                    "User not found.");
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

            return items;
        }
    }
}
