using Application.DTOs.Cart;
using Application.Interface;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class CartService : ICartService
    {
        private readonly AppDbContext _context;
        public CartService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CartItemDto>> GetAll(string userId)
        {
            var user = await _context.Users.FindAsync(Guid.Parse(userId));
            if (user == null)
                throw new Exception("User not found");

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
